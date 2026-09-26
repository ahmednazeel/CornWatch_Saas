// import React, { useEffect, useState, useCallback } from 'react';
// import { Loader2, CreditCard, ExternalLink } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { useApi } from '@/hooks/useApi';

// const PLAN_ORDER = ['free', 'starter', 'pro', 'team'];
// const PLAN_PRICES = { free: '$0', starter: '$7', pro: '$15', team: '$29' };

// export default function Settings() {
// 	const api = useApi();
// 	const [me, setMe] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);
// 	const [billingBusy, setBillingBusy] = useState(false);

// 	const load = useCallback(async () => {
// 		setLoading(true);
// 		try {
// 			const data = await api.getMe();
// 			setMe(data);
// 			setError(null);
// 		} catch (err) {
// 			setError(err.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	}, [api]);

// 	useEffect(() => {
// 		load();
// 	}, [load]);

// 	async function handleUpgrade(plan) {
// 		console.log(plan);
// 		setBillingBusy(true);
// 		try {
// 			const data = await api.startCheckout(plan);
// 			console.log(data)
// 			// window.location.href = data.url;
			
// 		} catch (err) {
// 			setError(err.message);
// 			setBillingBusy(false);
// 		}
// 	}

// 	async function handleManageBilling() {
// 		setBillingBusy(true);
// 		try {
// 			const { url } = await api.openPortal();
// 			window.location.href = url;
// 		} catch (err) {
// 			setError(err.message);
// 			setBillingBusy(false);
// 		}
// 	}

// 	if (loading) {
// 		return (
// 		<div className="flex items-center justify-center py-24 text-muted-foreground">
// 			<Loader2 className="h-6 w-6 animate-spin" />
// 		</div>
// 		);
// 	}

// 	return (
// 		<div className="max-w-3xl space-y-8">
// 		<div>
// 			<h1 className="text-2xl font-bold">Settings</h1>
// 			<p className="text-sm text-muted-foreground">Manage your plan, billing, and default alert preferences.</p>
// 		</div>

// 		{error && <p className="text-sm text-destructive">{error}</p>}

// 		<Card>
// 			<CardHeader>
// 				<CardTitle>Plan &amp; billing</CardTitle>
// 				<CardDescription>
// 					You&apos;re currently on the <strong className="capitalize text-foreground">{me?.user.plan}</strong> plan
// 					{me?.usage.limit != null && (
// 					<> — using {me?.usage.monitors} of {me?.usage.limit} monitors.</>
// 					)}
// 					{me?.usage.limit == null && <> — unlimited monitors.</>}
// 				</CardDescription>
// 			</CardHeader>
// 			<CardContent className="space-y-6">
// 				<div className="flex items-center gap-3">
// 					<Badge variant={me?.user.subscriptionStatus === 'active' ? 'success' : 'secondary'}>
// 						{me?.user.subscriptionStatus}
// 					</Badge>
// 					{me?.user.plan !== 'free' && (
// 						<Button variant="outline" size="sm" className="gap-2" onClick={handleManageBilling} disabled={billingBusy}>
// 							<CreditCard className="h-4 w-4" /> Manage billing
// 						</Button>
// 					)}
// 				</div>

// 				<div className="grid gap-3 sm:grid-cols-3">
// 					{PLAN_ORDER.filter((p) => p !== 'free').map((plan) => {
// 					const isCurrent = me?.user.plan === plan;
// 					return (
// 						<div key={plan} className="flex flex-col gap-2 rounded-md border border-border p-4">
// 						<div className="flex items-center justify-between">
// 							<span className="font-semibold capitalize">{plan}</span>
// 							{isCurrent && <Badge variant="success">Current</Badge>}
// 						</div>
// 						<span className="text-xl font-bold">{PLAN_PRICES[plan]}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
// 							<Button
// 								size="sm"
// 								variant={isCurrent ? 'outline' : 'default'}
// 								disabled={isCurrent || billingBusy}
// 								onClick={() => handleUpgrade(plan)}
// 								className="gap-2"
// 							>
// 								{isCurrent ? 'Current plan' : 'Upgrade'} <ExternalLink className="h-3.5 w-3.5" />
// 							</Button>
// 						</div>
// 					);
// 					})}
// 				</div>
// 			</CardContent>
// 		</Card>

// 		<Card>
// 			<CardHeader>
// 			<CardTitle>Alert channels</CardTitle>
// 			<CardDescription>
// 				Default alert preferences applied to new monitors. Each monitor can also override these individually
// 				from its detail page.
// 			</CardDescription>
// 			</CardHeader>
// 			<CardContent className="space-y-4 text-sm text-muted-foreground">
// 			<div className="flex items-center justify-between rounded-md border border-border p-3">
// 				<div>
// 				<p className="font-medium text-foreground">Email</p>
// 				<p className="text-xs">Alerts are sent to {me?.user.email}</p>
// 				</div>
// 				<Badge variant="success">Always on</Badge>
// 			</div>
// 			<div className="flex items-center justify-between rounded-md border border-border p-3">
// 				<div>
// 				<p className="font-medium text-foreground">Slack</p>
// 				<p className="text-xs">Configure a webhook URL per monitor</p>
// 				</div>
// 				<Badge variant="secondary">Per-monitor</Badge>
// 			</div>
// 			<div className="flex items-center justify-between rounded-md border border-border p-3">
// 				<div>
// 				<p className="font-medium text-foreground">Custom webhook</p>
// 				<p className="text-xs">Send a JSON payload to your own endpoint on failure/recovery</p>
// 				</div>
// 				<Badge variant="secondary">Per-monitor</Badge>
// 			</div>
// 			</CardContent>
// 		</Card>
// 		</div>
// 	);
// }

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, CreditCard, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/hooks/useApi';
import { initializePaddle } from '@paddle/paddle-js';

