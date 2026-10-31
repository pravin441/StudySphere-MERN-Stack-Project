import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { api } from '../utils/api';
import '../styles/NoteDetails.css';

function NoteDetails() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [relatedNotes, setRelatedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await api.get('/api/notes/' + id);
        setNote(data.note);

        const relatedData = await api.get('/api/notes?subject=' + encodeURIComponent(data.note.subject));
        const filtered = relatedData.notes.filter(function (n) { return n._id !== data.note._id; }).slice(0, 3);
        setRelatedNotes(filtered);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) {
    return (
      <>
        <StudentNavbar />
        <div className="note-details-page">
          <div className="container">
            <p>Loading note...</p>
          </div>
        </div>
      </>
    );
  }

  if (notFound || !note) {
    return (
      <>
        <StudentNavbar />
        <div className="note-details-page">
          <div className="container">
            <div className="empty-state">
              <p>Note not found.</p>
              <Link to="/student/notes" className="btn btn-primary">Back to Notes</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const fileUrl = note.filePath ? ('http://localhost:5000' + note.filePath) : '#';

  const handleActionClick = function (e) {
    if (!note.filePath) {
      e.preventDefault();
      alert('No file attached to this note.');
    }
  };

  return (
    <>
      <StudentNavbar />
      <div className="note-details-page">
        <div className="container">
          <Link to="/student/notes" className="back-link">Back to Notes</Link>

          <div className="card note-details-card">
            <div className="note-details-header">
              <span className="file-type-badge">{note.fileType}</span>
              <h1>{note.title}</h1>
              <p className="note-subject">{note.subject}</p>
            </div>

            <p className="note-full-description">{note.description}</p>

            <div className="note-meta">
              <div className="meta-item">
                <span className="meta-label">Uploaded On</span>
                <span className="meta-value">{note.uploadedOn}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">File Type</span>
                <span className="meta-value">{note.fileType}</span>
              </div>
            </div>

            <div className="note-details-actions">
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" onClick={handleActionClick}>
                View
              </a>
              <a href={fileUrl} download={note.fileName} className="btn btn-primary" onClick={handleActionClick}>
                Download
              </a>
            </div>
          </div>

          {relatedNotes.length > 0 && (
            <div className="related-notes">
              <h2>Related Notes</h2>
              <div className="related-grid">
                {relatedNotes.map(function (related) {
                  return (
                    <Link key={related._id} to={'/student/notes/' + related._id} className="card related-card">
                      <span className="file-type-badge">{related.fileType}</span>
                      <h3>{related.title}</h3>
                      <p className="note-subject">{related.subject}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NoteDetails;