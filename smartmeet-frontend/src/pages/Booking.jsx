import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { events, bookings } from '../api';
import '../App.css';
import './Booking.css';

function generateSlots(event, existingBookings) {
  const blocked = new Set(
    existingBookings.map((b) => `${new Date(b.meetingDate).toDateString()} ${b.meetingTime}`)
  );
  const slots = [];
  const today = new Date();
  const daysAhead = 14;
  const [startH, startM] = event.startTime.split(':').map(Number);
  const [endH, endM] = event.endTime.split(':').map(Number);
  const duration = event.duration || 30;
  const allowedDays = (event.availableDays || []).map((d) => d.toLowerCase());

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const weekday = d.toLocaleDateString(undefined, { weekday: 'short' }).toLowerCase();
    if (allowedDays.length && !allowedDays.includes(weekday)) continue;

    let cursor = new Date(d.getFullYear(), d.getMonth(), d.getDate(), startH, startM, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), endH, endM, 0);

    while (cursor < end) {
      const label = cursor.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      const key = `${cursor.toDateString()} ${label}`;
      if (!blocked.has(key)) {
        slots.push({
          date: new Date(cursor),
          labelDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          labelTime: label,
        });
      }
      cursor = new Date(cursor.getTime() + duration * 60 * 1000);
    }
  }
  return slots;
}

export default function Booking() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ visitorName: '', visitorEmail: '', purpose: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setError('Invalid event');
      setLoading(false);
      return;
    }
    Promise.all([events.get(eventId), bookings.byEvent(eventId)])
      .then(([eData, bData]) => {
        const ev = eData.event;
        const bks = bData.bookings || [];
        setEvent(ev);
        setSlots(generateSlots(ev, bks));
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [eventId]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected) {
      setError('Select a time slot first');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await bookings.create({
        eventId,
        visitorName: form.visitorName,
        visitorEmail: form.visitorEmail,
        meetingDate: selected.date.toISOString(),
        meetingTime: selected.labelTime,
        purpose: form.purpose,
      });
      setSuccess('Booking confirmed!');
      setForm({ visitorName: '', visitorEmail: '', purpose: '' });
      setSelected(null);
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page center">
        <div className="loader" />
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="page center">
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="error">{error}</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page booking-page">
      <header className="booking-header">
        <div>
          <h2>{event?.title}</h2>
          <p className="sub">{event?.description || 'Pick a slot and complete your booking.'}</p>
        </div>
        <a href="/" className="btn btn-ghost">SmartMeet</a>
      </header>

      <div className="card booking-card">
        <div className="booking-layout">
          <div className="slots-section">
            <h3>Choose a time</h3>
            <div className="slots-list">
              {slots.length === 0 ? (
                <p className="muted">No slots in the next 2 weeks.</p>
              ) : (
                slots.map((s) => (
                  <button
                    key={`${s.labelDate}-${s.labelTime}`}
                    type="button"
                    className={`btn btn-secondary slot-btn ${selected === s ? 'active' : ''}`}
                    onClick={() => setSelected(s)}
                  >
                    {s.labelDate} • {s.labelTime}
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="form-section">
            <h3>Your details</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="visitorName"
                  className="input"
                  value={form.visitorName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="visitorEmail"
                  className="input"
                  value={form.visitorEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Purpose (optional)</label>
                <textarea
                  name="purpose"
                  className="textarea"
                  value={form.purpose}
                  onChange={handleChange}
                  placeholder="Optional note for the host"
                />
              </div>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={!selected || submitting}
              >
                {submitting ? 'Booking…' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
