// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';

// const DEFAULT_FORM = {
//   name: '',
//   url: '',
//   schedule: '*/5 * * * *',
//   gracePeriod: 5,
//   timezone: 'UTC',
//   slackEnabled: false,
//   slackWebhookUrl: '',
// };

// export default function CreateMonitorDialog({ open, onOpenChange, onCreate }) {
//   const [form, setForm] = useState(DEFAULT_FORM);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   function update(field, value) {
//     setForm((f) => ({ ...f, [field]: value }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);

//     try {
//       await onCreate({
//         name: form.name,
//         url: form.url,
//         schedule: form.schedule,
//         gracePeriod: Number(form.gracePeriod),
//         timezone: form.timezone,
//         alertChannels: {
//           email: { enabled: true },
//           slack: { enabled: form.slackEnabled, webhookUrl: form.slackWebhookUrl || null },
//         },
//       });
//       setForm(DEFAULT_FORM);
//       onOpenChange(false);
//     } catch (err) {
//       setError(err.message || 'Failed to create monitor');
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent onClose={() => onOpenChange(false)}>
//         <DialogHeader>
//           <DialogTitle>Create monitor</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-1.5">
//             <Label htmlFor="name">Name</Label>
//             <Input
//               id="name"
//               placeholder="Nightly DB backup"
//               value={form.name}
//               onChange={(e) => update('name', e.target.value)}
//               required
//             />
//           </div>

//           <div className="space-y-1.5">
//             <Label htmlFor="url">Check URL</Label>
//             <Input
//               id="url"
//               type="url"
//               placeholder="https://api.example.com/health"
//               value={form.url}
//               onChange={(e) => update('url', e.target.value)}
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1.5">
//               <Label htmlFor="schedule">Cron schedule</Label>
//               <Input
//                 id="schedule"
//                 placeholder="*/5 * * * *"
//                 value={form.schedule}
//                 onChange={(e) => update('schedule', e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label htmlFor="gracePeriod">Grace period (min)</Label>
//               <Input
//                 id="gracePeriod"
//                 type="number"
//                 min="0"
//                 value={form.gracePeriod}
//                 onChange={(e) => update('gracePeriod', e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="space-y-1.5">
//             <Label htmlFor="timezone">Timezone</Label>
//             <Input
//               id="timezone"
//               placeholder="UTC"
//               value={form.timezone}
//               onChange={(e) => update('timezone', e.target.value)}
//             />
//           </div>

//           <div className="flex items-center justify-between rounded-md border border-border p-3">
//             <div>
//               <p className="text-sm font-medium">Slack alerts</p>
//               <p className="text-xs text-muted-foreground">Send a message to a Slack webhook on failure</p>
//             </div>
//             <Switch checked={form.slackEnabled} onCheckedChange={(v) => update('slackEnabled', v)} />
//           </div>

//           {form.slackEnabled && (
//             <div className="space-y-1.5">
//               <Label htmlFor="slackWebhookUrl">Slack webhook URL</Label>
//               <Input
//                 id="slackWebhookUrl"
//                 placeholder="https://hooks.slack.com/services/..."
//                 value={form.slackWebhookUrl}
//                 onChange={(e) => update('slackWebhookUrl', e.target.value)}
//               />
//             </div>
//           )}

//           {error && <p className="text-sm text-destructive">{error}</p>}

//           <div className="flex justify-end gap-2 pt-2">
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={submitting}>
//               {submitting ? 'Creating...' : 'Create monitor'}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const SCHEDULE_OPTIONS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every 10 minutes', value: '*/10 * * * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Every 30 minutes', value: '*/30 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every 2 hours', value: '0 */2 * * *' },
  { label: 'Every 6 hours', value: '0 */6 * * *' },
  { label: 'Every 12 hours', value: '0 */12 * * *' },
  { label: 'Every day', value: '0 0 * * *' },
];

const DEFAULT_FORM = {
  name: '',
  url: '',
  schedule: '*/5 * * * *',
  gracePeriod: 5,
  timezone: 'UTC',
  slackEnabled: false,
  slackWebhookUrl: '',
};

export default function CreateMonitorDialog({ open, onOpenChange, onCreate }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onCreate({
        name: form.name,
        url: form.url,
        schedule: form.schedule,
        gracePeriod: Number(form.gracePeriod),
        timezone: form.timezone,
        alertChannels: {
          email: { enabled: true },
          slack: {
            enabled: form.slackEnabled,
            webhookUrl: form.slackWebhookUrl || null,
          },
        },
      });

      setForm(DEFAULT_FORM);
      onOpenChange(false);
    } catch (err) {
      setError(err.message || 'Failed to create monitor');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Create monitor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Production API"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <Label htmlFor="url">Check URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://api.example.com/health"
              value={form.url}
              onChange={(e) => update('url', e.target.value)}
              required
            />
          </div>

          {/* Schedule + Grace Period */}
          <div className="grid grid-cols-2 gap-4">

            {/* Schedule */}
            <div className="space-y-1.5">
              <Label htmlFor="schedule">Check frequency</Label>

              <select
                id="schedule"
                value={form.schedule}
                onChange={(e) => update('schedule', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {SCHEDULE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <p className="text-xs text-muted-foreground">
                How often this URL will be checked.
              </p>
            </div>

            {/* Grace Period */}
            <div className="space-y-1.5">
              <Label htmlFor="gracePeriod">
                Grace period
              </Label>

              <div className="relative">
                <Input
                  id="gracePeriod"
                  type="number"
                  min="0"
                  value={form.gracePeriod}
                  onChange={(e) => update('gracePeriod', e.target.value)}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  min
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Wait before sending an alert.
              </p>
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-1.5">
            <Label htmlFor="timezone">Timezone</Label>

            <Input
              id="timezone"
              placeholder="UTC"
              value={form.timezone}
              onChange={(e) => update('timezone', e.target.value)}
            />

            <p className="text-xs text-muted-foreground">
              Timezone used when running scheduled checks.
            </p>
          </div>

          {/* Slack */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="pr-4">
              <p className="text-sm font-medium">
                Slack alerts
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Send a message to Slack when this monitor goes down.
              </p>
            </div>

            <Switch
              checked={form.slackEnabled}
              onCheckedChange={(value) =>
                update('slackEnabled', value)
              }
            />
          </div>

          {/* Slack Webhook */}
          {form.slackEnabled && (
            <div className="space-y-1.5">
              <Label htmlFor="slackWebhookUrl">
                Slack webhook URL
              </Label>

              <Input
                id="slackWebhookUrl"
                placeholder="https://hooks.slack.com/services/..."
                value={form.slackWebhookUrl}
                onChange={(e) =>
                  update('slackWebhookUrl', e.target.value)
                }
              />

              <p className="text-xs text-muted-foreground">
                Messages will be sent to this Slack webhook when the
                monitor fails.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create monitor'}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}

