const { getDB } = require('../config/db');
const { parseRequestBody } = require('../utils/requestHelpers');
const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

// STUDENT REGISTER
async function registerStudent(req, res) {
  const body = await parseRequestBody(req);
  const { fullName, email, password } = body;

  if (!fullName || !email || !password) {
    return sendError(res, 'Full name, email, and password are required.', 400);
  }

  const db = getDB();
  const students = db.collection('students');

  const existingStudent = await students.findOne({ email });
  if (existingStudent) {
    return sendError(res, 'An account with this email already exists.', 409);
  }

  const hashedPassword = await hashPassword(password);

  const newStudent = {
    fullName,
    email,
    password: hashedPassword,
    phone: '',
    course: '',
    studentId: `STU${Date.now().toString().slice(-6)}`, // simple mock-style ID generation
    joinedOn: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
  };

  const result = await students.insertOne(newStudent);

  const token = generateToken({ id: result.insertedId, role: 'student', email });

  sendSuccess(res, {
    message: 'Registration successful.',
    token,
    user: {
      id: result.insertedId,
      fullName,
      email,
      studentId: newStudent.studentId,
    },
  }, 201);
}

// STUDENT LOGIN
async function loginStudent(req, res) {
  const body = await parseRequestBody(req);
  const { email, password } = body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required.', 400);
  }

  const db = getDB();
  const students = db.collection('students');

  const student = await students.findOne({ email });
  if (!student) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const passwordMatches = await comparePassword(password, student.password);
  if (!passwordMatches) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const token = generateToken({ id: student._id, role: 'student', email: student.email });

  sendSuccess(res, {
    message: 'Login successful.',
    token,
    user: {
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      studentId: student.studentId,
    },
  });
}

// ADMIN LOGIN
// Note: for a college project, admin accounts are typically pre-seeded
// directly in the database rather than self-registered. We'll add a
// seed step later; for now this just checks credentials against the
// "admins" collection.
async function loginAdmin(req, res) {
  const body = await parseRequestBody(req);
  const { email, password } = body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required.', 400);
  }

  const db = getDB();
  const admins = db.collection('admins');

  const admin = await admins.findOne({ email });
  if (!admin) {
    return sendError(res, 'Invalid admin email or password.', 401);
  }

  const passwordMatches = await comparePassword(password, admin.password);
  if (!passwordMatches) {
    return sendError(res, 'Invalid admin email or password.', 401);
  }

  const token = generateToken({ id: admin._id, role: 'admin', email: admin.email });

  sendSuccess(res, {
    message: 'Admin login successful.',
    token,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  });
}

module.exports = { registerStudent, loginStudent, loginAdmin };