const { registerStudent, loginStudent, loginAdmin } = require('../controllers/authController');

function registerAuthRoutes(router) {
  router.post('/api/auth/register', registerStudent);
  router.post('/api/auth/login', loginStudent);
  router.post('/api/auth/admin/login', loginAdmin);
}

module.exports = registerAuthRoutes;