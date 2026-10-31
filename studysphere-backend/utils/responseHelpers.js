// Small helpers to send consistent JSON responses from any route handler,
// instead of repeating res.writeHead / res.end everywhere.

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function sendSuccess(res, data, statusCode = 200) {
  sendJSON(res, statusCode, { success: true, ...data });
}

function sendError(res, message, statusCode = 400) {
  sendJSON(res, statusCode, { success: false, message });
}

module.exports = { sendJSON, sendSuccess, sendError };