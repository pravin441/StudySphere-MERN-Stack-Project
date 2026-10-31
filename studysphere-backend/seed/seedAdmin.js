const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedAdmin() {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const admins = db.collection('admins');

    const existingAdmin = await admins.findOne({ email: 'admin@studysphere.edu' });
    if (existingAdmin) {
      console.log('Admin already exists. Skipping seed.');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin1234', 10);

    await admins.insertOne({
      name: 'Admin User',
      email: 'admin@studysphere.edu',
      password: hashedPassword,
      createdAt: new Date(),
    });

    console.log('Admin account created!');
    console.log('Email: admin@studysphere.edu');
    console.log('Password: admin1234');
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await client.close();
  }
}

seedAdmin();