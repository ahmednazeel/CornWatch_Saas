// import { createApp } from './app.js';
// import { connectDB } from './config/db.js';
// import { startAgenda, stopAgenda } from './jobs/agenda.js';
// import { env } from './config/env.js';

// async function main() {
//   await connectDB();

//   const app = createApp();

//   const server = app.listen(env.port, () => {
//     console.log(`[server] listening on port ${env.port} (${env.nodeEnv})`);
//   });

//   await startAgenda();

//   const shutdown = async (signal) => {
//     console.log(`[server] received ${signal}, shutting down gracefully...`);
//     server.close();
//     await stopAgenda();
//     process.exit(0);
//   };

//   process.on('SIGINT', () => shutdown('SIGINT'));
//   process.on('SIGTERM', () => shutdown('SIGTERM'));
// }

// main().catch((err) => {
//   console.error('[server] fatal startup error:', err);
//   process.exit(1);
// });
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { startAgenda, stopAgenda } from './jobs/agenda.js';
import { env } from './config/env.js';

async function main() {
	await connectDB();

	const app = createApp();

	const server = app.listen(env.port, () => {
		console.log(`[server] listening on port ${env.port} (${env.nodeEnv})`);
	});

	await startAgenda();

	let isShuttingDown = false;

	const shutdown = async (signal) => {
		if (isShuttingDown) return;
		isShuttingDown = true;

		console.log(`[server] received ${signal}, shutting down gracefully...`);

		await new Promise((resolve) => {
		server.close(resolve);
		});

		await stopAgenda();

		process.exit(0);
	};

	process.on('SIGINT', () => shutdown('SIGINT'));
	process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
	console.error('[server] fatal startup error:', err);
	process.exit(1);
});
