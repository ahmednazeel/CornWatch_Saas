import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ArrowLeft, Trash2, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import StatusDot from '@/components/StatusDot.jsx';
import { useApi } from '@/hooks/useApi';

export default function MonitorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [monitor, setMonitor] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [{ monitor }, { logs }] = await Promise.all([
        api.getMonitor(id),
        api.getMonitorLogs(id, { limit: 200 }),
      ]);
      setMonitor(monitor);
      setEditForm({
        name: monitor.name,
        url: monitor.url,
        schedule: monitor.schedule,
        gracePeriod: monitor.gracePeriod,
        isActive: monitor.isActive,
      });
      setLogs(logs);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    setSaving(true);
    try {
      const { monitor: updated } = await api.updateMonitor(id, editForm);
      setMonitor(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this monitor? This also removes its check history.')) return;
    await api.deleteMonitor(id);
    navigate('/dashboard');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !monitor) {
    return <p className="text-sm text-destructive">{error || 'Monitor not found'}</p>;
  }

  const last24h = logs
    .filter((l) => Date.now() - new Date(l.checkedAt).getTime() <= 24 * 60 * 60 * 1000)
    .slice()
    .reverse()
    .map((l) => ({
      time: new Date(l.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      responseTime: l.responseTime ?? 0,
      status: l.status,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{monitor.name}</h1>
            <StatusDot status={monitor.lastStatus} />
          </div>
          <p className="text-sm text-muted-foreground">{monitor.url}</p>
        </div>
        <Button variant="destructive" size="sm" className="gap-2" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Response time — last 24h</CardTitle>
        </CardHeader>
        <CardContent>
          {last24h.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No checks recorded in the last 24 hours yet.</p>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last24h}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} minTickGap={30} />
                  <YAxis tick={{ fontSize: 12 }} unit="ms" />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="responseTime" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Code</th>
                    <th className="py-2 pr-4 font-medium">Response</th>
                    <th className="py-2 pr-4 font-medium">Checked at</th>
                    <th className="py-2 pr-4 font-medium">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-b border-border/60 last:border-0">
                      <td className="py-2 pr-4">
                        <Badge variant={log.status === 'up' ? 'success' : 'destructive'}>{log.status}</Badge>
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">{log.statusCode ?? '—'}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{log.responseTime != null ? `${log.responseTime} ms` : '—'}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{new Date(log.checkedAt).toLocaleString()}</td>
                      <td className="max-w-[200px] truncate py-2 pr-4 text-muted-foreground">{log.errorMessage || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit monitor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>URL</Label>
              <Input value={editForm.url} onChange={(e) => setEditForm((f) => ({ ...f, url: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Schedule (cron)</Label>
              <Input value={editForm.schedule} onChange={(e) => setEditForm((f) => ({ ...f, schedule: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Grace period (min)</Label>
              <Input
                type="number"
                min="0"
                value={editForm.gracePeriod}
                onChange={(e) => setEditForm((f) => ({ ...f, gracePeriod: Number(e.target.value) }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <p className="text-sm font-medium">Active</p>
              <Switch checked={editForm.isActive} onCheckedChange={(v) => setEditForm((f) => ({ ...f, isActive: v }))} />
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
              <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
