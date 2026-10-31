import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { api } from '../utils/api';
import '../styles/AdminStudents.css';

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = searchTerm ? `?search=${searchTerm}` : '';
      const data = await api.get(`/api/students${params}`);
      setStudents(data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to remove ${name}?`);
    if (!confirmed) return;
    try {
      await api.delete(`/api/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-students-page">
        <div className="container">
          <div className="admin-page-header">
            <div>
              <h1>Manage Students</h1>
              <p>View and manage all registered students.</p>
            </div>
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {loading ? (
            <div className="empty-state"><p>Loading students...</p></div>
          ) : students.length > 0 ? (
            <div className="card table-card">
              <table className="data-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Student ID</th><th>Joined On</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="cell-name">{student.fullName}</td>
                      <td>{student.email}</td>
                      <td>{student.studentId}</td>
                      <td>{student.joinedOn}</td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn delete-btn" onClick={() => handleDelete(student._id, student.fullName)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No students found matching your search.</p></div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminStudents;