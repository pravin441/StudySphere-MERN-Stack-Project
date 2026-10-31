import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { useAuth } from '../context/AuthContext';
import '../styles/SubmitAssignment.css';

function SubmitAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const token = localStorage.getItem('studysphere_token');
        const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setAssignment(data.assignment);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedFile) {
      setError('Please select a file to submit.');
      return;
    }

    setSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('assignmentId', assignment._id);
      formPayload.append('studentId', user.id);
      formPayload.append('studentName', user.fullName);
      formPayload.append('assignmentTitle', assignment.title);
      formPayload.append('subject', assignment.subject);
      formPayload.append('comment', comment);
      formPayload.append('file', selectedFile);

      const token = localStorage.getItem('studysphere_token');
      const res = await fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <StudentNavbar />
        <div className="submit-page"><div className="container"><p>Loading...</p></div></div>
      </>
    );
  }

  if (!assignment) {
    return (
      <>
        <StudentNavbar />
        <div className="submit-page">
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

  if (submitted) {
    return (
      <>
        <StudentNavbar />
        <div className="submit-page">
          <div className="container">
            <div className="card success-card">
              <div className="success-icon">✅</div>
              <h1>Submission Received</h1>
              <p>
                Your file <strong>{selectedFile.name}</strong> has been submitted for "{assignment.title}".
              </p>
              <div className="success-actions">
                <Link to="/student/assignments" className="btn btn-primary">Back to Assignments</Link>
                <Link to="/student/dashboard" className="btn btn-secondary">Go to Dashboard</Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StudentNavbar />
      <div className="submit-page">
        <div className="container">
          <Link to={`/student/assignments/${assignment._id}`} className="back-link">
            &larr; Back to Assignment Details
          </Link>

          <div className="card submit-card">
            <div className="assignment-summary">
              <h1>Submit Assignment</h1>
              <p className="summary-title">{assignment.title}</p>
              <p className="summary-meta">{assignment.subject} · Due {assignment.dueDate}</p>
            </div>

            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit} className="submit-form">
              <div className="form-group">
                <label htmlFor="file">Upload File</label>
                <input type="file" id="file" onChange={handleFileChange} />
                <p className="field-hint">Accepted formats: PDF, DOCX, ZIP, PPT (Max 10MB)</p>
              </div>

              {selectedFile && <div className="file-preview">📎 {selectedFile.name}</div>}

              <div className="form-group">
                <label htmlFor="comment">Comments (optional)</label>
                <textarea
                  id="comment" rows="4" placeholder="Add any notes for your instructor..."
                  value={comment} onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary submit-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubmitAssignment;