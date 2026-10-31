import { Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { adminInfo, adminStats, recentActivity } from '../data/mockAdminData';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  return (
    <>
      <AdminNavbar />
      <div className="admin-dashboard">
        <div className="container">
          {/* WELCOME */}
          <div className="admin-dashboard-header">
            <h1>Welcome back, {adminInfo.name}</h1>
            <p>Here's an overview of StudySphere's activity.</p>
          </div>

          {/* STATS */}
          <div className="admin-stats-grid">
            <div className="card admin-stat-card">
              <p className="stat-label">Total Students</p>
              <h2>{adminStats.totalStudents}</h2>
            </div>
            <div className="card admin-stat-card">
              <p className="stat-label">Total Notes</p>
              <h2>{adminStats.totalNotes}</h2>
            </div>
            <div className="card admin-stat-card">
              <p className="stat-label">Total Assignments</p>
              <h2>{adminStats.totalAssignments}</h2>
            </div>
            <div className="card admin-stat-card">
              <p className="stat-label">Total Submissions</p>
              <h2>{adminStats.totalSubmissions}</h2>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="admin-quick-actions">
            <Link to="/admin/students" className="card admin-action-card">
              <span className="action-icon">👥</span>
              <span>Manage Students</span>
            </Link>
            <Link to="/admin/notes" className="card admin-action-card">
              <span className="action-icon">📚</span>
              <span>Manage Notes</span>
            </Link>
            <Link to="/admin/assignments" className="card admin-action-card">
              <span className="action-icon">📝</span>
              <span>Manage Assignments</span>
            </Link>
            <Link to="/admin/submissions" className="card admin-action-card">
              <span className="action-icon">📤</span>
              <span>View Submissions</span>
            </Link>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="admin-dashboard-section">
            <h2>Recent Activity</h2>
            <div className="card activity-card">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-row">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-detail">{activity.detail}</p>
                  </div>
                  <span className="activity-time">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;