import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <h1 className="logo">SmartMeet</h1>
        <nav className="landing-nav">
          <ThemeToggle />
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </nav>
      </header>
      <main className="landing-main">
        <div className="hero card">
          <h2>Smart, effortless scheduling</h2>
          <p>Create events, share booking links, and let SmartMeet handle scheduling for you.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create your free SmartMeet
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              I already have an account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
