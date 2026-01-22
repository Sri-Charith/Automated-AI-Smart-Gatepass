const express = require('express');
const router = express.Router();

const {
  sendGatePassRequest,
  viewStatus,
  deleteRequest
} = require('../controllers/gatepassController');

const authenticateToken = require('../middleware/authMiddleware');

// 🔐 Student-only middleware
const studentOnly = (req, res, next) => {
  console.log('🛡️ StudentOnly check:', {
    hasUser: !!req.user,
    role: req.user?.role
  });
  if (!req.user || req.user.role !== 'student') {
    console.log('❌ Access denied. Role is not student.');
    return res.status(403).json({ message: 'Access denied. Students only.' });
  }
  next();
};

// 📌 Student Gatepass APIs
router.post('/request', authenticateToken, studentOnly, sendGatePassRequest);
router.get('/status', authenticateToken, studentOnly, viewStatus);
router.delete('/delete/:id', authenticateToken, studentOnly, deleteRequest);

module.exports = router;
