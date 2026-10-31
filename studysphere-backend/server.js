const http = require('http');
const { connectDB } = require('./config/db');
const { setCorsHeaders } = require('./utils/corsHelper');
const { sendError, sendSuccess } = require('./utils/responseHelpers');
const Router = require('./utils/router');
const registerAuthRoutes = require('./routes/authRoutes');
const registerNoteRoutes = require('./routes/noteRoutes');
const registerAssignmentRoutes = require('./routes/assignmentRoutes');
const registerSubmissionRoutes = require('./routes/submissionRoutes');
const registerStudentRoutes = require('./routes/studentRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const router = new Router();

router.get('/', (req, res) => {
  sendSuccess(res, { message: 'StudySphere backend is running.' });
});

registerAuthRoutes(router);
registerNoteRoutes(router);
registerAssignmentRoutes(router);
registerSubmissionRoutes(router);
registerStudentRoutes(router);

async function startServer() {
  await connectDB();

  const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

       const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    // Serve uploaded files directly (e.g. /uploads/171234-file.pdf)
    if (parsedUrl.pathname.startsWith('/uploads/')) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, parsedUrl.pathname);

      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        res.end(fileBuffer);
      } else {
        sendError(res, 'File not found', 404);
      }
      return;
    }

    const match = router.match(req.method, parsedUrl.pathname);

    if (!match) {
      sendError(res, 'Route not found', 404);
      return;
    }

    try {
      req.params = match.params;
      req.query = Object.fromEntries(parsedUrl.searchParams);
      await match.handler(req, res);
    } catch (error) {
      console.error('Server error:', error);
      sendError(res, 'Internal server error', 500);
    }
  });

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();