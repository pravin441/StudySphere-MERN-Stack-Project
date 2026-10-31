import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { api } from '../utils/api';
import '../styles/AssignmentDetails.css';

function AssignmentDetails() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(function () {
    const fetchAssignment = async function () {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await api.get('/api/assignments/' + id);
        setAssignment(data.assignment);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const statusClass = function (status) {
    return status.replace(' ', '-').toLowerCase();
  };

  if (loading) {
    return (
      <>
        <StudentNavbar />
        <div className="assignment-details-page">
          <div className="container">
            <p>Loading assignment...</p>
          </div>
        </div>
      </>
    );
  }

  if (notFound || !assignment) {
    return (
      <>
        <StudentNavbar />
        <div className="assignment-details-page">
          <div className="container">
            <div className="empty-state">
              <p>Assignment not found.</p>
              <Link to="/student/assignments" className="btn btn-primary">Back to Assignments</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const canSubmit = assignment.status === 'Active';
  const hasFile = Boolean(assignment.filePath);
  const fileUrl = hasFile ? ('http://localhost:5000' + assignment.filePath) : '#';

  return (
    <>
      <StudentNavbar />
      <div className="assignment-details-page">
        <div className="container">
          <Link to="/student/assignments" className="back-link">Back to Assignments</Link>

          <div className="card assignment-details-card">
            <div className="assignment-details-header">
              <span className={'status-badge status-' + statusClass(assignment.status)}>
                {assignment.status}
              </span>
              <h1>{assignment.title}</h1>
              <p className="assignment-subject">{assignment.subject}</p>
            </div>

            <div className="details-block">
              <h3>Description</h3>
              <p>{assignment.description}</p>
            </div>

            <div className="details-block">
              <h3>Instructions</h3>
              <p>{assignment.instructions}</p>
            </div>

            {hasFile && (
              <div className="details-block">
                <h3>Reference File</h3>
                <a href={fileUrl} download={assignment.fileName} className="btn btn-secondary">
                  Download {assignment.fileName}
                </a>
              </div>
            )}

            <div className="assignment-meta">
              <div className="meta-item">
                <span className="meta-label">Assigned On</span>
                <span className="meta-value">{assignment.assignedDate}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Due Date</span>
                <span className="meta-value">{assignment.dueDate}</span>
              </div>
            </div>

            {canSubmit ? (
              <div className="assignment-details-actions">
                <Link to={'/student/assignments/' + assignment._id + '/submit'} className="btn btn-primary">
                  Submit Assignment
                </Link>
              </div>
            ) : (
              <div className="submission-info">
                <p>This assignment is marked complete.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignmentDetails;