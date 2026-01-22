require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await Admin.findOne({ adminId: 'admin01' });
    if (existing) {
      console.log('⚠️ Admin already exists');
      process.exit();
    }

    await Admin.create({
      adminId: 'admin01',
      name: 'Main Admin',
      password: 'admin123'
    });

    console.log('✅ Admin created');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
};

createAdmin();
