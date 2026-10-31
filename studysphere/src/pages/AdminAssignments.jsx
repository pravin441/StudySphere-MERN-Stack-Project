import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { api } from "../utils/api";
import "../styles/AdminAssignments.css";

const statusOptions = ["All", "Active", "Completed"];

function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "Web Development",
    description: "",
    instructions: "",
    dueDate: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState("");

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const params = activeStatus !== "All" ? "?status=" + activeStatus : "";
      const data = await api.get("/api/assignments" + params);
      const filtered = searchTerm
        ? data.assignments.filter(function (a) {
            return a.title.toLowerCase().includes(searchTerm.toLowerCase());
          })
        : data.assignments;
      setAssignments(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [activeStatus, searchTerm]);

  const handleFormChange = function (e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = function (e) {
    setSelectedFile(e.target.files[0] || null);
  };

  const handleCreate = async function (e) {
    e.preventDefault();
    setFormError("");
    if (!formData.title || !formData.subject || !formData.dueDate) {
      setFormError("Title, subject, and due date are required.");
      return;
    }
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("subject", formData.subject);
      payload.append("description", formData.description);
      payload.append("instructions", formData.instructions);
      payload.append("dueDate", formData.dueDate);
      if (selectedFile) {
        payload.append("file", selectedFile);
      }

      const token = localStorage.getItem("studysphere_token");
      const res = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: payload,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create assignment.");
      }

      setFormData({
        title: "",
        subject: "Web Development",
        description: "",
        instructions: "",
        dueDate: "",
      });
      setSelectedFile(null);
      setShowForm(false);
      fetchAssignments();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async function (id, title) {
    const confirmed = window.confirm("Are you sure you want to delete \"" + title + "\"?");
    if (!confirmed) return;
    try {
      await api.delete("/api/assignments/" + id);
      fetchAssignments();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-assignments-page">
        <div className="container">
          <div className="admin-page-header">
            <div>
              <h1>Manage Assignments</h1>
              <p>Create and manage assignments for students.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "+ Create Assignment"}
            </button>
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom: "24px", padding: "24px" }}>
              {formError && (
                <div className="form-error" style={{ marginBottom: "12px" }}>
                  {formError}
                </div>
              )}
              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input
                  type="text"
                  name="title"
                  placeholder="Assignment title"
                  value={formData.title}
                  onChange={handleFormChange}
                  style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "8px" }}
                />
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "8px" }}
                >
                  <option>Web Development</option>
                  <option>DBMS</option>
                  <option>Computer Networks</option>
                  <option>Operating Systems</option>
                </select>
                <textarea
                  name="description"
                  placeholder="Short description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="2"
                  style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "8px" }}
                />
                <textarea
                  name="instructions"
                  placeholder="Detailed instructions"
                  value={formData.instructions}
                  onChange={handleFormChange}
                  rows="3"
                  style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "8px" }}
                />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleFormChange}
                  style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "8px" }}
                />
                <div>
                  <label style={{ fontSize: "13px", color: "var(--muted-color)", display: "block", marginBottom: "6px" }}>
                    Attach reference file (optional)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    style={{ padding: "10px", border: "1px dashed var(--border-color)", borderRadius: "8px", width: "100%" }}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Create Assignment
                </button>
              </form>
            </div>
          )}

          <div className="filters-row">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search assignments by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="status-filters">
              {statusOptions.map(function (status) {
                return (
                  <button
                    key={status}
                    className={"filter-pill " + (activeStatus === status ? "active" : "")}
                    onClick={() => setActiveStatus(status)}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading assignments...</p>
            </div>
          ) : assignments.length > 0 ? (
            <div className="card table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Submissions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(function (a) {
                    return (
                      <tr key={a._id}>
                        <td className="cell-name">{a.title}</td>
                        <td>{a.subject}</td>
                        <td>{a.dueDate}</td>
                        <td>
                          <span className={"status-badge status-" + a.status.toLowerCase()}>
                            {a.status}
                          </span>
                        </td>
                        <td>{a.submissionsCount || 0}</td>
                        <td>
                          <div className="table-actions">
                            <button className="action-btn delete-btn" onClick={() => handleDelete(a._id, a.title)}>
                              Delete
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
              <p>No assignments found matching your search or filter.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminAssignments;