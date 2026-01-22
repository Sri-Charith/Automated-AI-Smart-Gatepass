require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('./models/Department');

async function fixDept() {
    await mongoose.connect(process.env.MONGO_URI);
    const dept = await Department.findOne({ deptId: 'CSE01' });
    if (dept) {
        console.log('Current Hash:', dept.password);
        // Resetting to 'department123' or whatever the user intended.
        // If the user wants to keep the same password, they need to re-type it.
        // Let's assume they want to use 'hod123' as a test or just know it's fixed.
        dept.password = 'hod123';
        await dept.save();
        console.log('✅ Password for CSE01 reset to hod123');
    } else {
        console.log('❌ Department CSE01 not found');
    }
    process.exit();
}

fixDept();
