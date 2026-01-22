const express = require('express');
const router = express.Router();
console.log('✅ Auth routes loaded');
const { login } = require('../controllers/authController');

router.post('/login', login); // Common login for all roles

module.exports = router;
