import Agenda from 'agenda';
import axios from 'axios';
import parser from 'cron-parser';

import { env } from '../config/env.js';
import Monitor from '../models/Monitor.js';
import CheckLog from '../models/CheckLog.js';
import User from '../models/User.js';

import {
	sendDownAlert,
	sendRecoveryAlert,
} from '../services/alertService.js';

export const agenda = new Agenda({
	db: {
		address: env.mongodbUri,
		collection: env.agendaCollection,
	},
	processEvery: '30 seconds',
	maxConcurrency: 20,
});

const SWEEP_JOB = 'sweep-active-monitors';
const CHECK_JOB = 'run-monitor-check';

const REQUEST_TIMEOUT_MS = 10_000;

agenda.define(SWEEP_JOB,{concurrency: 1,}, async()=> {
	const activeMonitors = await Monitor.find({isActive: true});

	if (activeMonitors.length === 0) return;

	const now = new Date();

	const dueMonitors = [];

	for (const monitor of activeMonitors) if (isDue(monitor, now)) dueMonitors.push(monitor);

	if (dueMonitors.length === 0) return;
	
	await Promise.all(
		dueMonitors.map(async (monitor) => {
			monitor.nextExpectedAt = getNextRunDate(monitor,now);
			await monitor.save();
			await agenda.now(CHECK_JOB, {monitorId: monitor._id.toString(),});
		})
	);
});

/*
|--------------------------------------------------------------------------
| IS MONITOR DUE?
|--------------------------------------------------------------------------
*/

function isDue(monitor, now) {
	if (!monitor.nextExpectedAt) return true;
	return now.getTime() >= monitor.nextExpectedAt.getTime();
}

/*
|--------------------------------------------------------------------------
| GET NEXT CHECK DATE
|--------------------------------------------------------------------------
*/

function getNextRunDate(monitor, from) {
	try {
		const dt = {
			currentDate: from,
			tz: monitor.timezone || 'UTC',
		}
		const interval = parser.parseExpression(monitor.schedule,dt);
		return interval.next().toDate();
	} catch (err) {
		console.error(`[agenda] Invalid cron schedule for monitor ${monitor._id}:`,monitor.schedule);
		return new Date( from.getTime() + 60 * 60 * 1000);
	}
}

/*
|--------------------------------------------------------------------------
| CHECK JOB
|--------------------------------------------------------------------------
*/

agenda.define(
	CHECK_JOB,
	{concurrency: 20},
	async (job) => {

		const { monitorId } = job.attrs.data;
		console.log("The Agenda Work Started For ", monitorId)
		const monitor = await Monitor.findById(monitorId);
		if (!monitor || !monitor.isActive) return;
	
		/*
		* ---------------------------------------------------
		* 1. CHECK WEBSITE
		* ---------------------------------------------------
		*/
		const startedAt = Date.now();

		let status = 'down';
		let statusCode = null;
		let errorMessage = null;

		try {
			const response = await axios.get(monitor.url,
				{
					timeout: REQUEST_TIMEOUT_MS,
					validateStatus: () => true,
				}
			);

			statusCode = response.status;

			if (response.status >= 200 && response.status < 400) status = 'up';
			else {
				status = 'down';
				errorMessage =`Unexpected status code: ${response.status}`;
			}
		} catch (err) {
			status = 'down';
			if (err.code === 'ECONNABORTED') errorMessage = `Request timed out after ${REQUEST_TIMEOUT_MS}ms`;
			else {
				errorMessage =
				err.message || 'Request failed';
			}
		}
		const checkedAt = new Date();
		const responseTime = Date.now() - startedAt;
		/*
		* ---------------------------------------------------
		* 2. SAVE CHECK LOG
		* ---------------------------------------------------
		*/
		const checkLog = await CheckLog.create({
			monitorId: monitor._id,
			status,
			responseTime,
			statusCode,
			errorMessage,
			checkedAt,
		});

		/*
		* ---------------------------------------------------
		* 3. GET PREVIOUS STATE
		* ---------------------------------------------------
		*/
		const previousStatus = monitor.lastStatus;
		const previousAlertSent = monitor.alertSent === true;
		const wasAlertedDown = previousAlertSent;
		/*
		* ---------------------------------------------------
		* 4. UPDATE BASIC MONITOR INFORMATION
		* ---------------------------------------------------
		*/
		monitor.lastCheckAt = checkedAt;
		/*
		* ---------------------------------------------------
		* 5. HANDLE UP
		* ---------------------------------------------------
		*/
		if (status === 'up') {
			const shouldSendRecovery = previousStatus === 'down' && wasAlertedDown;
			monitor.lastStatus = 'up';
			monitor.consecutiveFailures = 0;
			monitor.downSince = null;
			monitor.alertSent = false;
			await monitor.save();
			if (shouldSendRecovery) {
				const user = await User.findById(monitor.userId);
				if (user) {
					try {
						await sendRecoveryAlert({monitor,user,checkLog,});
					} catch (err) {
						console.error('[alert] Recovery email failed:',err);
					}
				}
			}
			return;
		}
		/*
		* ---------------------------------------------------
		* 6. HANDLE DOWN
		* ---------------------------------------------------
		*/
		if (previousStatus !== 'down' || !monitor.downSince) {
			monitor.downSince = checkedAt;
			monitor.consecutiveFailures = 1;
		} else monitor.consecutiveFailures = (monitor.consecutiveFailures || 0) + 1;

		monitor.lastStatus = 'down';
		/*
		* ---------------------------------------------------
		* 7. CHECK GRACE PERIOD
		* ---------------------------------------------------
		*/
		const gracePeriodMinutes = Number(monitor.gracePeriod || 0);
		const gracePeriodMs = gracePeriodMinutes * 60 * 1000;
		const downSince = monitor.downSince ? new Date(monitor.downSince): checkedAt;
		const downDurationMs = checkedAt.getTime() - downSince.getTime();
		const gracePeriodReached = downDurationMs >= gracePeriodMs;
		/*
		* ---------------------------------------------------
		* 8. SEND DOWN ALERT
		* ---------------------------------------------------
		*/
		const shouldSendDownAlert = status === 'down' && gracePeriodReached && !monitor.alertSent;
		await monitor.save();

		if (!shouldSendDownAlert) return   console.log('[alert] Down alert NOT triggered', {
			monitorId: monitor._id.toString(),
			previousStatus,
			currentStatus: status,
			alertSent: monitor.alertSent,
			downDurationMs,
			gracePeriodMs,
			gracePeriodReached,
		});

		const user = await User.findById(monitor.userId);

		if (!user) return console.error(`[alert] User not found for monitor ${monitor._id}`);
		const alertResult = await sendDownAlert({monitor,user,checkLog,});
		console.log("We are Sending To", user.email)

		if (alertResult.sent) {
			monitor.alertSent = true;
			monitor.downSince = downSince;
			await monitor.save();
			console.log(`[alert] Down alert sent via ${alertResult.channels.join(', ')}`);
		} else
			console.error(`[alert] No notification channel succeeded for monitor ${monitor._id}`);
	}
);

/*
|--------------------------------------------------------------------------
| START AGENDA
|--------------------------------------------------------------------------
*/

export async function startAgenda() {
	await agenda.start();

	await agenda.every('1 minute', SWEEP_JOB);

	console.log('[agenda] started, sweeping active monitors every 1 minute');
}

/*
|--------------------------------------------------------------------------
| STOP AGENDA
|--------------------------------------------------------------------------
*/

export async function stopAgenda() {
	await agenda.stop();

	console.log('[agenda] stopped');
}