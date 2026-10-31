const {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  gradeSubmission,
} = require('../controllers/submissionController');

function registerSubmissionRoutes(router) {
  router.post('/api/submissions', createSubmission);
  router.get('/api/submissions', getSubmissions);
  router.get('/api/submissions/:id', getSubmissionById);
  router.put('/api/submissions/:id/grade', gradeSubmission);
}

module.exports = registerSubmissionRoutes;