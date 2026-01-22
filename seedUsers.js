require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Department = require('./models/Department');
const Guard = require('./models/Guard');

// Use MONGO_URI from .env
const MONGO_URI = process.env.MONGO_URI;

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if HOD already exists
    const existingDept = await Department.findOne({ deptId: 'hod001' });
    if (!existingDept) {
      await Department.create({
        deptId: 'hod001',
        password: 'hod123',
        name: 'HOD of CSE',
      });
      console.log('✅ HOD created');
    } else {
      console.log('ℹ️ HOD already exists');
    }

    // Check if Guard already exists
    const existingGuard = await Guard.findOne({ guardId: 'guard001' });
    if (!existingGuard) {
      await Guard.create({
        guardId: 'guard001',
        password: 'guard123',
        name: 'Main Gate Guard',
      });
      console.log('✅ Guard created');
    } else {
      console.log('ℹ️ Guard already exists');
    }

    mongoose.connection.close();
    console.log('🚪 Connection closed');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

seedUsers();
