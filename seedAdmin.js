// // seedAdmin.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const Admin = require('./models/Admin');

// const MONGO_URI = 'mongodb+srv://admin:securepassword123@cluster0.gynkk.mongodb.net/gatepassDB?retryWrites=true&w=majority&appName=Cluster0';

// async function seedAdmin() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log('Connected to MongoDB');

//     const existing = await Admin.findOne({ adminId: 'admin001' });
//     if (existing) {
//       console.log('ℹ Admin already exists');
//     } else {
//       const hashedPassword = await bcrypt.hash('admin123', 10);
//       await Admin.create({
//         adminId: 'admin001',
//         password: hashedPassword,
//         name: 'Master Admin'
//       });
//       console.log('✅ Admin created');
//     }

//     mongoose.connection.close();
//   } catch (err) {
//     console.error('❌ Error seeding admin:', err.message);
//   }
// }

// seedAdmin();
// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const MONGO_URI = 'mongodb+srv://admin:securepassword123@cluster0.gynkk.mongodb.net/gatepassDB?retryWrites=true&w=majority&appName=Cluster0'; // from .env

const createAdmin = async () => {
  await mongoose.connect(MONGO_URI);

  const existing = await Admin.findOne({ adminId: 'admin01' });
  if (existing) {
    console.log('⚠️ Admin already exists');
    process.exit();
  }

//   const hashedPassword = await bcrypt.hash('admin123', 10);
  await Admin.create({
    adminId: 'admin01',
    name: 'Main Admin',
    password: 'admin123'
  });

  console.log('✅ Admin created');
  process.exit();
};

createAdmin();
