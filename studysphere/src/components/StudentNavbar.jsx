import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/StudentNavbar.css';

function StudentNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Notes', path: '/student/notes' },
    { label: 'Assignments', path: '/student/assignments' },
    { label: 'Submissions', path: '/student/submissions' },
    { label: 'Profile', path: '/student/profile' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container container">
        <Link to="/student/dashboard" className="navbar-logo">
          Study<span>Sphere</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`navbar-links ${menuOpen ? 'active' : ''}`}>
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
        <button
  onClick={handleLogout}
  style={{
    padding: '8px 20px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
  }}
>
  Logout
</button>
           
        </nav>
      </div>
    </header>
  );
}

export default StudentNavbar;