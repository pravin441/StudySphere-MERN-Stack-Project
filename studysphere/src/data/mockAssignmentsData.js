// MOCK DATA — temporary, will be replaced by real API calls to
// Node.js/Express/MongoDB once the backend is built.

export const assignmentsData = [
  {
    id: 1,
    title: 'React Component Assignment',
    subject: 'Web Development',
    description: 'Build a reusable card component with props for title and image.',
    dueDate: '2026-08-22',
    status: 'Due Soon',
  },
  {
    id: 2,
    title: 'ER Diagram Submission',
    subject: 'DBMS',
    description: 'Design an ER diagram for a library management system.',
    dueDate: '2026-08-25',
    status: 'Pending',
  },
  {
    id: 3,
    title: 'Networking Case Study',
    subject: 'Computer Networks',
    description: 'Analyze a real-world network topology and write a report.',
    dueDate: '2026-08-28',
    status: 'Pending',
  },
  {
    id: 4,
    title: 'JavaScript Basics Quiz',
    subject: 'Web Development',
    description: 'Complete the quiz covering variables, functions, and loops.',
    dueDate: '2026-08-10',
    status: 'Completed',
  },
  {
    id: 5,
    title: 'SQL Queries Assignment',
    subject: 'DBMS',
    description: 'Write 10 SQL queries covering joins, subqueries, and aggregation.',
    dueDate: '2026-08-08',
    status: 'Completed',
  },
  {
    id: 6,
    title: 'OS Scheduling Report',
    subject: 'Operating Systems',
    description: 'Compare FCFS, SJF, and Round Robin scheduling with examples.',
    dueDate: '2026-08-18',
    status: 'Submitted',
  },
];

export const statusOptions = ['All', 'Pending', 'Due Soon', 'Submitted', 'Completed'];