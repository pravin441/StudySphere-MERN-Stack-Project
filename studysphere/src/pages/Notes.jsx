import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { api } from '../utils/api';
import '../styles/Notes.css';

const subjects = ['All', 'Web Development', 'DBMS', 'Computer Networks', 'Operating Systems'];

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubject, setActiveSubject] = useState('All');

  // Fetch notes whenever the search term or subject filter changes.
  // The backend handles the actual filtering via query params.
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (activeSubject !== 'All') params.append('subject', activeSubject);
        if (searchTerm) params.append('search', searchTerm);

        const data = await api.get(`/api/notes?${params.toString()}`);
        setNotes(data.notes);
      } catch (err) {
        setError('Failed to load notes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Small debounce so we don't fire a request on every keystroke
    const timer = setTimeout(fetchNotes, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, activeSubject]);

  return (
    <>
      <StudentNavbar />
      <div className="notes-page">
        <div className="container">
          <div className="notes-header">
            <h1>Study Notes</h1>
            <p>Browse and download notes shared by your institution.</p>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search notes by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="subject-filters">
            {subjects.map((subject) => (
              <button
                key={subject}
                className={`filter-pill ${activeSubject === subject ? 'active' : ''}`}
                onClick={() => setActiveSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>

          {loading && <div className="empty-state"><p>Loading notes...</p></div>}
          {error && <div className="empty-state"><p>{error}</p></div>}

          {!loading && !error && (
            notes.length > 0 ? (
              <div className="notes-grid">
                {notes.map((note) => (
                  <div key={note._id} className="card note-card">
                    <div className="note-card-header">
                      <span className="file-type-badge">{note.fileType}</span>
                    </div>
                    <h3>{note.title}</h3>
                    <p className="note-subject">{note.subject}</p>
                    <p className="note-description">{note.description}</p>
                    <div className="note-actions">
                      <Link to={`/student/notes/${note._id}`} className="btn btn-secondary note-btn">View</Link>
                      <button className="btn btn-primary note-btn">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No notes found matching your search.</p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default Notes;