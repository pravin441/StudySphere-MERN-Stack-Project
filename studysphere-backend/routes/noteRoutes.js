const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const { requireAdmin } = require('../middleware/authMiddleware');

function registerNoteRoutes(router) {
  // Anyone (logged in or not) can VIEW notes — students need this to browse.
  router.get('/api/notes', getNotes);
  router.get('/api/notes/:id', getNoteById);

  // Only admins can create, update, or delete notes.
  router.post('/api/notes', requireAdmin(createNote));
  router.put('/api/notes/:id', requireAdmin(updateNote));
  router.delete('/api/notes/:id', requireAdmin(deleteNote));
}

module.exports = registerNoteRoutes;