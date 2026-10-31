import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { api } from "../utils/api";
import "../styles/AdminNotes.css";

const adminNoteSubjects = [
  "All",
  "Web Development",
  "DBMS",
  "Computer Networks",
  "Operating Systems",
];

function AdminNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "Web Development",
    description: "",
    fileType: "PDF",
  });
  const [formError, setFormError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeSubject !== "All") params.append("subject", activeSubject);
      if (searchTerm) params.append("search", searchTerm);
      const data = await api.get(`/api/notes?${params.toString()}`);
      setNotes(data.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchNotes, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, activeSubject]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.title || !formData.subject || !selectedFile) {
      setFormError("Title, subject, and a file are required.");
      return;
    }
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("subject", formData.subject);
      payload.append("description", formData.description);
      payload.append("fileType", formData.fileType);
      payload.append("file", selectedFile);

      const token = localStorage.getItem("studysphere_token");
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create note.");

      setFormData({
        title: "",
        subject: "Web Development",
        description: "",
        fileType: "PDF",
      });
      setSelectedFile(null);
      setShowForm(false);
      fetchNotes();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`,
    );
    if (!confirmed) return;
    try {
      await api.delete(`/api/notes/${id}`);
      fetchNotes();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-notes-page">
        <div className="container">
          <div className="admin-page-header">
            <div>
              <h1>Manage Notes</h1>
              <p>Upload and manage study notes for students.</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ Upload Note"}
            </button>
          </div>

          {showForm && (
            <div
              className="card"
              style={{ marginBottom: "24px", padding: "24px" }}
            >
              {formError && (
                <div className="form-error" style={{ marginBottom: "12px" }}>
                  {formError}
                </div>
              )}
              <form
                onSubmit={handleCreateNote}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Note title"
                  value={formData.title}
                  onChange={handleFormChange}
                  style={{
                    padding: "10px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                />
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  style={{
                    padding: "10px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                >
                  {adminNoteSubjects
                    .filter((s) => s !== "All")
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  style={{
                    padding: "10px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                />
                <select
                  name="fileType"
                  value={formData.fileType}
                  onChange={handleFormChange}
                  style={{
                    padding: "10px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="PPT">PPT</option>
                </select>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                  style={{
                    padding: "10px",
                    border: "1px dashed var(--border-color)",
                    borderRadius: "8px",
                  }}
                />
                <button type="submit" className="btn btn-primary">
                  Create Note
                </button>
                Create Note
              </form>
            </div>
          )}

          <div className="filters-row">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search notes by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="subject-filters">
              {adminNoteSubjects.map((subject) => (
                <button
                  key={subject}
                  className={`filter-pill ${activeSubject === subject ? "active" : ""}`}
                  onClick={() => setActiveSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading notes...</p>
            </div>
          ) : notes.length > 0 ? (
            <div className="card table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>File Type</th>
                    <th>Uploaded On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note) => (
                    <tr key={note._id}>
                      <td className="cell-name">{note.title}</td>
                      <td>{note.subject}</td>
                      <td>
                        <span className="file-type-badge">{note.fileType}</span>
                      </td>
                      <td>{note.uploadedOn}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(note._id, note.title)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No notes found matching your search or filter.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminNotes;
