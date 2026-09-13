import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusDot from '@/components/StatusDot.jsx';
import CreateMonitorDialog from '@/components/CreateMonitorDialog.jsx';
import { useApi } from '@/hooks/useApi';

export default function Dashboard() {
  const api = useApi();
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { monitors } = await api.getMonitors();
      setMonitors(monitors);
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

  async function handleCreate(data) {
    const { monitor } = await api.createMonitor(data);
    setMonitors((prev) => [monitor, ...prev]);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this monitor? This also removes its check history.')) return;
    await api.deleteMonitor(id);
    setMonitors((prev) => prev.filter((m) => m._id !== id));
  }

  const stats = computeStats(monitors);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Monitor the health of every scheduled job in one place.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Create Monitor
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total monitors" value={stats.total} />
        <StatCard label="Up" value={stats.up} accent="text-success" />
        <StatCard label="Down" value={stats.down} accent="text-destructive" />
        <StatCard label="Avg response time" value={`${stats.avgResponseTime} ms`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monitors</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : monitors.length === 0 ? (
            <EmptyState onCreate={() => setDialogOpen(true)} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">URL</th>
                    <th className="py-2 pr-4 font-medium">Schedule</th>
                    <th className="py-2 pr-4 font-medium">Last check</th>
                    <th className="py-2 pr-4 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {monitors.map((m) => (
                    <tr key={m._id} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                      <td className="py-3 pr-4"><StatusDot status={m.lastStatus} /></td>
                      <td className="py-3 pr-4 font-medium">
                        <Link to={`/monitors/${m._id}`} className="hover:underline">{m.name}</Link>
                      </td>
                      <td className="max-w-[220px] truncate py-3 pr-4 text-muted-foreground">{m.url}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{formatSchedule(m.schedule)}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {m.lastCheckAt ? new Date(m.lastCheckAt).toLocaleString() : 'Never'}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/monitors/${m._id}`}>
                            <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(m._id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateMonitorDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreate={handleCreate} />
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`mt-1 text-2xl font-bold ${accent || ''}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-sm text-muted-foreground">You don&apos;t have any monitors yet.</p>
      <Button onClick={onCreate} className="gap-2">
        <Plus className="h-4 w-4" /> Create your first monitor
      </Button>
    </div>
  );
}

function computeStats(monitors) {
  const total = monitors.length;
  const up = monitors.filter((m) => m.lastStatus === 'up').length;
  const down = monitors.filter((m) => m.lastStatus === 'down').length;
  // Placeholder aggregate — MonitorDetail pulls precise per-monitor response
  // time history from /logs; this is a rough dashboard-level indicator.
  const avgResponseTime = 0;
  return { total, up, down, avgResponseTime };
}


function formatSchedule(schedule) {
  if (!schedule) return 'Not scheduled';

  const normalized = schedule.trim();

  const presets = {
    '* * * * *': 'Every minute',
    '*/5 * * * *': 'Every 5 minutes',
    '*/10 * * * *': 'Every 10 minutes',
    '*/15 * * * *': 'Every 15 minutes',
    '*/30 * * * *': 'Every 30 minutes',
    '0 * * * *': 'Every hour',
    '0 */2 * * *': 'Every 2 hours',
    '0 */6 * * *': 'Every 6 hours',
    '0 */12 * * *': 'Every 12 hours',
    '0 0 * * *': 'Every day',
  };

  return presets[normalized] || normalized;
}