// const Guard = require('../models/Guard');
// const GatePassRequest = require('../models/GatePassRequest');

const Guard = require('../models/Guard');
const GatePassRequest = require('../models/GatePassRequest');

// ✅ Helper: Get current IST datetime
function getISTNow() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const [
    { value: month },,
    { value: day },,
    { value: year },,
    { value: hour },,
    { value: minute },,
    { value: second }
  ] = formatter.formatToParts(now);

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
}

// ✅ Main handler: Fetch today's requests between 9:30 AM and 5:30 PM IST
exports.getAllRequestsForGuard = async (req, res) => {
  try {
    const nowIST = getISTNow();

    const startIST = new Date(nowIST);
    startIST.setHours(9, 30, 0, 0);

    const endIST = new Date(nowIST);
    endIST.setHours(17, 30, 0, 0);

    console.log("⏰ IST Now      :", nowIST.toLocaleString('en-IN'));
    console.log("🕘 Start Bound :", startIST.toLocaleString('en-IN'));
    console.log("🕔 End Bound   :", endIST.toLocaleString('en-IN'));

    if (nowIST < startIST || nowIST > endIST) {
      console.log("⛔ Outside 9:30–5:30 IST, returning empty list");
      return res.status(200).json({ requests: [] });
    }

    const todayStr = nowIST.toISOString().split('T')[0]; // "YYYY-MM-DD"

    const requests = await GatePassRequest.find({
      status: 'Approved',
      leftAt: null,
      date: todayStr
    })
      .populate('student', 'studentId name branch year section imageUrl')
      .sort({ createdAt: -1 });

    console.log("✅ Requests fetched:", requests.length);
    res.status(200).json({ requests });
  } catch (error) {
    console.error('❌ Error in getAllRequestsForGuard:', error.message);
    res.status(500).json({ message: 'Error fetching requests for guard', error: error.message });
  }
};

// function getTodayInIST() {
//   const now = new Date();
//   // Shift to IST (+5:30 = 19800000 ms)
//   const istOffset = 5.5 * 60 * 60 * 1000;
//   const istDate = new Date(now.getTime() + istOffset);
//   return istDate.toISOString().split('T')[0];  // "YYYY-MM-DD"
// }

// exports.getAllRequestsForGuard = async (req, res) => {
//   try {
   
//     const now = new Date();
//     const todayStr = getTodayInIST();

//     const requests = await GatePassRequest.find({
//       status: 'Approved',
//       leftAt: null,
//       date: todayStr
//     })
//       .populate('student', 'studentId name branch year section imageUrl')
//       .sort({ createdAt: -1 });

//     console.log("Filtered Requests", requests.map(r => ({
//       date: r.date,
//       status: r.status,
//       leftAt: r.leftAt
//     })));

//     // console.log("Filtered Requests", requests.map(r => r.date));
//     res.status(200).json({ requests });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching requests for guard', error: error.message });
//   }
// };
//  function getTodayInIST() {
//   const now = new Date();
//   const istOffset = 5.5 * 60 * 60 * 1000;
//   const istDate = new Date(now.getTime() + istOffset);
//   return istDate;
// }

// exports.getAllRequestsForGuard = async (req, res) => {
//   try {
//     const nowIST = getTodayInIST();

//     const todayStr = nowIST.toISOString().split('T')[0];
//     const currentTime = nowIST.toTimeString().split(' ')[0].slice(0, 5); // "HH:MM"

//     // Create time boundaries for 09:30 and 17:30
//     const start = new Date(`${todayStr}T09:30:00`);
//     const end = new Date(`${todayStr}T17:30:00`);

//     console.log(`⏰ IST Now      : ${nowIST.toLocaleString()}`);
//     console.log(`🕘 Start Bound : ${start.toLocaleString()}`);
//     console.log(`🕔 End Bound   : ${end.toLocaleString()}`);

//     if (nowIST < start || nowIST > end) {
//       console.log("⛔ Outside 9:30–5:30 IST, returning empty list");
//       return res.status(200).json({ requests: [] });
//     }

//     const requests = await GatePassRequest.find({
//       status: 'Approved',
//       leftAt: null,
//       date: todayStr
//     })
//       .populate('student', 'studentId name branch year section imageUrl')
//       .sort({ createdAt: -1 });

//     console.log("✅ Fetched Requests:", requests.length);
//     res.status(200).json({ requests });

