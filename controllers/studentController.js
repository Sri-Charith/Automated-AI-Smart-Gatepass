const fs = require('fs');
const csv = require('csv-parser');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { spawnSync } = require('child_process');

/* =========================================================
   📥 UPLOAD STUDENTS FROM CSV (NO DOUBLE HASHING)
   ========================================================= */
const uploadStudents = async (req, res) => {
  const results = [];

  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required' });
  }

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const student of results) {

          // 🔹 Run Python embedding script
          const process = spawnSync(
            'python',
            ['face-verification/extract_embedding_single.py', student.imageUrl],
            { encoding: 'utf-8' }
          );

          if (process.error) {
            console.error('Python error:', process.error);
            continue;
          }

          if (!process.stdout || process.stdout.trim() === '') {
            console.error(`❌ No embedding for ${student.studentId}`);
            continue;
          }

          const parsed = JSON.parse(process.stdout);

          // 🔹 Create student (password stays PLAIN here)
          const newStudent = new Student({
            studentId: student.studentId,
            name: student.name,
            branch: student.branch,
            year: student.year,
            section: student.section,
            imageUrl: student.imageUrl,
            password: student.password,   // ✅ schema hashes ONCE
            embedding: parsed.embedding || []
          });

          await newStudent.save();
        }

        res.status(200).json({
          message: 'Students uploaded successfully'
        });

      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Upload failed',
          error: error.message
        });
      }
    });
};

/* =========================================================
   🔐 STUDENT LOGIN (FIXED & RELIABLE)
   ========================================================= */
const loginStudent = async (req, res) => {
  try {
    console.log('================ LOGIN DEBUG START ================');
    console.log('👉 Request Body:', req.body);

    const { studentId, password } = req.body;

    if (!studentId || !password) {
      console.log('❌ Missing studentId or password');
      return res.status(400).json({
        message: 'studentId and password are required'
      });
    }

    // 1️⃣ Find student
    const student = await Student.findOne({ studentId });

    console.log('👉 Student fetched from DB:', student);

    if (!student) {
      console.log('❌ No student found with studentId:', studentId);
      return res.status(401).json({
        message: 'Invalid studentId or password'
      });
    }

    console.log('👉 Password in request (plain):', password);
    console.log('👉 Password in DB (hashed):', student.password);
    console.log('👉 Hashed password length:', student.password.length);

    // 2️⃣ Compare password
    const isMatch = await student.matchPassword(password);

    console.log('👉 Password match result:', isMatch);

    if (!isMatch) {
      console.log('❌ Password comparison failed');
      return res.status(401).json({
        message: 'Invalid studentId or password'
      });
    }

    // 3️⃣ JWT
    const token = jwt.sign(
      {
        id: student._id,
        studentId: student.studentId,
        role: 'student'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('✅ Login successful for:', student.studentId);
    console.log('================ LOGIN DEBUG END ==================');

    res.status(200).json({
      message: 'Login successful',
      token
    });

  } catch (error) {
    console.error('🔥 LOGIN ERROR:', error);
    res.status(500).json({
      message: 'Student login failed',
      error: error.message
    });
  }
};


/* =========================================================
   📊 STUDENT DASHBOARD
   ========================================================= */
const getDashboard = async (req, res) => {
  try {
    const student = await Student
      .findById(req.student.id)
      .select('-password');

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    res.status(200).json({ student });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch dashboard',
      error: error.message
    });
  }
};

module.exports = {
  uploadStudents,
  loginStudent,
  getDashboard
};
