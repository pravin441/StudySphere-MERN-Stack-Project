const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);

let db = null;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ MongoDB connected: ${dbName}`);
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected yet. Call connectDB() first.');
  }
  return db;
}

module.exports = { connectDB, getDB };