//   } catch (error) {
//     console.error("❌ Error in getAllRequestsForGuard:", error);
//     res.status(500).json({ message: 'Error fetching requests for guard', error: error.message });
//   }
// };
// function getISTDate() {
//   const nowUTC = new Date();
//   // IST offset = +5:30 (in milliseconds)
//   const istOffset = 5.5 * 60 * 60 * 1000;
//   return new Date(nowUTC.getTime() + istOffset);
// }
// exports.getAllRequestsForGuard = async (req, res) => {
//   try {
//     const nowIST = getISTDate();

//     const start = new Date(nowIST);
//     start.setHours(9, 30, 0, 0);

//     const end = new Date(nowIST);
//     end.setHours(17, 30, 0, 0);

//     console.log("⏰ IST Now      :", nowIST.toLocaleString('en-IN'));
//     console.log("🕘 Start Bound :", start.toLocaleString('en-IN'));
//     console.log("🕔 End Bound   :", end.toLocaleString('en-IN'));

//     if (nowIST < start || nowIST > end) {
//       console.log("⛔ Outside 9:30–5:30 IST, returning empty list");
//       return res.status(200).json({ requests: [] });
//     }

//     const todayStr = nowIST.toISOString().split('T')[0];

//     const requests = await GatePassRequest.find({
//       status: 'Approved',
//       leftAt: null,
//       date: todayStr
//     })
//       .populate('student', 'studentId name branch year section imageUrl')
//       .sort({ createdAt: -1 });

//     res.status(200).json({ requests });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching requests for guard', error: error.message });
//   }
// };
// function getISTNow() {
//   const now = new Date();
//   const formatter = new Intl.DateTimeFormat('en-US', {
//     timeZone: 'Asia/Kolkata',
//     hour12: false,
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit'
//   });

//   const [
//     { value: month },,
//     { value: day },,
//     { value: year },,
//     { value: hour },,
//     { value: minute },,
//     { value: second }
//   ] = formatter.formatToParts(now);

//   return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
// }

// exports.getAllRequestsForGuard = async (req, res) => {
//   try {
//     // 🕒 Get current time in IST
//     const nowUTC = new Date();
//     const istOffset = 5.5 * 60 * 60 * 1000;
//     const nowIST = new Date(nowUTC.getTime() + istOffset);

//     // 🕘 Start of window: Today 9:30 AM IST
//     const startIST = new Date(nowIST);
//     startIST.setHours(9, 30, 0, 0);

//     // 🕔 End of window: Today 5:30 PM IST
//     const endIST = new Date(nowIST);
//     endIST.setHours(17, 30, 0, 0);

//     console.log("⏰ IST Now      :", nowIST.toLocaleString('en-IN'));
//     console.log("🕘 Start Bound :", startIST.toLocaleString('en-IN'));
//     console.log("🕔 End Bound   :", endIST.toLocaleString('en-IN'));

//     if (nowIST < startIST || nowIST > endIST) {
//       console.log("⛔ Outside 9:30–5:30 IST, returning empty list");
//       return res.status(200).json({ requests: [] });
//     }

//     const todayStr = nowIST.toISOString().split('T')[0]; // "YYYY-MM-DD"

//     const requests = await GatePassRequest.find({
//       status: 'Approved',
//       leftAt: null,
//       date: todayStr
//     })
//       .populate('student', 'studentId name branch year section imageUrl')
//       .sort({ createdAt: -1 });

//     console.log("✅ Approved Requests for Guard:", requests.length);
//     res.status(200).json({ requests });
//   } catch (error) {
//     console.error("🔥 Error fetching guard requests:", error.message);
//     res.status(500).json({ message: 'Error fetching requests for guard', error: error.message });
//   }
// };

exports.deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await GatePassRequest.findByIdAndDelete(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request', error: error.message });
  }
};


exports.getGuardProfile = async (req, res) => {
  try {
    const guard = await Guard.findById(req.guard.id).select('-password');
    if (!guard) return res.status(404).json({ message: 'Guard not found' });
    res.status(200).json({ guard });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching guard profile', error: err.message });
  }
};

exports.markAsLeft = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await GatePassRequest.findById(requestId).populate('student');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.status !== 'Approved') {
      return res.status(400).json({ message: 'Only approved requests can be marked as left' });
    }

    request.status = 'Left Campus';
    request.leftAt = new Date();

    await request.save();
    // In your VSCode, add this line right before res.status(200).json


    res.status(200).json({
      message: `✅ Marked as Left Campus at ${request.leftAt.toLocaleString()}`,
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Error marking as left', error: error.message });
  }
};
