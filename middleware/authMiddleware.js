// // middleware/authMiddleware.js

// const jwt = require('jsonwebtoken');

// const aunthenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];

//   // The token should come like: "Bearer <token>"
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role === 'student') req.student = decoded;
//     else if (decoded.role === 'department') req.department = decoded;
//     else if (decoded.role === 'guard') req.guard = decoded;

//      // now req.student has student info from token
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired token." });
//   }
// };

// module.exports = aunthenticateToken;



// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('🔑 Authenticating token...');
  console.log('👉 JWT_SECRET status:', process.env.JWT_SECRET ? 'Exists' : 'MISSING');

  // Expect: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No Bearer token found in header');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  let token = authHeader.split(' ')[1];

  // 🛡️ Extra robust cleaning: Remove ALL leading/trailing double quotes
  if (token) {
    token = token.trim().replace(/^"+|"+$/g, '');
  }

  console.log('👉 Final Token length:', token?.length);
  console.log('👉 Final Token start:', token?.substring(0, 10) + '...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully for role:', decoded.role);

    // 🔥 Universal user object
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    // 🔥 Role-specific shortcuts (optional)
    if (decoded.role === 'student') req.student = req.user;
    if (decoded.role === 'department') req.department = req.user;
    if (decoded.role === 'guard') req.guard = req.user;
    if (decoded.role === 'admin') req.admin = req.user;

    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.name, '-', err.message);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;
