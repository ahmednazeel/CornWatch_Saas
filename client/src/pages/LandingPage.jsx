import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import {
  Activity, Bell, LayoutDashboard, Webhook, Moon, Sun,
  Check, ChevronDown, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme.jsx';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    icon: Bell,
    title: 'Instant Alerts',
    body: 'The moment a cron job misses its schedule or a health check fails, we ping you by email, Slack, or webhook — no polling required.',
  },
  {
    icon: LayoutDashboard,
    title: 'Beautiful Dashboard',
    body: 'See every monitor at a glance: uptime, response time trends, and recent failures in one clean, dark-mode-friendly view.',
  },
  {
    icon: Webhook,
    title: 'Slack / Email / Webhook',
    body: 'Route alerts wherever your team already lives. Fire a custom webhook to plug CronWatch into PagerDuty, Discord, or your own tooling.',
  },
];

// const TIERS = [
//   {
//     name: 'Free',
//     monthly: 0,
//     yearly: 0,
//     tagline: 'Kick the tires',
//     features: ['3 monitors', 'Email alerts', '24h log retention'],
//   },
//   {
//     name: 'Starter',
//     monthly: 7,
//     yearly: 70,
//     tagline: 'For side projects',
//     features: ['20 monitors', '1-minute checks', 'Email + Slack alerts', '30-day log retention'],
//   },
//   {
//     name: 'Pro',
//     monthly: 15,
//     yearly: 150,
//     tagline: 'For growing teams',
//     popular: true,
//     features: ['100 monitors', '1-minute checks', 'Email + Slack + Webhook', '90-day log retention', 'Priority support'],
//   },
//   {
//     name: 'Team',
//     monthly: 29,
//     yearly: 290,
//     tagline: 'For serious infra',
//     features: ['Unlimited monitors', '1-minute checks', 'All alert channels', '1-year log retention', 'Shared team dashboard'],
//   },
// ];
const TIERS = [
	{
		name: 'Free',
		slug: 'free',
		monthly: 0,
		yearly: 0,
		tagline: 'Kick the tires',
		monitorLimit: 3,
		minCheckIntervalMinutes: 5,
		features: [
			'3 monitors',
			'5-minute checks',
			'Email alerts',
			'24h log retention',
		],
	},
	{
		name: 'Starter',
		slug: 'starter',
		monthly: 7,
		yearly: 70,
		tagline: 'For side projects',
		monitorLimit: 20,
		minCheckIntervalMinutes: 1,
		features: [
			'20 monitors',
			'1-minute checks',
			'Email + Slack alerts',
			'30-day log retention',
		],
	},
	{
		name: 'Pro',
		slug: 'pro',
		monthly: 15,
		yearly: 150,
		tagline: 'For growing teams',
		popular: true,
		monitorLimit: 100,
		minCheckIntervalMinutes: 1,
		features: [
			'100 monitors',
			'1-minute checks',
			'Email + Slack + Webhook',
			'90-day log retention',
			'Priority support',
		],
	},
];



