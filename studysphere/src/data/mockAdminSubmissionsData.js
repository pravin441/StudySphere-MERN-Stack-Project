// MOCK DATA — temporary, will be replaced by real API calls to
// Node.js/Express/MongoDB once the backend is built.

export const adminSubmissionsData = [
  { id: 1, studentName: 'Pravin Sharma', assignmentTitle: 'JavaScript Basics Quiz', subject: 'Web Development', submittedOn: '2026-08-10', status: 'Graded', grade: '18/20' },
  { id: 2, studentName: 'Rahul Verma', assignmentTitle: 'SQL Queries Assignment', subject: 'DBMS', submittedOn: '2026-08-09', status: 'Graded', grade: '9/10' },
  { id: 3, studentName: 'Ananya Gupta', assignmentTitle: 'OS Scheduling Report', subject: 'Operating Systems', submittedOn: '2026-08-16', status: 'Pending Review', grade: null },
  { id: 4, studentName: 'Karan Mehta', assignmentTitle: 'React Component Assignment', subject: 'Web Development', submittedOn: '2026-08-19', status: 'Pending Review', grade: null },
  { id: 5, studentName: 'Sneha Iyer', assignmentTitle: 'ER Diagram Submission', subject: 'DBMS', submittedOn: '2026-08-20', status: 'Pending Review', grade: null },
  { id: 6, studentName: 'Arjun Nair', assignmentTitle: 'JavaScript Basics Quiz', subject: 'Web Development', submittedOn: '2026-08-09', status: 'Graded', grade: '16/20' },
];

export const adminSubmissionStatusOptions = ['All', 'Pending Review', 'Graded'];