const API = '/api';

function getToken() {
  return localStorage.getItem('smartmeet_token');
}

async function request(path, opts = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opts.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const auth = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
};

export const events = {
  list: () => request('/events'),
  get: (id) => request(`/events/${id}`),
  create: (body) => request('/events/create', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id) => request(`/events/${id}`, { method: 'DELETE' }),
};

export const bookings = {
  list: () => request('/bookings'),
  byEvent: (eventId) => request(`/bookings/event/${eventId}`),
  create: (body) => request('/bookings/create', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (id) => request(`/bookings/${id}/cancel`, { method: 'PATCH' }),
};

export { getToken };
export function saveToken(token) { localStorage.setItem('smartmeet_token', token); }
export function clearToken() {
  localStorage.removeItem('smartmeet_token');
  localStorage.removeItem('smartmeet_user');
}
