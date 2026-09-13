# CronWatch

Cron job monitoring SaaS. Monorepo with two apps:

- `server/` — Node.js + Express + MongoDB (Mongoose) + Agenda.js backend
- `client/` — React 18 + Vite + Tailwind CSS + shadcn-style UI frontend

## Architecture

- **Auth**: Clerk (JWT verified server-side via `@clerk/backend`, session UI via `@clerk/clerk-react`)
- **Database**: MongoDB via Mongoose (`User`, `Monitor`, `CheckLog` models)
- **Scheduling**: Agenda.js — a "sweep" job runs every minute, checks each monitor's own
  cron schedule + grace period, and enqueues an individual HTTP check job (10s timeout)
  per due monitor. Results are logged to `CheckLog`; alerts fire only on up↔down transitions.
- **Alerts**: Resend (email), Slack incoming webhooks, and generic outbound webhooks —
  each monitor can enable any combination.
- **Billing**: Stripe Checkout + Billing Portal, with webhook handlers for
  `checkout.session.completed`, `customer.subscription.updated/deleted`, and
  `invoice.payment_failed`.
- **Plan gating**: free=3 monitors, starter=20, pro=100, team=unlimited (enforced server-side
  in `middleware/planGate.js`).

## Getting started

### 1. Backend

```bash
cd server
cp .env.example .env   # fill in MongoDB URI, Clerk, Stripe, Resend keys
npm install
npm run dev             # nodemon, http://localhost:4000
```

Requires a running MongoDB instance (local or Atlas) reachable at `MONGODB_URI`.

### 2. Frontend

```bash 
cd client
cp .env.example .env    # fill in VITE_CLERK_PUBLISHABLE_KEY, VITE_API_URL
npm install
npm run dev              # http://localhost:5173
```

### 3. Stripe webhooks (local dev)

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Copy the printed webhook signing secret into `server/.env` as `STRIPE_WEBHOOK_SECRET`.

### 4. Clerk

Create a Clerk application, enable email/password (or your preferred strategy), and copy the
publishable key into `client/.env` and the secret key into `server/.env`. No extra Clerk
webhook is required for this MVP — users are lazily created in MongoDB on first authenticated
API call (see `server/src/middleware/auth.js`).

## Project structure

```
cronwatch/
├── server/
│   └── src/
│       ├── config/       # env, db connection
│       ├── models/       # User, Monitor, CheckLog
│       ├── middleware/   # auth, plan gating, error handler
│       ├── routes/       # monitors, billing, webhooks, me
│       ├── services/     # alertService (Resend/Slack/webhook), stripeService
│       ├── jobs/         # agenda.js — scheduler + HTTP check runner
│       ├── app.js
│       └── server.js
└── client/
    └── src/
        ├── components/   # AppLayout, CreateMonitorDialog, StatusDot, ui/*
        ├── pages/         # LandingPage, SignIn/SignUp, Dashboard, MonitorDetail, Settings
        ├── hooks/         # useTheme, useApi
        ├── lib/           # api client, cn utility
        ├── App.jsx
        └── main.jsx
```

## Notes / production TODOs

- Add pagination to `GET /api/monitors` once users can have hundreds of monitors.
- Add a TTL or scheduled cleanup for old `CheckLog` documents per plan's log-retention window.
- Add Clerk webhook handling if you want to sync user deletion/email changes proactively
  instead of lazily on next login.
- Consider moving the Agenda worker into its own process for horizontal scaling.
