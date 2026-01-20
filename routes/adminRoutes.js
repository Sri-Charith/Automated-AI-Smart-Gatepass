const express = require('express');
const router = express.Router();
const { adminLogin, addStudent, addDepartment, addGuard } = require('../controllers/adminController');

// Admin login route
router.post('/login', adminLogin);
router.post('/add-student', addStudent);
router.post('/add-department', addDepartment);
router.post('/add-guard', addGuard);

module.exports = router;
