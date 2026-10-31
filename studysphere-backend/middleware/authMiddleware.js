// Verifies the JWT token sent in the Authorization header.
// Since we're not using Express, this isn't "middleware" in the
// traditional sense — it's a wrapper function that checks auth
// BEFORE calling the real route handler.

const { verifyToken } = require('../utils/auth');
const { sendError } = require('../utils/responseHelpers');

// Wraps a handler so it only runs if a valid token is present.
// Usage: requireAuth(myHandler)
function requireAuth(handler) {
  return async (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided. Please log in.', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      req.user = decoded; // { id, role, email }
      return handler(req, res);
    } catch (error) {
      return sendError(res, 'Invalid or expired token. Please log in again.', 401);
    }
  };
}

// Wraps a handler so it only runs if the token belongs to an admin.
// Usage: requireAdmin(myHandler)
function requireAdmin(handler) {
  return requireAuth(async (req, res) => {
    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied. Admins only.', 403);
    }
    return handler(req, res);
  });
}

module.exports = { requireAuth, requireAdmin };