const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { parseRequestBody } = require('../utils/requestHelpers');
const { parseMultipartForm } = require('../utils/fileUploadHelper');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

// GET /api/notes — list all notes, optional ?subject= and ?search= filters
async function getNotes(req, res) {
  const db = getDB();
  const notes = db.collection('notes');

  const { subject, search } = req.query;
  const filter = {};

  if (subject && subject !== 'All') {
    filter.subject = subject;
  }

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const results = await notes.find(filter).sort({ uploadedOn: -1 }).toArray();
  sendSuccess(res, { notes: results });
}

// GET /api/notes/:id — get one note by ID
async function getNoteById(req, res) {
  const db = getDB();
  const notes = db.collection('notes');
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return sendError(res, 'Invalid note ID.', 400);
  }

  const note = await notes.findOne({ _id: new ObjectId(id) });

  if (!note) {
    return sendError(res, 'Note not found.', 404);
  }

  sendSuccess(res, { note });
}

// POST /api/notes — create a new note WITH a real uploaded file
async function createNote(req, res) {
  const contentType = req.headers['content-type'] || '';

  if (!contentType.startsWith('multipart/form-data')) {
    return sendError(res, 'Expected multipart/form-data with a file.', 400);
  }

  const { fields, file } = await parseMultipartForm(req);
  const { title, subject, description, fileType } = fields;

  if (!title || !subject || !fileType || !file) {
    return sendError(res, 'Title, subject, file type, and a file are required.', 400);
  }

  const db = getDB();
  const notes = db.collection('notes');

  const newNote = {
    title,
    subject,
    description: description || '',
    fileType,
    fileName: file.originalName,
    filePath: file.path, // e.g. /uploads/171234-xyz.pdf
    uploadedOn: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
  };

  const result = await notes.insertOne(newNote);

  sendSuccess(res, {
    message: 'Note created successfully.',
    note: { _id: result.insertedId, ...newNote },
  }, 201);
}

// PUT /api/notes/:id — update an existing note (text fields only, no file change)
async function updateNote(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return sendError(res, 'Invalid note ID.', 400);
  }

  const body = await parseRequestBody(req);
  const db = getDB();
  const notes = db.collection('notes');

  const result = await notes.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: body },
    { returnDocument: 'after' }
  );

  if (!result) {
    return sendError(res, 'Note not found.', 404);
  }

  sendSuccess(res, { message: 'Note updated successfully.', note: result });
}

// DELETE /api/notes/:id — delete a note
async function deleteNote(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return sendError(res, 'Invalid note ID.', 400);
  }

  const db = getDB();
  const notes = db.collection('notes');

  const result = await notes.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return sendError(res, 'Note not found.', 404);
  }

  sendSuccess(res, { message: 'Note deleted successfully.' });
}

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote };