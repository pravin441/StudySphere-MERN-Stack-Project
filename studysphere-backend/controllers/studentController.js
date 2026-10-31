const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { parseRequestBody } = require('../utils/requestHelpers');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

// GET /api/students — list all students, optional ?search= by name/email
async function getStudents(req, res) {
  const db = getDB();
  const students = db.collection('students');

  const { search } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Exclude password field from the response for security
  const results = await students
    .find(filter, { projection: { password: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  sendSuccess(res, { students: results });
}

// GET /api/students/:id — get one student's profile
async function getStudentById(req, res) {
  const db = getDB();
  const students = db.collection('students');
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return sendError(res, 'Invalid student ID.', 400);
  }

  const student = await students.findOne(
    { _id: new ObjectId(id) },
    { projection: { password: 0 } }
  );

  if (!student) {
    return sendError(res, 'Student not found.', 404);
  }

  sendSuccess(res, { student });
}

// PUT /api/students/:id — update a student's profile
// Used by both the student's own Profile page and admin Edit actions.
async function updateStudent(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return sendError(res, 'Invalid student ID.', 400);
  }

  const body = await parseRequestBody(req);

  // Never allow password or _id to be overwritten through this route
  delete body.password;
  delete body._id;

  const db = getDB();
  const students = db.collection('students');

  const result = await students.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: body },
    { returnDocument: 'after', projection: { password: 0 } }
  );

  if (!result) {
    return sendError(res, 'Student not found.', 404);
  }

  sendSuccess(res, { message: 'Student updated successfully.', student: result });
}

// DELETE /api/students/:id — remove a student account (admin only)
async function deleteStudent(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return sendError(res, 'Invalid student ID.', 400);
  }

  const db = getDB();
  const students = db.collection('students');

  const result = await students.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return sendError(res, 'Student not found.', 404);
  }

  sendSuccess(res, { message: 'Student removed successfully.' });
}

module.exports = { getStudents, getStudentById, updateStudent, deleteStudent };