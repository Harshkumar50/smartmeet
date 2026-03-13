import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upcoming from './pages/Upcoming';
import CreateEvent from './pages/CreateEvent';
import Booking from './pages/Booking';

function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth();
  if (loading) return <div className="page center"><div className="loader" /></div>;
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upcoming"
            element={
              <ProtectedRoute>
                <Upcoming />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route path="/book/:eventId" element={<Booking />} />
        </Routes>
        {/* global footer, shown on every page */}
        <footer className="app-footer">
          <p>Made with <span role="img" aria-label="love">❤️</span> by Harsh</p>
        </footer>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
