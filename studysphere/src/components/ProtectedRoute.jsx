import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps a page element and only renders it if the logged-in user
// matches the required role. Otherwise redirects to the right login page.
//
// Usage: <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // Still checking localStorage on first load — avoid flashing a redirect
  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  if (role && user.role !== role) {
    // Logged in, but wrong role (e.g. student trying to open an admin page)
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  return children;
}

export default ProtectedRoute;