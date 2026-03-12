import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { events } from '../api';
import '../App.css';
import './CreateEvent.css';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 30,
    availableDays: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '09:00',
    endTime: '17:00',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingLink, setBookingLink] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        duration: Number(form.duration),
        availableDays: form.availableDays.split(',').map((d) => d.trim()).filter(Boolean),
      };
      const data = await events.create(payload);
      setSuccess('Event created. Booking link ready.');
      const base = window.location.origin;
      setBookingLink(`${base}/book/${data.event._id}`);
      navigator.clipboard.writeText(`${base}/book/${data.event._id}`).catch(() => {});
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page create-event-page">
      <header className="create-header">
        <div>
          <h2>Create Event</h2>
          <p className="sub">Define availability and share your booking link.</p>
        </div>
        <Link to="/dashboard" className="btn btn-ghost">← Dashboard</Link>
      </header>

      <div className="card create-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              name="title"
              className="input"
              value={form.title}
              onChange={handleChange}
              placeholder="30 min intro call"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className="textarea"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                className="input"
                value={form.duration}
                onChange={handleChange}
                min={10}
                step={5}
              />
            </div>
            <div className="form-group flex-1">
              <label>Available Days (comma-separated)</label>
              <input
                type="text"
                name="availableDays"
                className="input"
                value={form.availableDays}
                onChange={handleChange}
                placeholder="Mon,Tue,Wed,Thu,Fri"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                name="startTime"
                className="input"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                name="endTime"
                className="input"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create Event'}
          </button>
        </form>
        {bookingLink && (
          <div className="booking-link-box">
            <p className="muted">Copy your booking link:</p>
            <code>{bookingLink}</code>
          </div>
        )}
      </div>
    </div>
  );
}
