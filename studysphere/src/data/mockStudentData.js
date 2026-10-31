// MOCK DATA — temporary, will be replaced by real API calls to
// Node.js/Express/MongoDB once the backend is built.

export const studentInfo = {
  name: 'Priya Sharma',
};

export const dashboardStats = {
  totalNotes: 24,
  activeAssignments: 5,
  submittedAssignments: 12,
  pendingAssignments: 3,
};

export const recentNotes = [
  { id: 1, title: 'Introduction to React', subject: 'Web Development' },
  { id: 2, title: 'Database Normalization', subject: 'DBMS' },
  { id: 3, title: 'OSI Model Basics', subject: 'Computer Networks' },
];

export const upcomingAssignments = [
  { id: 1, title: 'React Component Assignment', subject: 'Web Development', dueDate: '2026-08-22', status: 'Due Soon' },
  { id: 2, title: 'ER Diagram Submission', subject: 'DBMS', dueDate: '2026-08-25', status: 'Pending' },
  { id: 3, title: 'Networking Case Study', subject: 'Computer Networks', dueDate: '2026-08-28', status: 'Pending' },
];

export const recentSubmissions = [
  { id: 1, title: 'JavaScript Basics Quiz', subject: 'Web Development', submittedOn: '2026-08-10', status: 'Completed' },
  { id: 2, title: 'SQL Queries Assignment', subject: 'DBMS', submittedOn: '2026-08-08', status: 'Completed' },
];