const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const gatepassRoutes = require('./routes/gatepassRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const guardRoutes = require('./routes/guardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');


const cors = require('cors');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    const originalUrl = req.url;
    // 🛡️ Remove hidden newlines (%0A, %0D) and trailing whitespace
    req.url = req.url.trim().replace(/%0A|%0D|\n|\r/g, '');

    if (originalUrl !== req.url) {
        console.log(`🧹 Cleaned URL: [${originalUrl}] -> [${req.url}]`);
    }
    console.log(`📡 ${req.method} ${req.url}`);
    next();
});
app.use('/uploads', express.static('uploads'));
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/gatepass', gatepassRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/guard', guardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
    console.log(`🚫 404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
console.log("✅ Guard routes loaded");