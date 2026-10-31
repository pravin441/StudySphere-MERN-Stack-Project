import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { api } from '../utils/api';
import '../styles/AdminSubmissions.css';

const statusOptions = ['All', 'Pending Review', 'Graded'];

function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');

  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [gradeError, setGradeError] = useState('');

  const fetchSubmissions = async function () {
    setLoading(true);
    try {
      const params = activeStatus !== 'All' ? ('?status=' + activeStatus) : '';
      const data = await api.get('/api/submissions' + params);
      const filtered = searchTerm
        ? data.submissions.filter(function (s) {
            return (
              s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              s.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase())
            );
          })
        : data.submissions;
      setSubmissions(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(function () {
    fetchSubmissions();
  }, [activeStatus, searchTerm]);

  const openGradeModal = function (submission) {
    setGradingSubmission(submission);
    setGradeInput(submission.grade || '');
    setGradeError('');
  };

  const closeGradeModal = function () {
    setGradingSubmission(null);
    setGradeInput('');
    setGradeError('');
  };

  const handleSaveGrade = async function () {
    if (!gradeInput.trim()) {
      setGradeError('Please enter a grade.');
      return;
    }
    try {
      await api.put('/api/submissions/' + gradingSubmission._id + '/grade', { grade: gradeInput.trim() });
      closeGradeModal();
      fetchSubmissions();
    } catch (err) {
      setGradeError(err.message);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-submissions-page">
        <div className="container">
          <div className="admin-page-header">
            <div>
              <h1>Manage Submissions</h1>
              <p>Review and grade student assignment submissions.</p>
            </div>
          </div>

          <div className="filters-row">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by student or assignment..."
                value={searchTerm}
                onChange={function (e) { setSearchTerm(e.target.value); }}
              />
            </div>
            <div className="status-filters">
              {statusOptions.map(function (status) {
                return (
                  <button
                    key={status}
                    className={'filter-pill ' + (activeStatus === status ? 'active' : '')}
                    onClick={function () { setActiveStatus(status); }}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading submissions...</p>
            </div>
          ) : submissions.length > 0 ? (
            <div className="card table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Assignment</th>
                    <th>Subject</th>
                    <th>Submitted On</th>
                    <th>Status</th>
                    <th>Grade</th>
                    <th>File</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(function (s) {
                    return (
                      <tr key={s._id}>
                        <td className="cell-name">{s.studentName}</td>
                        <td>{s.assignmentTitle}</td>
                        <td>{s.subject}</td>
                        <td>{s.submittedOn}</td>
                        <td>
                          <span className={'status-badge status-' + s.status.replace(' ', '-').toLowerCase()}>
                            {s.status}
                          </span>
                        </td>
                        <td>{s.grade || '-'}</td>
                        <td>
                          <a href={'http://localhost:5000' + s.filePath} target="_blank" rel="noopener noreferrer" className="action-btn view-btn">
                            {s.fileName}
                          </a>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="action-btn grade-btn" onClick={function () { openGradeModal(s); }}>
                              {s.status === 'Graded' ? 'Update Grade' : 'Grade'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No submissions found matching your search or filter.</p>
            </div>
          )}
        </div>
      </div>

      {gradingSubmission && (
        <div className="grade-modal-overlay" onClick={closeGradeModal}>
          <div className="grade-modal" onClick={function (e) { e.stopPropagation(); }}>
            <h3>Grade Submission</h3>
            <p className="grade-modal-subtitle">
              {gradingSubmission.studentName} &middot; {gradingSubmission.assignmentTitle}
            </p>

            {gradeError && <div className="form-error">{gradeError}</div>}

            <label className="grade-modal-label">Grade</label>
            <input
              type="text"
              className="grade-modal-input"
              placeholder="e.g. 18/20"
              value={gradeInput}
              onChange={function (e) { setGradeInput(e.target.value); }}
              autoFocus
            />

            <div className="grade-modal-actions">
              <button className="btn btn-secondary" onClick={closeGradeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveGrade}>Save Grade</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSubmissions;