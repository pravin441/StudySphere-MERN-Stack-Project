// MOCK DATA — temporary, will be replaced by real API calls to
// Node.js/Express/MongoDB once the backend is built.

export const adminInfo = {
  name: 'Admin User',
};

export const adminStats = {
  totalStudents: 156,
  totalNotes: 84,
  totalAssignments: 42,
  totalSubmissions: 631,
};

export const recentActivity = [
  { id: 1, action: 'New student registered', detail: 'Rahul Verma joined StudySphere', time: '2 hours ago' },
  { id: 2, action: 'Assignment submitted', detail: 'Priya Sharma submitted "OS Scheduling Report"', time: '4 hours ago' },
  { id: 3, action: 'New note uploaded', detail: '"React Hooks Deep Dive" added to Web Development', time: '1 day ago' },
  { id: 4, action: 'Assignment created', detail: '"Networking Case Study" added for Computer Networks', time: '2 days ago' },
  { id: 5, action: 'New student registered', detail: 'Ananya Gupta joined StudySphere', time: '3 days ago' },
];