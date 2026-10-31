import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { api } from '../utils/api';
import '../styles/Assignments.css';

const statusOptions = ['All', 'Active', 'Completed'];

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError('');
      try {
        const params = activeStatus !== 'All' ? `?status=${activeStatus}` : '';
        const data = await api.get(`/api/assignments${params}`);
        setAssignments(data.assignments);
      } catch (err) {
        setError('Failed to load assignments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [activeStatus]);

  const statusClass = (status) => status.replace(' ', '-').toLowerCase();

  return (
    <>
      <StudentNavbar />
      <div className="assignments-page">
        <div className="container">
          <div className="assignments-header">
            <h1>Assignments</h1>
            <p>Track your assignments and stay on top of deadlines.</p>
          </div>

          <div className="status-filters">
            {statusOptions.map((status) => (
              <button
                key={status}
                className={`filter-pill ${activeStatus === status ? 'active' : ''}`}
                onClick={() => setActiveStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {loading && <div className="empty-state"><p>Loading assignments...</p></div>}
          {error && <div className="empty-state"><p>{error}</p></div>}

          {!loading && !error && (
            assignments.length > 0 ? (
              <div className="assignments-list">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="card assignment-card">
                    <div className="assignment-main">
                      <div className="assignment-top">
                        <h3>{assignment.title}</h3>
                        <span className={`status-badge status-${statusClass(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </div>
                      <p className="assignment-subject">{assignment.subject}</p>
                      <p className="assignment-description">{assignment.description}</p>
                      <p className="assignment-due">Due: {assignment.dueDate}</p>
                    </div>

                    <div className="assignment-actions">
                      <Link to={`/student/assignments/${assignment._id}`} className="btn btn-secondary">
                        View Details
                      </Link>
                      {assignment.status === 'Active' && (
                        <Link to={`/student/assignments/${assignment._id}/submit`} className="btn btn-primary">
                          Submit
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No assignments found for this filter.</p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default Assignments;