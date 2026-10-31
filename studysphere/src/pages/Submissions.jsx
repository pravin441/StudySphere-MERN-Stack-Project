import { useState, useEffect } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import '../styles/Submissions.css';

const submissionStatusOptions = ['All', 'Pending Review', 'Graded'];

function Submissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ studentId: user.id });
        if (activeStatus !== 'All') params.append('status', activeStatus);
        const data = await api.get(`/api/submissions?${params.toString()}`);
        setSubmissions(data.submissions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchSubmissions();
  }, [user, activeStatus]);

  return (
    <>
      <StudentNavbar />
      <div className="submissions-page">
        <div className="container">
          <div className="submissions-header">
            <h1>My Submissions</h1>
            <p>View the status and grades of everything you've submitted.</p>
          </div>

          <div className="status-filters">
            {submissionStatusOptions.map((status) => (
              <button key={status} className={`filter-pill ${activeStatus === status ? 'active' : ''}`} onClick={() => setActiveStatus(status)}>
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="empty-state"><p>Loading submissions...</p></div>
          ) : submissions.length > 0 ? (
            <div className="submissions-list">
              {submissions.map((submission) => (
                <div key={submission._id} className="card submission-card">
                  <div className="submission-main">
                    <div className="submission-top">
                      <h3>{submission.assignmentTitle}</h3>
                      <span className={`status-badge status-${submission.status.replace(' ', '-').toLowerCase()}`}>
                        {submission.status}
                      </span>
                    </div>
                    <p className="submission-subject">{submission.subject}</p>
                    <p className="submission-file">📎 {submission.fileName}</p>
                    <p className="submission-date">Submitted on {submission.submittedOn}</p>
                  </div>
                  {submission.status === 'Graded' && (
                    <div className="submission-grade">
                      <span className="grade-label">Grade</span>
                      <span className="grade-value">{submission.grade}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><p>No submissions found for this filter.</p></div>
          )}
        </div>
      </div>
    </>
  );
}

export default Submissions;