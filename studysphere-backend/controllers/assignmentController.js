const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { parseRequestBody } = require('../utils/requestHelpers');
const { parseMultipartForm } = require('../utils/fileUploadHelper');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

async function getAssignments(req, res) {
  const db = getDB();
  const assignments = db.collection('assignments');

  const { status } = req.query;
  const filter = {};

  if (status && status !== 'All') {
    filter.status = status;
  }

  const results = await assignments.find(filter).sort({ dueDate: 1 }).toArray();
  sendSuccess(res, { assignments: results });
}

async function getAssignmentById(req, res) {
  const db = getDB();
  const assignments = db.collection('assignments');
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return sendError(res, 'Invalid assignment ID.', 400);
  }

  const assignment = await assignments.findOne({ _id: new ObjectId(id) });

  if (!assignment) {
    return sendError(res, 'Assignment not found.', 404);
  }

  sendSuccess(res, { assignment });
}

// POST /api/assignments — create, with an OPTIONAL attached reference file
async function createAssignment(req, res) {
  const contentType = req.headers['content-type'] || '';

  let fields, file;

  if (contentType.startsWith('multipart/form-data')) {
    const parsed = await parseMultipartForm(req);
    fields = parsed.fields;
    file = parsed.file;
  } else {
    fields = await parseRequestBody(req);
    file = null;
  }

  const { title, subject, description, instructions, dueDate } = fields;

  if (!title || !subject || !dueDate) {
    return sendError(res, 'Title, subject, and due date are required.', 400);
  }

  const db = getDB();
  const assignments = db.collection('assignments');

  const newAssignment = {
    title,
    subject,
    description: description || '',
    instructions: instructions || '',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate,
    status: 'Active',
    submissionsCount: 0,
    fileName: file ? file.originalName : null,
    filePath: file ? file.path : null,
    createdAt: new Date(),
  };

  const result = await assignments.insertOne(newAssignment);

  sendSuccess(res, {
    message: 'Assignment created successfully.',
    assignment: { _id: result.insertedId, ...newAssignment },
  }, 201);
}

async function updateAssignment(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return sendError(res, 'Invalid assignment ID.', 400);
  }

  const body = await parseRequestBody(req);
  const db = getDB();
  const assignments = db.collection('assignments');

  const result = await assignments.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: body },
    { returnDocument: 'after' }
  );

  if (!result) {
    return sendError(res, 'Assignment not found.', 404);
  }

  sendSuccess(res, { message: 'Assignment updated successfully.', assignment: result });
}

async function deleteAssignment(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return sendError(res, 'Invalid assignment ID.', 400);
  }

  const db = getDB();
  const assignments = db.collection('assignments');

  const result = await assignments.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return sendError(res, 'Assignment not found.', 404);
  }

  sendSuccess(res, { message: 'Assignment deleted successfully.' });
}

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};