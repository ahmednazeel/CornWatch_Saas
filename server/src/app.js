import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import monitorsRouter from './routes/monitors.js';
import billingRouter from './routes/billing.js';
import webhooksRouter from './routes/webhooks.js';
import userRouter from './routes/user.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  
  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', apiLimiter);

  // Stripe webhooks need the raw, unparsed body to verify the signature,
  // so this route is mounted BEFORE the global express.json() parser.
  app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhooksRouter);

  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

  app.use('/api/monitors', monitorsRouter);
  app.use('/api/billing', billingRouter);
  app.use('/api/me', userRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
