import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

function About() {
  // Controls which tab is currently active
  const [activeTab, setActiveTab] = useState('mission');

  const tabs = [
    { id: 'mission', label: 'Mission' },
    { id: 'features', label: 'Features' },
    { id: 'techstack', label: 'Tech Stack' },
  ];

  return (
    <div className="about">
      {/* PAGE HEADER */}
      <section className="page-header">
        <div className="container">
          <h1>About StudySphere</h1>
          <p>Helping students stay organized, one assignment at a time.</p>
        </div>
      </section>

      {/* TABBED CONTENT */}
      <section className="about-section">
        <div className="container about-content">
          {/* Tab buttons */}
          <div className="tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="tab-panel">
            {activeTab === 'mission' && (
              <div className="tab-content">
                <h2>Our Mission</h2>
                <p>
                  StudySphere was built to solve a simple problem: students often
                  struggle to keep track of study notes, assignment deadlines, and
                  submission status across scattered platforms. StudySphere brings
                  all of this into a single, easy-to-use system — helping students
                  focus on learning instead of managing logistics.
                </p>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="tab-content">
                <h2>What StudySphere Offers</h2>
                <ul className="about-list">
                  <li>
                    <strong>Centralized Notes:</strong> Students can browse and download
                    study material organized by subject.
                  </li>
                  <li>
                    <strong>Assignment Tracking:</strong> Clear visibility into pending,
                    due-soon, and completed assignments.
                  </li>
                  <li>
                    <strong>Simple Submissions:</strong> Submit assignments directly
                    through the platform without emailing files back and forth.
                  </li>
                  <li>
                    <strong>Admin Tools:</strong> Institutions can manage students, notes,
                    assignments, and submissions from one dashboard.
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'techstack' && (
              <div className="tab-content">
                <h2>About This Project</h2>
                <p>
                  StudySphere is developed as part of a BCA Advanced Web Development
                  college project. The frontend is built using React.js, with plans
                  to integrate a Node.js, Express.js, and MongoDB backend in later
                  phases of development.
                </p>
                <div className="tech-tags">
                  <span className="tag">React.js</span>
                  <span className="tag">JavaScript</span>
                  <span className="tag">HTML5 / CSS3</span>
                  <span className="tag">Node.js (Planned)</span>
                  <span className="tag">Express.js (Planned)</span>
                  <span className="tag">MongoDB (Planned)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container cta-content">
          <h2>Ready to get started?</h2>
          <p>Create your free StudySphere account today.</p>
          <Link to="/register" className="btn btn-primary">Register Now</Link>
        </div>
      </section>
    </div>
  );
}

export default About;