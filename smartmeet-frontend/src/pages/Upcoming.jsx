import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookings as bookingsApi } from '../api';
import '../App.css';
import './Dashboard.css'; // reuse dashboard styles for list elements

export default function Upcoming() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    bookingsApi.list()
      .then((b) => setBookings(b.bookings || []))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const now = new Date();
  const upcoming = bookings.filter((b) => b.status === 'scheduled' && new Date(b.meetingDate) >= now);

  const copyMeeting = (b) => {
    const text = `Meeting with ${b.visitorName} on ${new Date(b.meetingDate).toLocaleString()}${
      b.purpose ? ' – ' + b.purpose : ''
    }`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied('copied');
        setTimeout(() => setCopied(''), 2000);
      })
      .catch(() => {});
  };

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
          <h1>Upcoming Meetings</h1>
          <p className="subtitle">Here are your next sessions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        </div>
      </header>

      {error && <div className="banner error">{error}</div>}
      {copied && <div className="banner success">Meeting info copied to clipboard</div>}

      <div className="card dash-card">
        {upcoming.length === 0 && <p className="muted">No upcoming meetings</p>}
        <div className="card-list">
          {upcoming.map((b) => (
            <div key={b._id} className="card-item meeting-item">
              <div>
                <strong>{b.visitorName}</strong> • {new Date(b.meetingDate).toLocaleDateString()} at {b.meetingTime}
                {b.purpose && <span className="muted"> — {b.purpose}</span>}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => copyMeeting(b)}>
                Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
