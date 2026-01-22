const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

dotenv.config();
connectDB();

async function createAdmin() {
  try {
    await Admin.create({
      adminId: 'admin1',
      name: 'Super Admin',
      password: 'admin123'
    });

    console.log('✅ Admin created successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
