import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import '../styles/StudentDashboard.css';

function StudentDashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesData, assignmentsData, submissionsData] = await Promise.all([
          api.get('/api/notes'),
          api.get('/api/assignments'),
          api.get(`/api/submissions?studentId=${user.id}`),
        ]);
        setNotes(notesData.notes || []);
        setAssignments(assignmentsData.assignments || []);
        setSubmissions(submissionsData.submissions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (!user || loading) {
    return (
      <>
        <StudentNavbar />
        <div className="dashboard"><div className="container"><p>Loading dashboard...</p></div></div>
      </>
    );
  }

  const activeAssignments = assignments.filter((a) => a.status === 'Active');
  const submittedCount = submissions.length;
  const pendingCount = activeAssignments.length;

  return (
    <>
      <StudentNavbar />
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1>Welcome back, {user.fullName.split(' ')[0]} 👋</h1>
            <p>Here's what's happening with your academics today.</p>
          </div>

          <div className="stats-grid">
            <div className="card stat-card">
              <p className="stat-label">Total Notes</p>
              <h2>{notes.length}</h2>
            </div>
            <div className="card stat-card">
              <p className="stat-label">Active Assignments</p>
              <h2>{activeAssignments.length}</h2>
            </div>
            <div className="card stat-card">
              <p className="stat-label">Submitted</p>
              <h2>{submittedCount}</h2>
            </div>
            <div className="card stat-card">
              <p className="stat-label">Pending</p>
              <h2>{pendingCount}</h2>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/student/notes" className="card action-card">
              <span className="action-icon">📚</span>
              <span>Browse Notes</span>
            </Link>
            <Link to="/student/assignments" className="card action-card">
              <span className="action-icon">📝</span>
              <span>View Assignments</span>
            </Link>
            <Link to="/student/submissions" className="card action-card">
              <span className="action-icon">📤</span>
              <span>My Submissions</span>
            </Link>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Notes</h2>
              <Link to="/student/notes" className="view-all-link">View All</Link>
            </div>
            <div className="card list-card">
              {notes.length > 0 ? notes.slice(0, 3).map((note) => (
                <div key={note._id} className="list-row">
                  <div>
                    <p className="list-title">{note.title}</p>
                    <p className="list-subtext">{note.subject}</p>
                  </div>
                </div>
              )) : <div className="list-row"><p className="list-subtext">No notes yet.</p></div>}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Upcoming Assignments</h2>
              <Link to="/student/assignments" className="view-all-link">View All</Link>
            </div>
            <div className="card list-card">
              {activeAssignments.length > 0 ? activeAssignments.slice(0, 3).map((a) => (
                <div key={a._id} className="list-row">
                  <div>
                    <p className="list-title">{a.title}</p>
                    <p className="list-subtext">{a.subject} · Due {a.dueDate}</p>
                  </div>
                  <span className="status-badge status-active">{a.status}</span>
                </div>
              )) : <div className="list-row"><p className="list-subtext">No active assignments.</p></div>}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Submissions</h2>
              <Link to="/student/submissions" className="view-all-link">View All</Link>
            </div>
            <div className="card list-card">
              {submissions.length > 0 ? submissions.slice(0, 3).map((s) => (
                <div key={s._id} className="list-row">
                  <div>
                    <p className="list-title">{s.assignmentTitle}</p>
                    <p className="list-subtext">{s.subject} · Submitted {s.submittedOn}</p>
                  </div>
                  <span className={`status-badge status-${s.status === 'Graded' ? 'completed' : 'submitted'}`}>{s.status}</span>
                </div>
              )) : <div className="list-row"><p className="list-subtext">No submissions yet.</p></div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;