const FAQS = [
  {
    q: 'How does CronWatch detect a failed cron job?',
    a: 'You give us the schedule (a standard cron expression) and a URL to check. We call that URL on your schedule with a grace period you control, log the result, and alert you the instant a check fails or a job goes silent.',
  },
  {
    q: 'Do I need to change my cron job code?',
    a: 'No. CronWatch checks an HTTP endpoint on your schedule — most setups just need your job to expose a lightweight health endpoint, or you can point CronWatch at the service itself.',
  },
  {
    q: 'Can I get alerted in Slack?',
    a: 'Yes — add a Slack incoming webhook URL to any monitor and you will get a formatted alert the moment it goes down, plus a recovery notice when it comes back up.',
  },
  {
    q: 'What happens if I exceed my plan\u2019s monitor limit?',
    a: 'You will not lose data — you simply cannot create new monitors until you upgrade or remove one. Existing monitors keep running normally.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, subscriptions are billed monthly or yearly with no lock-in. Manage or cancel your plan anytime from the billing portal in Settings.',
  },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleEmailSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
        <NavLink to={'/'} className="flex h-16 items-center gap-2 border-b border-border px-6">
          <img src="/logo.png" className='w-10' alt='cornwatch app logo for detecting api endpoint failed'/>
          <span className="font-semibold">CronWatch</span>
        </NavLink>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <SignedOut>
              <Link to="/sign-in"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/sign-up"><Button size="sm">Get started</Button></Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard"><Button size="sm">Dashboard</Button></Link>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container flex flex-col items-center gap-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Trusted by 500+ developers
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Your cron jobs fail silently.
          <br />
          <span className="text-primary">We catch them.</span>
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          Never miss a failed cron job again. CronWatch pings your scheduled jobs, tracks
          response times, and alerts you by email, Slack, or webhook the second something breaks.
        </p>

        {!submitted ? (
          <form onSubmit={handleEmailSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-11 flex-1 rounded-md border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" size="lg" className="gap-2">
              Start free <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <p className="text-sm font-medium text-success">
            Thanks! Check your inbox to finish setting up your account.
          </p>
        )}

        <p className="text-xs text-muted-foreground">No credit card required &middot; Free plan forever</p>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">Everything you need to trust your jobs again</h2>
          <p className="mt-2 text-muted-foreground">Built for developers who are tired of finding out about failures from angry customers.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
			{FEATURES.map(({ icon: Icon, title, body }) => (
				<Card key={title} className="border-border/60 hover:shadow-xl transition-shadow duration-300">
					<CardContent className="pt-6">
						<div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
						<Icon className="h-5 w-5 text-primary" />
						</div>
						<h3 className="mb-2 text-lg font-semibold">{title}</h3>
						<p className="text-sm text-muted-foreground">{body}</p>
					</CardContent>
				</Card>
			))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border bg-secondary/30 py-20">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-2 text-muted-foreground">Start free. Upgrade when your infrastructure grows.</p>

            <div className="mt-6 inline-flex items-center rounded-full border border-border bg-background p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={cn('rounded-full px-4 py-1.5 text-sm font-medium', billingCycle === 'monthly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
              >
                Monthly
              </button>
              {/* <button
                onClick={() => setBillingCycle('yearly')}
                className={cn('rounded-full px-4 py-1.5 text-sm font-medium', billingCycle === 'yearly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
              >
                Yearly <span className="text-success">(save ~17%)</span>
              </button> */}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {TIERS.map((tier) => {
				const price = billingCycle === 'monthly' ? tier.monthly : Math.round(tier.yearly / 12);
				return (
					<Card
						key={tier.name}
						className={cn('relative flex flex-col', tier.popular && 'border-primary shadow-md')}
					>
					{tier.popular && (
						<div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
						Most popular
						</div>
					)}
						<CardContent className="flex flex-1 flex-col pt-8 hover:shadow-xl transition-shadow duration-300">
							<h3 className="text-lg font-semibold">{tier.name}</h3>
							<p className="text-sm text-muted-foreground">{tier.tagline}</p>

							<div className="my-4">
							<span className="text-3xl font-extrabold">${price}</span>
							<span className="text-sm text-muted-foreground">/mo</span>
							</div>

							<ul className="mb-6 flex-1 space-y-2 text-sm">
							{tier.features.map((f) => (
								<li key={f} className="flex items-start gap-2">
								<Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
								<span>{f}</span>
								</li>
							))}
							</ul>

							<Link to="/sign-up">
							<Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>
								{tier.monthly === 0 ? 'Start free' : `Choose ${tier.name}`}
							</Button>
							</Link>
						</CardContent>
					</Card>
				);
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container py-20">
			<div className="mx-auto max-w-2xl">
				<h2 className="mb-10 text-center text-3xl font-bold">Frequently asked questions</h2>
				<div className="space-y-2">
					{FAQS.map((item, i) => (
					<div key={item.q} className="rounded-lg border border-border">
						<button
						onClick={() => setOpenFaq(openFaq === i ? null : i)}
						className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium"
						>
						{item.q}
						<ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', openFaq === i && 'rotate-180')} />
						</button>
						{openFaq === i && (
						<p className="px-5 pb-4 text-sm text-muted-foreground">{item.a}</p>
						)}
					</div>
					))}
				</div>
			</div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-primary py-16 text-primary-foreground">
			<div className="container flex flex-col items-center gap-4 text-center">
				<h2 className="text-3xl font-bold">Stop finding out about failures from your customers.</h2>
				<p className="max-w-lg text-primary-foreground/80">
					Set up your first monitor in under two minutes. Free forever, no credit card needed.
				</p>
				<Link to="/sign-up">
					<Button size="lg" variant="secondary" className="gap-2">
					Get started for free <ArrowRight className="h-4 w-4" />
					</Button>
				</Link>
			</div>
      </section>

      <footer className="border-t border-border py-8">
			<div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
				<div className="flex items-center gap-2">
					<Activity className="h-4 w-4" />
					<span>&copy; {new Date().getFullYear()} CronWatch. All rights reserved.</span>
				</div>
				<div className="flex gap-6">
					<a href="#features" className="hover:text-foreground">Features</a>
					<a href="#pricing" className="hover:text-foreground">Pricing</a>
					<a href="#faq" className="hover:text-foreground">FAQ</a>
				</div>
			</div>
      </footer>
    </div>
  );
}
