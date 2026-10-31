// Sets CORS headers so the React frontend (localhost:5173) is allowed
// to make requests to this backend (localhost:5000) — browsers block
// cross-origin requests by default unless the server explicitly allows it.

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // For a college project, allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = { setCorsHeaders };