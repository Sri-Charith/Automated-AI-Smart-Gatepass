const GatePassRequest = require('../models/GatePassRequest');
const Student = require('../models/Student');
require('dotenv').config();

const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 📌 Send gate pass request
exports.sendGatePassRequest = async (req, res) => {
  try {
    const { reason, date, time } = req.body;

    const studentId = req.student?.id || req.user?.id;
    if (!studentId) {
      return res.status(401).json({ message: 'Unauthorized. Student ID missing.' });
    }

    // Check for existing pending request
    const existingRequest = await GatePassRequest.findOne({
      student: studentId,
      status: 'Pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request.' });
    }

    // Create new request
    const request = new GatePassRequest({
      student: studentId,
      reason,
      date,
      time
    });

    await request.save();

    // Fetch student details for notification
    const student = await Student.findById(studentId);

    // Send notifications (Twilio)
    try {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        await client.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: process.env.HOD_WHATSAPP_TO,
          body: `📢 New Gatepass Request\nStudent: ${student.name}\nID: ${student.studentId}\nDate: ${date}\nTime: ${time}\nReason: ${reason}`
        });

        await client.messages.create({
          from: process.env.TWILIO_SMS_FROM,
          to: process.env.HOD_SMS_TO,
          body: `New Gatepass from ${student.name} (${student.studentId}) at ${time} on ${date}`
        });
      } else {
        console.log('ℹ️ Twilio credentials missing, skipping notifications.');
      }
    } catch (twilioErr) {
      console.error("Optionally skipping Twilio:", twilioErr.message);
    }

    res.status(201).json({ message: 'Gate pass request sent successfully', request });
  } catch (error) {
    console.error('🔥 SendGatePass Error:', error);
    res.status(500).json({ message: 'Error sending request', error: error.message });
  }
};

// 📌 View student request status
exports.viewStatus = async (req, res) => {
  try {
    const studentId = req.student?.id || req.user?.id;
    if (!studentId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const requests = await GatePassRequest.find({ student: studentId })
      .populate('student', 'studentId name branch year section imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request status', error: error.message });
  }
};

// 📌 Delete student's request
exports.deleteRequest = async (req, res) => {
  try {
    const studentId = req.student?.id || req.user?.id;
    const requestId = req.params.id;

    const request = await GatePassRequest.findOne({ _id: requestId, student: studentId });

    if (!request) {
      return res.status(404).json({ message: 'Request not found or unauthorized' });
    }

    await GatePassRequest.findByIdAndDelete(requestId);
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request', error: error.message });
  }
};
