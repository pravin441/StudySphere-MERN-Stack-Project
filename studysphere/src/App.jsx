import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import Notes from './pages/Notes';
import NoteDetails from './pages/NoteDetails';
import Assignments from './pages/Assignments';
import AssignmentDetails from './pages/AssignmentDetails';
import SubmitAssignment from './pages/SubmitAssignment';
import Submissions from './pages/Submissions';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminNotes from './pages/AdminNotes';
import AdminAssignments from './pages/AdminAssignments';
import AdminSubmissions from './pages/AdminSubmissions';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages use Navbar + Footer */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
          <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
          <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />

          {/* Student pages — protected, require role: student */}
          <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/notes" element={<ProtectedRoute role="student"><Notes /></ProtectedRoute>} />
          <Route path="/student/notes/:id" element={<ProtectedRoute role="student"><NoteDetails /></ProtectedRoute>} />
          <Route path="/student/assignments" element={<ProtectedRoute role="student"><Assignments /></ProtectedRoute>} />
          <Route path="/student/assignments/:id" element={<ProtectedRoute role="student"><AssignmentDetails /></ProtectedRoute>} />
          <Route path="/student/assignments/:id/submit" element={<ProtectedRoute role="student"><SubmitAssignment /></ProtectedRoute>} />
          <Route path="/student/submissions" element={<ProtectedRoute role="student"><Submissions /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="student"><Profile /></ProtectedRoute>} />

          {/* Admin pages — protected, require role: admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />
          <Route path="/admin/notes" element={<ProtectedRoute role="admin"><AdminNotes /></ProtectedRoute>} />
          <Route path="/admin/assignments" element={<ProtectedRoute role="admin"><AdminAssignments /></ProtectedRoute>} />
          <Route path="/admin/submissions" element={<ProtectedRoute role="admin"><AdminSubmissions /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;