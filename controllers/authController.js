const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Department = require('../models/Department');
const Guard = require('../models/Guard');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const login = async (req, res) => {
  const { role, id, password } = req.body;

  try {
    if (!role || !id || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    let user;
    let isMatch;
    let tokenPayload;

    if (role === 'student') {
      user = await Student.findOne({ studentId: id });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      tokenPayload = { studentId: user.studentId, id: user._id, role: 'student' };
      return res.status(200).json({ message: 'Login successful', token: generateToken(tokenPayload), user });

    } else if (role === 'department') {
      user = await Department.findOne({ deptId: id });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      tokenPayload = { deptId: user.deptId, id: user._id, role: 'department' };
      return res.status(200).json({ message: 'Login successful', token: generateToken(tokenPayload), user });

    } else if (role === 'guard') {
      user = await Guard.findOne({ guardId: id });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      tokenPayload = { guardId: user.guardId, id: user._id, role: 'guard' };
      return res.status(200).json({ message: 'Login successful', token: generateToken(tokenPayload), user });

    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };
