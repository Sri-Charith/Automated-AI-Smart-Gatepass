const express = require('express');
const router = express.Router();
const {
  sendGatePassRequest,
  viewStatus,
  deleteRequest
} = require('../controllers/gatepassController');
const authenticateToken = require('../middleware/authMiddleware'); // only students should use these routes
const aunthenticateToken = require('../middleware/authMiddleware');

// Student gatepass APIs
router.post('/request', aunthenticateToken, sendGatePassRequest);
router.get('/status', authenticateToken, viewStatus);
router.delete('/delete/:id', aunthenticateToken, deleteRequest);

module.exports = router;
