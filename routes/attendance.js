const express = require('express');
const Attendance = require('../models/Attendance');
const Enrollment = require('../models/Enrollment');
const protect = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/attendance/my
// @desc    Get attendance summary for all enrolled courses (protected)
router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.studentId })
      .populate('course');

    const attendanceSummary = [];

    for (const enrollment of enrollments) {
      const course = enrollment.course;
      if (!course) continue;

      const records = await Attendance.find({
        student: req.studentId,
        course: course._id
      }).sort({ date: -1 });

      const total = records.length;
      const present = records.filter(r => r.status === 'Present').length;
      const late = records.filter(r => r.status === 'Late').length;
      const absent = records.filter(r => r.status === 'Absent').length;
      const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

      attendanceSummary.push({
        courseId: course._id,
        courseCode: course.code,
        courseTitle: course.title,
        instructor: course.instructor,
        total,
        present,
        late,
        absent,
        percentage,
        records: records.map(r => ({
          date: r.date,
          status: r.status
        }))
      });
    }

    res.json(attendanceSummary);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error fetching attendance' });
  }
});

// @route   GET /api/attendance/my/:courseId
// @desc    Get attendance for a specific course (protected)
router.get('/my/:courseId', protect, async (req, res) => {
  try {
    const records = await Attendance.find({
      student: req.studentId,
      course: req.params.courseId
    }).sort({ date: -1 });

    res.json(records);
  } catch (error) {
    console.error('Get course attendance error:', error);
    res.status(500).json({ message: 'Server error fetching attendance' });
  }
});

// @route   POST /api/attendance
// @desc    Mark attendance (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { courseId, date, status } = req.body;

    const attendance = await Attendance.create({
      student: req.studentId,
      course: courseId,
      date: new Date(date),
      status: status || 'Present'
    });

    // Emit real-time event if socket.io is available
    const io = req.app.get('io');
    if (io) {
      io.emit('attendance-updated', {
        studentId: req.studentId,
        courseId,
        date,
        status
      });
    }

    res.status(201).json({ message: 'Attendance marked', attendance });
  } catch (error) {
    console.error('Mark attendance error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }
    res.status(500).json({ message: 'Server error marking attendance' });
  }
});

// @route   POST /api/attendance/seed
// @desc    Seed sample attendance data for the logged-in student
router.post('/seed', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.studentId })
      .populate('course');

    if (enrollments.length === 0) {
      return res.status(400).json({ message: 'No enrollments found. Please enroll in courses first.' });
    }

    let seeded = 0;
    const statuses = ['Present', 'Present', 'Present', 'Present', 'Late', 'Absent'];

    for (const enrollment of enrollments) {
      const course = enrollment.course;
      if (!course) continue;

      // Generate 20 days of attendance data
      for (let i = 0; i < 20; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 2 + 1)); // Every other day going back
        date.setHours(0, 0, 0, 0);

        const status = statuses[Math.floor(Math.random() * statuses.length)];

        try {
          await Attendance.create({
            student: req.studentId,
            course: course._id,
            date,
            status
          });
          seeded++;
        } catch (e) {
          // Skip duplicates
          if (e.code !== 11000) throw e;
        }
      }
    }

    res.status(201).json({ message: `Seeded ${seeded} attendance records` });
  } catch (error) {
    console.error('Seed attendance error:', error);
    res.status(500).json({ message: 'Server error seeding attendance' });
  }
});

module.exports = router;
