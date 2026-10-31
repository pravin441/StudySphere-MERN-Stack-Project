// MOCK DATA — temporary, will be replaced by real API calls to
// Node.js/Express/MongoDB once the backend is built.

export const submissionsData = [
  {
    id: 1,
    assignmentTitle: 'JavaScript Basics Quiz',
    subject: 'Web Development',
    fileName: 'js_basics_quiz.pdf',
    submittedOn: '2026-08-10',
    status: 'Completed',
    grade: '18/20',
  },
  {
    id: 2,
    assignmentTitle: 'SQL Queries Assignment',
    subject: 'DBMS',
    fileName: 'sql_queries_assignment.sql',
    submittedOn: '2026-08-08',
    status: 'Completed',
    grade: '9/10',
  },
  {
    id: 3,
    assignmentTitle: 'OS Scheduling Report',
    subject: 'Operating Systems',
    fileName: 'os_scheduling_report.pdf',
    submittedOn: '2026-08-16',
    status: 'Submitted',
    grade: null,
  },
];

export const submissionStatusOptions = ['All', 'Submitted', 'Completed'];