import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminNavbar.css';

function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const links = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Students', path: '/admin/students' },
    { label: 'Notes', path: '/admin/notes' },
    { label: 'Assignments', path: '/admin/assignments' },
    { label: 'Submissions', path: '/admin/submissions' },
  ];

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-container container">
        <Link to="/admin/dashboard" className="admin-navbar-logo">
          Study<span>Sphere</span>
          <span className="admin-tag">Admin</span>
        </Link>

        <button
          className="admin-navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`admin-navbar-links ${menuOpen ? 'active' : ''}`}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={location.pathname === link.path ? 'active-link' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button className="btn btn-secondary admin-navbar-cta" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default AdminNavbar;