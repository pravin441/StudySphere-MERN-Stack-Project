import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-container">
          <h1>
            Manage Your Academic Life with <span>StudySphere</span>
          </h1>
          <p>
            Access notes, track assignments, and submit your work — all in one
            simple platform built for students.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">What StudySphere Offers</h2>
          <p className="section-subtitle">
            Everything you need to stay organized, in one place.
          </p>

          <div className="features-grid">
            <div className="card feature-card">
              <div className="feature-icon">📚</div>
              <h3>Study Notes</h3>
              <p>Browse and download notes organized by subject, uploaded by your institution.</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">📝</div>
              <h3>Assignments</h3>
              <p>View assignment details, due dates, and status — never miss a deadline again.</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">📤</div>
              <h3>Easy Submissions</h3>
              <p>Submit your assignments directly through the platform and track their status.</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Keep an eye on pending, submitted, and completed assignments from your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>

          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create an Account</h3>
              <p>Register as a student in just a few seconds.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Explore Resources</h3>
              <p>Access notes and view assignments shared by your institution.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Submit & Track</h3>
              <p>Submit assignments and track your progress from your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="container cta-content">
          <h2>Ready to get organized?</h2>
          <p>Join StudySphere today and take control of your academic workflow.</p>
          <Link to="/register" className="btn btn-primary">Create Free Account</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;