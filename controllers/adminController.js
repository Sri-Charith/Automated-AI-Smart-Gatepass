const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('../utils/cloudinary');
const Student = require('../models/Student');
const Department = require('../models/Department');
const Guard = require('../models/Guard');
const Admin = require('../models/Admin'); // You need to create this model
const { extractEmbedding } = require('../utils/embeddingUtil'); // Utility for embedding

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// 🔐 Admin Login
// exports.adminLogin = async (req, res) => {
//     const { adminId, password } = req.body;
//     try {
//         const admin = await Admin.findOne({ adminId });
//         if (!admin || !(await admin.matchPassword(password))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//         user = await Student.findOne({ studentId: id });
//         if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//         isMatch = await user.matchPassword(password);
//         if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' }); F

//         const token = generateToken({ id: admin._id, role: 'admin' });
//         return res.status(200).json({ message: 'Login successful', token, admin });
//     } catch (err) {
//         return res.status(500).json({ message: 'Server error', error: err.message });
//     }
// };
// exports.adminLogins = async (req, res) => {
//     const { adminId, password } = req.body;
//     try {
//       const user = await Admin.findOne({ adminId }); // 🔍 Use 'user' for consistency
//       if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//       const isMatch = await user.matchPassword(password);
//       if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//       const token = generateToken({ id: user._id, role: 'admin' });
//       return res.status(200).json({ message: 'Login successful', token, admin: user });
//     } catch (err) {
//       return res.status(500).json({ message: 'Server error', error: err.message });
//     }
//   };
exports.adminLogin = async (req, res) => {
    const { adminId, password } = req.body;
    console.log("📝 Incoming Login Request:", { adminId, password });

    try {
        const user = await Admin.findOne({ adminId });
        console.log("🔍 Found Admin in DB:", user);

        if (!user) {
            console.log("❌ Admin ID not found!");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        console.log("🔑 Password Match Result:", isMatch);

        if (!isMatch) {
            console.log("❌ Password did not match!");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken({ id: user._id, role: 'admin' });
        console.log("✅ Token generated successfully");

        return res.status(200).json({ message: 'Login successful', token, admin: user });

    } catch (err) {
        console.error("🔥 Server error during admin login:", err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// 👤 Add Student
exports.addStudent = async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    try {
        const { studentId, name, year, branch, section, password } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'Photo is required' });

        const uploadRes = await cloudinary.uploader.upload(file.path);
        const imageUrl = uploadRes.secure_url;

        // const hashedPassword = await bcrypt.hash(password, 10);
        const embedding = await extractEmbedding(imageUrl); // VGG or FaceNet depending on utility

        const newStudent = new Student({
            studentId,
            name,
            year,
            branch,
            section,
            imageUrl,
            password,   // Pass plain password; Student model will hash it
            embedding: embedding  // or embedding
        });



        await newStudent.save();
        res.status(201).json({ message: 'Student added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add student', error: err.message });
    }
};

// 🧑‍🏫 Add Department
exports.addDepartment = async (req, res) => {
    try {
        const { deptId, name, password } = req.body;
        // const hashedPassword = await bcrypt.hash(password, 10);

        const newDept = new Department({ deptId, name, password });
        await newDept.save();
        res.status(201).json({ message: 'Department added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add department', error: err.message });
    }
};

// 🛡 Add Guard
exports.addGuard = async (req, res) => {
    try {
        const { guardId, name, password } = req.body;
        // const hashedPassword = await bcrypt.hash(password, 10);

        const newGuard = new Guard({ guardId, name, password });
        await newGuard.save();
        res.status(201).json({ message: 'Guard added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add guard', error: err.message });
    }
};
