import { useState, useEffect } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import '../styles/Profile.css';

function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get(`/api/students/${user.id}`);
        setFormData({
          fullName: data.student.fullName || '',
          email: data.student.email || '',
          phone: data.student.phone || '',
          course: data.student.course || '',
          studentId: data.student.studentId || '',
          joinedOn: data.student.joinedOn || '',
        });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/api/students/${user.id}`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
      });
      setSaved(true);

      // Update the locally-stored user so the navbar/dashboard greeting
      // reflects the new name immediately without needing to re-login.
      const updatedUser = { ...user, fullName: formData.fullName, email: formData.email };
      localStorage.setItem('studysphere_user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || !formData) {
    return (
      <>
        <StudentNavbar />
        <div className="profile-page"><div className="container"><p>Loading profile...</p></div></div>
      </>
    );
  }

  const initials = formData.fullName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <StudentNavbar />
      <div className="profile-page">
        <div className="container">
          <div className="profile-header">
            <div className="avatar">{initials}</div>
            <div>
              <h1>{formData.fullName}</h1>
              <p>{formData.email}</p>
            </div>
          </div>

          <div className="profile-grid">
            <div className="card profile-form-card">
              <h2>Edit Profile</h2>

              {error && <div className="form-error">{error}</div>}
              {saved && (
                <div className="success-message">
                  ✅ Profile updated successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="course">Course</label>
                  <input type="text" id="course" name="course" value={formData.course} onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary save-btn">Save Changes</button>
              </form>
            </div>

            <div className="card account-info-card">
              <h2>Account Info</h2>
              <div className="info-row">
                <span className="info-label">Student ID</span>
                <span className="info-value">{formData.studentId}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Joined On</span>
                <span className="info-value">{formData.joinedOn}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Type</span>
                <span className="info-value">Student</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;