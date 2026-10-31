// MOCK DATA — temporary, will be replaced by real API calls to
// Node.js/Express/MongoDB once the backend is built.

export const adminAssignmentsData = [
  { id: 1, title: 'React Component Assignment', subject: 'Web Development', dueDate: '2026-08-22', status: 'Active', submissionsCount: 12 },
  { id: 2, title: 'ER Diagram Submission', subject: 'DBMS', dueDate: '2026-08-25', status: 'Active', submissionsCount: 8 },
  { id: 3, title: 'Networking Case Study', subject: 'Computer Networks', dueDate: '2026-08-28', status: 'Active', submissionsCount: 5 },
  { id: 4, title: 'JavaScript Basics Quiz', subject: 'Web Development', dueDate: '2026-08-10', status: 'Completed', submissionsCount: 45 },
  { id: 5, title: 'SQL Queries Assignment', subject: 'DBMS', dueDate: '2026-08-08', status: 'Completed', submissionsCount: 38 },
  { id: 6, title: 'OS Scheduling Report', subject: 'Operating Systems', dueDate: '2026-08-18', status: 'Active', submissionsCount: 20 },
];

export const adminAssignmentStatusOptions = ['All', 'Active', 'Completed'];