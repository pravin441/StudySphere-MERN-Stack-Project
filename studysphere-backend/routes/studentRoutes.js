const {
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

function registerStudentRoutes(router) {
  // Only admins can list all students (privacy — student list shouldn't be public).
  router.get('/api/students', requireAdmin(getStudents));

  // Any logged-in user (student viewing own profile, or admin) can view a single profile.
  router.get('/api/students/:id', requireAuth(getStudentById));

  // Any logged-in user can update a profile (student updates their own via frontend logic).
  router.put('/api/students/:id', requireAuth(updateStudent));

  // Only admins can delete student accounts.
  router.delete('/api/students/:id', requireAdmin(deleteStudent));
}

module.exports = registerStudentRoutes;