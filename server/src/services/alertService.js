
import { Resend } from 'resend';
import axios from 'axios';

import { env } from '../config/env.js';

const resend = new Resend(env.resendApiKey);

/*
|--------------------------------------------------------------------------
| PUBLIC ALERT FUNCTIONS
|--------------------------------------------------------------------------
*/

export async function sendDownAlert({monitor,user,checkLog,}) {
	console.log("the sendDownAlert is Called for monitor", monitor.name)
  	return sendAlerts({monitor,user,checkLog,direction: 'down'});
}

export async function sendRecoveryAlert({monitor,user,checkLog}) {
  	return sendAlerts({monitor, user, checkLog, direction: 'up'});
}


async function sendAlerts({monitor,user,checkLog,direction,}) {
	const results = await Promise.allSettled([
		sendEmailAlert({monitor,user,checkLog,direction,}),

		sendSlackAlert({monitor,checkLog,direction,}),

		sendWebhookAlert({monitor,checkLog,direction,}),
	]);

	logFailures(`${direction}-alert`,monitor._id,results);

	const sentChannels = results
		.filter((result) =>result.status === 'fulfilled' &&result.value?.sent === true)
		.map((result) => result.value.channel)
	;

	const check = sentChannels.length > 0;
	return { sent:check ,channels: sentChannels,results,};
}
/*
|--------------------------------------------------------------------------
| EMAIL
|--------------------------------------------------------------------------
*/

async function sendEmailAlert({monitor,user,checkLog,direction,}) {
	const channel =monitor.alertChannels?.email;
	if (!channel?.enabled) return {skipped: true,reason: 'email disabled'};

	const to = channel.address || user.email;
	if (!to) return {skipped: true,reason: 'no email address',};

	console.log("The send messageAlert is working 🟢")

	const isDown = direction === 'down';
	const subject = isDown ? `🔴 ${monitor.name} is DOWN` : `🟢 ${monitor.name} is back up `;
	const html = isDown ? buildDownEmail({ monitor, checkLog,}) : buildRecoveryEmail({monitor,checkLog,});


	const text = isDown
	? `
	${monitor.name} is down

	Your monitor detected that the endpoint is currently unavailable.

	URL: ${monitor.url}
	Status code: ${checkLog.statusCode ?? 'N/A'}
	Error: ${checkLog.errorMessage || 'No response'}
	Response time: ${checkLog.responseTime ?? 'N/A'} ms
	Checked at: ${checkLog.checkedAt.toISOString()}
	`.trim()
	: `
${monitor.name} is back up

Your monitored endpoint is responding normally again.

URL: ${monitor.url}
Status code: ${checkLog.statusCode ?? 'N/A'}
Response time: ${checkLog.responseTime ?? 'N/A'} ms
Recovered at: ${checkLog.checkedAt.toISOString()}
  `.trim();
	const result = await resend.emails.send({from: env.alertFromEmail, to, subject, html,text});

	if (result?.error) throw new Error(result.error.message ||'Resend failed to send email');
	if (result?.error) console.log("The send messageAlert is'n working 🔴", result.error)
	
	console.log(`[alerts] ${direction} email sent to ${to} for monitor ${monitor._id}`);

	return {sent: true, channel: 'email', to, result};
}

/*
|--------------------------------------------------------------------------
| DOWN EMAIL HTML
|--------------------------------------------------------------------------
*/

