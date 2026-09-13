const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Thin fetch wrapper. Pass the Clerk `getToken` function (from useAuth())
 * so every request carries a fresh bearer token.
 */
export function createApiClient(getToken) {
  async function request(path, { method = 'GET', body, ...rest } = {}) {
    const token = await getToken();
    console.log(token)
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      ...rest,
    });
    console.log( res)
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const error = new Error(payload.error || `Request failed: ${res.status}`);
      error.status = res.status;
      error.payload = payload;
      throw error;
    }

    if (res.status === 204) return null;
    return res.json();
  }

  return {
    getMonitors: () => request('/api/monitors'),
    getMonitor: (id) => request(`/api/monitors/${id}`),
    getMonitorLogs: (id, params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/api/monitors/${id}/logs${qs ? `?${qs}` : ''}`);
    },
    createMonitor: (data) => request('/api/monitors', { method: 'POST', body: data }),
    updateMonitor: (id, data) => request(`/api/monitors/${id}`, { method: 'PUT', body: data }),
    deleteMonitor: (id) => request(`/api/monitors/${id}`, { method: 'DELETE' }),
    getMe: () => request('/api/me'),
    startCheckout: (plan) => request('/api/billing/checkout', { method: 'POST', body: { plan } }),
    openPortal: () => request('/api/billing/portal', { method: 'POST' }),
  };
}
