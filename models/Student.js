const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  branch: String,
  year: String,
  section: String,
  imageUrl: String,
  embedding: { type: [Number], default: [] },
  embeddingFacenet: { type: [Number], default: [] },

  // 🔐 PASSWORD – FIXED
  password: {
    type: String,
    required: true,
    set: v => v.trim() // ✅ removes hidden spaces/newlines
  }
});

// 🔐 HASH PASSWORD (ONLY HERE)
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 COMPARE PASSWORD
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword.trim(), this.password);
};

module.exports = mongoose.model('Student', studentSchema);