const PLAN_ORDER = ['free', 'starter', 'pro', 'team'];

const PLAN_PRICES = {
  free: '$0',
  starter: '$7',
  pro: '$15',
  team: '$29',
};

export default function Settings() {
  const api = useApi();

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billingBusy, setBillingBusy] = useState(false);

  const [paddle, setPaddle] = useState(null);

  // --------------------------------
  // Initialize Paddle
  // --------------------------------
  useEffect(() => {
    async function initPaddle() {
      try {
const paddleInstance = await initializePaddle({
  token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
  environment: 'sandbox',
});

        setPaddle(paddleInstance);
      } catch (err) {
        console.error('Failed to initialize Paddle:', err);
        setError('Failed to initialize payment system.');
      }
    }

    initPaddle();
  }, []);

  // --------------------------------
  // Load current user
  // --------------------------------
  const load = useCallback(async () => {
    setLoading(true);

    try {
      const data = await api.getMe();

      setMe(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  // --------------------------------
  // Upgrade
  // --------------------------------
  async function handleUpgrade(plan) {
    if (!paddle) {
      setError('Payment system is still loading. Please try again.');
      return;
    }

    setBillingBusy(true);
    setError(null);

    try {
      // Ask backend to create Paddle transaction
      const data = await api.startCheckout(plan);

      console.log('Checkout response:', data);

      const transactionId = data?.transaction?.id;

      if (!transactionId) {
        throw new Error('No Paddle transaction ID returned.');
      }

      console.log('Paddle transaction:', transactionId);

      // Open Paddle checkout
      paddle.Checkout.open({
        transactionId,
      });

      // Don't keep button disabled forever
      setBillingBusy(false);
    } catch (err) {
      console.error(err);

      setError(err.message);
      setBillingBusy(false);
    }
  }

  // --------------------------------
  // Manage Billing
  // --------------------------------
  async function handleManageBilling() {
    setBillingBusy(true);

    try {
      const { url } = await api.openPortal();

      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setBillingBusy(false);
    }
  }

  // --------------------------------
  // Loading
  // --------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">

      <div>
        <h1 className="text-2xl font-bold">
          Settings
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage your plan, billing, and default alert preferences.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Plan &amp; billing
          </CardTitle>

          <CardDescription>
            You&apos;re currently on the{' '}
            <strong className="capitalize text-foreground">
              {me?.user.plan}
            </strong>

            {me?.usage.limit != null && (
              <>
                {' '}— using {me?.usage.monitors} of {me?.usage.limit} monitors.
              </>
            )}

            {me?.usage.limit == null && (
              <> — unlimited monitors.</>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="flex items-center gap-3">

            <Badge
              variant={
                me?.user.subscriptionStatus === 'active'
                  ? 'success'
                  : 'secondary'
              }
            >
              {me?.user.subscriptionStatus}
            </Badge>

            {me?.user.plan !== 'free' && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleManageBilling}
                disabled={billingBusy}
              >
                <CreditCard className="h-4 w-4" />

                Manage billing
              </Button>
            )}

          </div>

          <div className="grid gap-3 sm:grid-cols-3">

            {PLAN_ORDER
              .filter((p) => p !== 'free')
              .map((plan) => {

                const isCurrent =
                  me?.user.plan === plan;

                return (
                  <div
                    key={plan}
                    className="flex flex-col gap-2 rounded-md border border-border p-4"
                  >

                    <div className="flex items-center justify-between">

                      <span className="font-semibold capitalize">
                        {plan}
                      </span>

                      {isCurrent && (
                        <Badge variant="success">
                          Current
                        </Badge>
                      )}

                    </div>

                    <span className="text-xl font-bold">
                      {PLAN_PRICES[plan]}

                      <span className="text-xs font-normal text-muted-foreground">
                        /mo
                      </span>
                    </span>

                    <Button
                      size="sm"
                      variant={isCurrent ? 'outline' : 'default'}
                      disabled={
                        isCurrent ||
                        billingBusy ||
                        !paddle
                      }
                      onClick={() => handleUpgrade(plan)}
                      className="gap-2"
                    >

                      {isCurrent
                        ? 'Current plan'
                        : 'Upgrade'}

                      <ExternalLink className="h-3.5 w-3.5" />

                    </Button>

                  </div>
                );
              })}

          </div>

        </CardContent>
      </Card>

      <Card>

        <CardHeader>
          <CardTitle>
            Alert channels
          </CardTitle>

          <CardDescription>
            Default alert preferences applied to new monitors.
            Each monitor can also override these individually
            from its detail page.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-muted-foreground">

          <div className="flex items-center justify-between rounded-md border border-border p-3">

            <div>
              <p className="font-medium text-foreground">
                Email
              </p>

              <p className="text-xs">
                Alerts are sent to {me?.user.email}
              </p>
            </div>

            <Badge variant="success">
              Always on
            </Badge>

          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">

            <div>
              <p className="font-medium text-foreground">
                Slack
              </p>

              <p className="text-xs">
                Configure a webhook URL per monitor
              </p>
            </div>

            <Badge variant="secondary">
              Per-monitor
            </Badge>

          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">

            <div>
              <p className="font-medium text-foreground">
                Custom webhook
              </p>

              <p className="text-xs">
                Send a JSON payload to your own endpoint on failure/recovery
              </p>
            </div>

            <Badge variant="secondary">
              Per-monitor
            </Badge>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}