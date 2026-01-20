const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Department = require('./models/Department');
const Guard = require('./models/Guard');

// Replace this with your MongoDB connection string
const MONGO_URI = 'mongodb+srv://admin:securepassword123@cluster0.gynkk.mongodb.net/gatepassDB?retryWrites=true&w=majority&appName=Cluster0';

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if HOD already exists
    const existingDept = await Department.findOne({ deptId: 'hod001' });
    if (!existingDept) {
      const hashedPassword = await bcrypt.hash('hod123', 10);
      await Department.create({
        deptId: 'hod001',
        password: hashedPassword,
        name: 'HOD of CSE',
      });
      console.log('✅ HOD created');
    } else {
      console.log('ℹ️ HOD already exists');
    }

    // Check if Guard already exists
    const existingGuard = await Guard.findOne({ guardId: 'guard001' });
    if (!existingGuard) {
      const hashedPassword = await bcrypt.hash('guard123', 10);
      await Guard.create({
        guardId: 'guard001',
        password: hashedPassword,
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