function buildDownEmail({ monitor, checkLog }) {
	const statusCode = checkLog.statusCode ?? 'N/A';
	const error = checkLog.errorMessage || 'No response';
	const responseTime = checkLog.responseTime ?? 'N/A';
	const checkedAt = checkLog.checkedAt?.toISOString() ?? 'N/A';

	return `
		<!DOCTYPE html>
		<html>
		<body style="
			margin: 0;
			padding: 0;
			background-color: #f4f6f8;
			font-family: Arial, Helvetica, sans-serif;
			color: #172033;
		">

			<table
			width="100%"
			cellpadding="0"
			cellspacing="0"
			border="0"
			style="background-color: #f4f6f8; padding: 40px 16px;"
			>
			<tr>
				<td align="center">

				<table
					width="600"
					cellpadding="0"
					cellspacing="0"
					border="0"
					style="
					max-width: 600px;
					width: 100%;
					background: #ffffff;
					border-radius: 12px;
					overflow: hidden;
					border: 1px solid #e5e7eb;
					"
				>

					<!-- HEADER -->
					<tr>
					<td style="
						padding: 24px 28px;
						border-bottom: 1px solid #e5e7eb;
					">
						<div style="
						font-size: 22px;
						font-weight: 700;
						color: #111827;
						">
						cornwatch
						</div>

						<div style="
						margin-top: 4px;
						font-size: 13px;
						color: #6b7280;
						">
						Website monitoring
						</div>
					</td>
					</tr>

					<!-- ALERT -->
					<tr>
					<td style="padding: 32px 28px 20px;">

						<div style="
						display: inline-block;
						padding: 7px 12px;
						background: #fee2e2;
						color: #b91c1c;
						border-radius: 999px;
						font-size: 12px;
						font-weight: 700;
						text-transform: uppercase;
						letter-spacing: 0.5px;
						">
						Endpoint down
						</div>

						<h1 style="
						margin: 16px 0 8px;
						font-size: 26px;
						line-height: 1.3;
						color: #111827;
						">
						${escapeHtml(monitor.name)} is down
						</h1>

						<p style="
						margin: 0;
						font-size: 15px;
						line-height: 1.6;
						color: #6b7280;
						">
						Your monitor detected that this endpoint is currently unavailable.
						</p>

					</td>
					</tr>

					<!-- MONITOR -->
					<tr>
					<td style="padding: 0 28px 24px;">

						<table
						width="100%"
						cellpadding="0"
						cellspacing="0"
						border="0"
						style="
							background: #f9fafb;
							border: 1px solid #e5e7eb;
							border-radius: 10px;
						"
						>
						<tr>
							<td style="padding: 18px;">

							<div style="
								font-size: 12px;
								color: #6b7280;
								margin-bottom: 6px;
							">
								MONITOR URL
							</div>

							<div style="
								font-size: 14px;
								color: #111827;
								word-break: break-all;
							">
								${escapeHtml(monitor.url)}
							</div>

							</td>
						</tr>
						</table>

					</td>
					</tr>

					<!-- DETAILS -->
					<tr>
					<td style="padding: 0 28px 28px;">

						<table
						width="100%"
						cellpadding="0"
						cellspacing="0"
						border="0"
						>

						<tr>
							<td width="50%" style="
							padding: 16px;
							border: 1px solid #e5e7eb;
							border-radius: 10px;
							">
							<div style="
								font-size: 11px;
								color: #6b7280;
								text-transform: uppercase;
							">
								Status code
							</div>

							<div style="
								margin-top: 6px;
								font-size: 22px;
								font-weight: 700;
								color: #dc2626;
							">
								${statusCode}
							</div>
							</td>

							<td width="16"></td>

							<td width="50%" style="
							padding: 16px;
							border: 1px solid #e5e7eb;
							border-radius: 10px;
							">
							<div style="
								font-size: 11px;
								color: #6b7280;
								text-transform: uppercase;
							">
								Response time
							</div>

							<div style="
								margin-top: 6px;
								font-size: 22px;
								font-weight: 700;
								color: #111827;
							">
								${responseTime} ms
							</div>
							</td>
						</tr>

						</table>

					</td>
					</tr>

					<!-- ERROR -->
					<tr>
					<td style="padding: 0 28px 28px;">

						<div style="
						font-size: 11px;
						font-weight: 700;
						color: #6b7280;
						text-transform: uppercase;
						margin-bottom: 8px;
						">
						Error
						</div>

						<div style="
						padding: 14px 16px;
						background: #fff7ed;
						border: 1px solid #fed7aa;
						border-radius: 8px;
						color: #9a3412;
						font-size: 14px;
						line-height: 1.5;
						word-break: break-word;
						">
						${escapeHtml(error)}
						</div>

					</td>
					</tr>

					<!-- TIME -->
					<tr>
					<td style="padding: 0 28px 32px;">

						<div style="
						font-size: 12px;
						color: #6b7280;
						">
						Checked at
						</div>

						<div style="
						margin-top: 5px;
						font-size: 13px;
						color: #374151;
						">
						${escapeHtml(checkedAt)}
						</div>

					</td>
					</tr>

					<!-- FOOTER -->
					<tr>
					<td style="
						padding: 22px 28px;
						background: #f9fafb;
						border-top: 1px solid #e5e7eb;
					">

						<div style="
						font-size: 12px;
						color: #6b7280;
						line-height: 1.6;
						">
						This alert was sent by cornwatch because your monitored
						endpoint failed its health check.
						</div>

						<div style="
						margin-top: 8px;
						font-size: 12px;
						color: #9ca3af;
						">
						© cornwatch
						</div>

					</td>
					</tr>

				</table>

				</td>
			</tr>
			</table>

		</body>
		</html>
	`;
}
/*
|--------------------------------------------------------------------------
| RECOVERY EMAIL HTML
|--------------------------------------------------------------------------
*/
function buildRecoveryEmail({ monitor, checkLog }) {
  const statusCode = checkLog.statusCode ?? 'N/A';
  const responseTime = checkLog.responseTime ?? 'N/A';
  const checkedAt = checkLog.checkedAt?.toISOString() ?? 'N/A';

  return `
    <!DOCTYPE html>
    <html>
      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
        color: #172033;
      ">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color: #f4f6f8; padding: 40px 16px;"
        >
          <tr>
            <td align="center">

              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width: 600px;
                  width: 100%;
                  background: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  border: 1px solid #e5e7eb;
                "
              >

                <!-- HEADER -->
                <tr>
                  <td style="
                    padding: 24px 28px;
                    border-bottom: 1px solid #e5e7eb;
                  ">
                    <div style="
                      font-size: 22px;
                      font-weight: 700;
                      color: #111827;
                    ">
                      cornwatch
                    </div>

                    <div style="
                      margin-top: 4px;
                      font-size: 13px;
                      color: #6b7280;
                    ">
                      Website monitoring
                    </div>
                  </td>
                </tr>

                <!-- RECOVERY -->
                <tr>
                  <td style="padding: 32px 28px 20px;">

                    <div style="
                      display: inline-block;
                      padding: 7px 12px;
                      background: #dcfce7;
                      color: #15803d;
                      border-radius: 999px;
                      font-size: 12px;
                      font-weight: 700;
                      text-transform: uppercase;
                      letter-spacing: 0.5px;
                    ">
                      Recovered
                    </div>

                    <h1 style="
                      margin: 16px 0 8px;
                      font-size: 26px;
                      line-height: 1.3;
                      color: #111827;
                    ">
                      ${escapeHtml(monitor.name)} is back up
                    </h1>

                    <p style="
                      margin: 0;
                      font-size: 15px;
                      line-height: 1.6;
                      color: #6b7280;
                    ">
                      Your monitored endpoint is responding normally again.
                    </p>

                  </td>
                </tr>

                <!-- URL -->
                <tr>
                  <td style="padding: 0 28px 24px;">

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        background: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 10px;
                      "
                    >
                      <tr>
                        <td style="padding: 18px;">

                          <div style="
                            font-size: 12px;
                            color: #6b7280;
                            margin-bottom: 6px;
                          ">
                            MONITOR URL
                          </div>

                          <div style="
                            font-size: 14px;
                            color: #111827;
                            word-break: break-all;
                          ">
                            ${escapeHtml(monitor.url)}
                          </div>

                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- DETAILS -->
                <tr>
                  <td style="padding: 0 28px 28px;">

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >

                      <tr>

                        <td width="50%" style="
                          padding: 16px;
                          border: 1px solid #e5e7eb;
                          border-radius: 10px;
                        ">
                          <div style="
                            font-size: 11px;
                            color: #6b7280;
                            text-transform: uppercase;
                          ">
                            Status code
                          </div>

                          <div style="
                            margin-top: 6px;
                            font-size: 22px;
                            font-weight: 700;
                            color: #16a34a;
                          ">
                            ${statusCode}
                          </div>
                        </td>

                        <td width="16"></td>

                        <td width="50%" style="
                          padding: 16px;
                          border: 1px solid #e5e7eb;
                          border-radius: 10px;
                        ">
                          <div style="
                            font-size: 11px;
                            color: #6b7280;
                            text-transform: uppercase;
                          ">
                            Response time
                          </div>

                          <div style="
                            margin-top: 6px;
                            font-size: 22px;
                            font-weight: 700;
                            color: #111827;
                          ">
                            ${responseTime} ms
                          </div>
                        </td>

                      </tr>

                    </table>

                  </td>
                </tr>

                <!-- TIME -->
                <tr>
                  <td style="padding: 0 28px 32px;">

                    <div style="
                      font-size: 12px;
                      color: #6b7280;
                    ">
                      Recovered at
                    </div>

                    <div style="
                      margin-top: 5px;
                      font-size: 13px;
                      color: #374151;
                    ">
                      ${escapeHtml(checkedAt)}
                    </div>

                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="
                    padding: 22px 28px;
                    background: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                  ">

                    <div style="
                      font-size: 12px;
                      color: #6b7280;
                      line-height: 1.6;
                    ">
                      Your cornwatch monitor is back to normal.
                    </div>

                    <div style="
                      margin-top: 8px;
                      font-size: 12px;
                      color: #9ca3af;
                    ">
                      © cornwatch
                    </div>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;
}

/*
|--------------------------------------------------------------------------
| SLACK
|--------------------------------------------------------------------------
*/

// async function sendSlackAlert({monitor, checkLog, direction}) {
// 	const channel = monitor.alertChannels?.slack;
// 	if (!channel?.enabled || !channel.webhookUrl) return {skipped: true,reason: 'slack disabled',};
	
// 	const isDown = direction === 'down';

// 	const text = isDown ?
// 		[
// 			`:red_circle: *${monitor.name}* is DOWN`,
// 			`> URL: ${monitor.url}`,
// 			`> Status: ${checkLog.statusCode ?? 'N/A'}`,
// 			`> Error: ${checkLog.errorMessage || 'No response'}`,
// 		].join('\n')
// 		: 
// 		[
// 			`:large_green_circle: *${monitor.name}* recovered`,
// 			`> URL: ${monitor.url}`,
// 			`> Response time: ${checkLog.responseTime ?? 'N/A'}ms`,
// 		].join('\n')
// 	;

// 	const response = await axios.post(channel.webhookUrl, {text}, {timeout: 5000});

// 	console.log(`[alerts] ${direction} Slack alert sent for monitor ${monitor._id}`);

// 	return {
// 		sent: true,
// 		channel: 'slack',
// 		result: response.data,
// 	};
// }
async function sendSlackAlert({ monitor, checkLog, direction }) {
	const channel = monitor.alertChannels?.slack;

	if (!channel?.enabled || !channel.webhookUrl) {
		return {
			skipped: true,
			reason: 'slack disabled',
		};
	}

	const isDown = direction === 'down';

	const statusCode = checkLog.statusCode ?? 'N/A';
	const responseTime = checkLog.responseTime ?? 'N/A';
	const error = checkLog.errorMessage || 'No response';
	const checkedAt = checkLog.checkedAt
		? new Date(checkLog.checkedAt).toLocaleString()
		: 'N/A';

	const blocks = isDown
		? [
				{
					type: 'header',
					text: {
						type: 'plain_text',
						text: '🔴 Monitor Down',
						emoji: true,
					},
				},

				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `*${monitor.name}* is currently unavailable.`,
					},
				},

				{
					type: 'divider',
				},

				{
					type: 'section',
					fields: [
						{
							type: 'mrkdwn',
							text: `*Monitor*\n${monitor.name}`,
						},
						{
							type: 'mrkdwn',
							text: `*Status*\n🔴 DOWN`,
						},
						{
							type: 'mrkdwn',
							text: `*Status Code*\n\`${statusCode}\``,
						},
						{
							type: 'mrkdwn',
							text: `*Response Time*\n${responseTime} ms`,
						},
					],
				},

				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `*Endpoint*\n<${monitor.url}|${monitor.url}>`,
					},
				},

				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `*Error*\n\`${error}\``,
					},
				},

				{
					type: 'context',
					elements: [
						{
							type: 'mrkdwn',
							text: `🕐 Checked at ${checkedAt} • cornwatch Monitoring`,
						},
					],
				},
			]
		: [
				{
					type: 'header',
					text: {
						type: 'plain_text',
						text: '🟢 Monitor Recovered',
						emoji: true,
					},
				},

				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `*${monitor.name}* is back online and responding normally.`,
					},
				},

				{
					type: 'divider',
				},

				{
					type: 'section',
					fields: [
						{
							type: 'mrkdwn',
							text: `*Monitor*\n${monitor.name}`,
						},
						{
							type: 'mrkdwn',
							text: `*Status*\n🟢 UP`,
						},
						{
							type: 'mrkdwn',
							text: `*Status Code*\n\`${statusCode}\``,
						},
						{
							type: 'mrkdwn',
							text: `*Response Time*\n${responseTime} ms`,
						},
					],
				},

				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `*Endpoint*\n<${monitor.url}|${monitor.url}>`,
					},
				},

				{
					type: 'context',
					elements: [
						{
							type: 'mrkdwn',
							text: `🕐 Recovered at ${checkedAt} • cornwatch Monitoring`,
						},
					],
				},
			];

	const response = await axios.post(
		channel.webhookUrl,
		{
			blocks,
			text: isDown
				? `🔴 ${monitor.name} is DOWN`
				: `🟢 ${monitor.name} recovered`,
		},
		{
			timeout: 5000,
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	console.log(
		`[alerts] ${direction} Slack alert sent for monitor ${monitor._id}`
	);

	return {
		sent: true,
		channel: 'slack',
		result: response.data,
	};
}

/*
|--------------------------------------------------------------------------
| GENERIC WEBHOOK
|--------------------------------------------------------------------------
*/

async function sendWebhookAlert({monitor,checkLog,direction}) {
	const channel = monitor.alertChannels?.webhook;

	if ( !channel?.enabled || !channel.url ) return {skipped: true, reason: 'webhook disabled'};

	const payload = {
		event: direction === 'down' ? 'monitor.down' : 'monitor.recovered',

		monitor: {
			id: monitor._id.toString(),
			name: monitor.name,
			url: monitor.url,
		},

		check: {
			status: checkLog.status,

			statusCode:checkLog.statusCode,

			responseTime:checkLog.responseTime,

			errorMessage:checkLog.errorMessage,

			checkedAt:checkLog.checkedAt,
		},
	};

	const response = await axios.post(channel.url, payload, {timeout: 5000,});

	console.log(`[alerts] ${direction} webhook sent for monitor ${monitor._id}`);

	return {
		sent: true,
		channel: 'webhook',
		result: response.data,
	};
}

/*
|--------------------------------------------------------------------------
| LOG FAILURES
|--------------------------------------------------------------------------
*/

function logFailures(label, monitorId, results) {
	results.forEach(
		(result, index) => {

			if (result.status === 'rejected') console.error(`
				[alerts] ${label} channel #${index} failed for monitor ${monitorId}:`,
				result.reason?.message || result.reason
			);
		
		}
	);
}

/*
|--------------------------------------------------------------------------
| HTML ESCAPE
|--------------------------------------------------------------------------
|
| Prevents monitor names / URLs / errors from injecting
| HTML into the email.
|
*/

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}