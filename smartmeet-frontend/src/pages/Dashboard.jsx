import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { events as eventsApi, bookings as bookingsApi } from '../api';
import '../App.css';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([eventsApi.list(), bookingsApi.list()])
      .then(([e, b]) => {
        setEvents(e.events || []);
        setBookings(b.bookings || []);
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const now = new Date();
  const upcoming = bookings.filter((b) => b.status === 'scheduled' && new Date(b.meetingDate) >= now);
  const cancelled = bookings.filter((b) => b.status === 'cancelled');

  const copyLink = (eventId) => {
    const url = `${window.location.origin}/book/${eventId}`;
    navigator.clipboard.writeText(url).catch(() => {});
  };

  const byDate = {};
  bookings.forEach((b) => {
    const d = new Date(b.meetingDate);
    const key = d.getDate();
    byDate[key] = (byDate[key] || []).concat(b);
  });

  if (loading) {
    return (
      <div className="page center">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>SmartMeet Dashboard</h1>
          <p className="subtitle">Hi {user?.name}, here’s your schedule.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          <Link to="/create-event" className="btn btn-primary">+ Create Event</Link>
        </div>
      </header>

      {error && <div className="error banner">{error}</div>}

      <div className="dashboard-grid">
        <div className="card dash-card">
          <h3>Upcoming Meetings</h3>
          <p className="card-desc">Your next sessions</p>
          <div className="card-list">
            {upcoming.slice(0, 5).map((b) => (
              <div key={b._id} className="card-item">
                <strong>{b.visitorName}</strong> • {new Date(b.meetingDate).toLocaleDateString()} at {b.meetingTime}
                {b.purpose && <span className="muted"> — {b.purpose}</span>}
              </div>
            ))}
            {upcoming.length === 0 && <p className="muted">No upcoming meetings</p>}
          </div>
        </div>

        <div className="card dash-card">
          <h3>My Events</h3>
          <p className="card-desc">Click to copy booking link</p>
          <div className="card-list">
            {events.map((e) => (
              <div
                key={e._id}
                className="card-item clickable"
                onClick={() => copyLink(e._id)}
              >
                <strong>{e.title}</strong>
                <span className="muted">{e.duration} min</span>
              </div>
            ))}
            {events.length === 0 && <p className="muted">No events yet</p>}
          </div>
        </div>

        <div className="card dash-card">
          <h3>Create Event</h3>
          <p className="card-desc">Add a new meeting type</p>
          <Link to="/create-event" className="btn btn-primary" style={{ width: '100%' }}>
            New Event
          </Link>
        </div>

        <div className="card dash-card wide">
          <h3>Calendar</h3>
          <p className="card-desc">
            {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} • {bookings.length} bookings
          </p>
          <div className="calendar-grid">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
              <div key={d} className="cal-day">{d}</div>
            ))}
            {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDay() + 1 }, (_, i) => (
              <div key={`pad-${i}`} className="cal-cell" />
            ))}
            {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => (
              <div
                key={i + 1}
                className={`cal-cell ${byDate[i + 1] ? 'booked' : ''}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="card dash-card stats-card">
          <h3>Stats</h3>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-value">{bookings.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-value">{upcoming.length}</span>
              <span className="stat-label">Upcoming</span>
            </div>
            <div className="stat">
              <span className="stat-value">{events.length}</span>
              <span className="stat-label">Events</span>
            </div>
            <div className="stat">
              <span className="stat-value">{cancelled.length}</span>
              <span className="stat-label">Cancelled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
