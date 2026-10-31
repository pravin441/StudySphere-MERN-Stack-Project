const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} = require('../controllers/assignmentController');
const { requireAdmin } = require('../middleware/authMiddleware');

function registerAssignmentRoutes(router) {
  // Anyone can view assignments (students need this).
  router.get('/api/assignments', getAssignments);
  router.get('/api/assignments/:id', getAssignmentById);

  // Only admins can create, update, or delete assignments.
  router.post('/api/assignments', requireAdmin(createAssignment));
  router.put('/api/assignments/:id', requireAdmin(updateAssignment));
  router.delete('/api/assignments/:id', requireAdmin(deleteAssignment));
}

module.exports = registerAssignmentRoutes;