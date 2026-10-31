import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container container">
        {/* Brand */}
        <div className="footer-brand">
          <h3>
            Study<span>Sphere</span>
          </h3>
          <p>Assignment and Notes Management System for students.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        {/* Project Info */}
        <div className="footer-info">
          <h4>Project Info</h4>
          <p>BCA Advanced Web Development Project</p>
          <p>Built with React.js</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} StudySphere. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;