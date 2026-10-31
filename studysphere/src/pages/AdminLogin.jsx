import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import '../styles/AdminLogin.css';

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/api/auth/admin/login', formData);
      login({ ...data.user, role: 'admin' }, data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="container admin-auth-container">
        <div className="card admin-auth-card">
          <div className="admin-badge">ADMIN PORTAL</div>
          <h1>Administrator Login</h1>
          <p className="admin-auth-subtitle">
            Sign in to manage students, notes, assignments, and submissions.
          </p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="admin-auth-form">
            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@studysphere.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary admin-auth-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login to Admin Panel'}
            </button>
          </form>

          <p className="admin-auth-switch">
            Not an admin? <Link to="/login">Go to student login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;