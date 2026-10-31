const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { parseRequestBody } = require('../utils/requestHelpers');
const { parseMultipartForm } = require('../utils/fileUploadHelper');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

// POST /api/submissions — student submits a file for an assignment
async function createSubmission(req, res) {
  const contentType = req.headers['content-type'] || '';

  if (!contentType.startsWith('multipart/form-data')) {
    return sendError(res, 'Expected multipart/form-data with a file.', 400);
  }

  const { fields, file } = await parseMultipartForm(req);
  const { assignmentId, studentId, studentName, assignmentTitle, subject, comment } = fields;

  if (!assignmentId || !studentName || !assignmentTitle || !file) {
    return sendError(res, 'Assignment ID, student name, assignment title, and file are required.', 400);
  }

  const db = getDB();
  const submissions = db.collection('submissions');

  const newSubmission = {
    assignmentId,
    studentId: studentId || null,
    studentName,
    assignmentTitle,
    subject: subject || '',
    fileName: file.originalName,
    filePath: file.path,
    comment: comment || '',
    submittedOn: new Date().toISOString().split('T')[0],
    status: 'Pending Review',
    grade: null,
    createdAt: new Date(),
  };

  const result = await submissions.insertOne(newSubmission);

  // Increment the assignment's submission count for the admin dashboard
  if (ObjectId.isValid(assignmentId)) {
    await db.collection('assignments').updateOne(
      { _id: new ObjectId(assignmentId) },
      { $inc: { submissionsCount: 1 } }
    );
  }

  sendSuccess(res, {
    message: 'Assignment submitted successfully.',
    submission: { _id: result.insertedId, ...newSubmission },
  }, 201);
}

// GET /api/submissions — list all, optional ?studentId= and ?status= filters
async function getSubmissions(req, res) {
  const db = getDB();
  const submissions = db.collection('submissions');

  const { studentId, status } = req.query;
  const filter = {};

  if (studentId) filter.studentId = studentId;
  if (status && status !== 'All') filter.status = status;

  const results = await submissions.find(filter).sort({ createdAt: -1 }).toArray();
  sendSuccess(res, { submissions: results });
}

// GET /api/submissions/:id — get one submission
async function getSubmissionById(req, res) {
  const db = getDB();
  const submissions = db.collection('submissions');
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return sendError(res, 'Invalid submission ID.', 400);
  }

  const submission = await submissions.findOne({ _id: new ObjectId(id) });

  if (!submission) {
    return sendError(res, 'Submission not found.', 404);
  }

  sendSuccess(res, { submission });
}

// PUT /api/submissions/:id/grade — admin grades a submission
async function gradeSubmission(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return sendError(res, 'Invalid submission ID.', 400);
  }

  const body = await parseRequestBody(req);
  const { grade } = body;

  if (!grade) {
    return sendError(res, 'Grade is required.', 400);
  }

  const db = getDB();
  const submissions = db.collection('submissions');

  const result = await submissions.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { grade, status: 'Graded' } },
    { returnDocument: 'after' }
  );

  if (!result) {
    return sendError(res, 'Submission not found.', 404);
  }

  sendSuccess(res, { message: 'Submission graded successfully.', submission: result });
}

module.exports = { createSubmission, getSubmissions, getSubmissionById, gradeSubmission };