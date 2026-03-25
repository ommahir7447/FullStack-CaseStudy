const express = require('express');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const protect = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/schedule/my
// @desc    Get schedule for all enrolled courses (protected)
router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.studentId })
      .populate('course');

    const schedule = [];
    enrollments.forEach(enrollment => {
      const course = enrollment.course;
      if (course && course.schedule && course.schedule.length > 0) {
        course.schedule.forEach(slot => {
          schedule.push({
            courseId: course._id,
            courseCode: course.code,
            courseTitle: course.title,
            instructor: course.instructor,
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            room: slot.room
          });
        });
      }
    });

    // Sort by day of week then by start time
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    schedule.sort((a, b) => {
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    res.json(schedule);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Server error fetching schedule' });
  }
});

// @route   POST /api/schedule/seed
// @desc    Seed schedule data into existing courses
router.post('/seed', async (req, res) => {
  try {
    const scheduleData = {
      'CS101': [
        { day: 'Monday', startTime: '09:00', endTime: '10:00', room: 'Room A101' },
        { day: 'Wednesday', startTime: '09:00', endTime: '10:00', room: 'Room A101' },
        { day: 'Friday', startTime: '09:00', endTime: '10:00', room: 'Lab 1' }
      ],
      'CS201': [
        { day: 'Monday', startTime: '10:00', endTime: '11:00', room: 'Room B201' },
        { day: 'Thursday', startTime: '10:00', endTime: '11:00', room: 'Room B201' }
      ],
      'CS202': [
        { day: 'Tuesday', startTime: '09:00', endTime: '10:00', room: 'Room C102' },
        { day: 'Thursday', startTime: '09:00', endTime: '10:00', room: 'Room C102' }
      ],
      'CS301': [
        { day: 'Tuesday', startTime: '11:00', endTime: '12:00', room: 'Room D301' },
        { day: 'Friday', startTime: '11:00', endTime: '12:00', room: 'Lab 3' }
      ],
      'CS302': [
        { day: 'Monday', startTime: '14:00', endTime: '15:30', room: 'Lab 2' },
        { day: 'Wednesday', startTime: '14:00', endTime: '15:30', room: 'Lab 2' }
      ],
      'CS303': [
        { day: 'Tuesday', startTime: '14:00', endTime: '15:00', room: 'Room A201' },
        { day: 'Thursday', startTime: '14:00', endTime: '15:00', room: 'Room A201' }
      ],
      'CS304': [
        { day: 'Wednesday', startTime: '10:00', endTime: '11:30', room: 'Room B102' },
        { day: 'Friday', startTime: '10:00', endTime: '11:30', room: 'Room B102' }
      ],
      'CS305': [
        { day: 'Monday', startTime: '11:00', endTime: '12:00', room: 'Room C201' },
        { day: 'Wednesday', startTime: '11:00', endTime: '12:00', room: 'Room C201' }
      ],
      'CS401': [
        { day: 'Tuesday', startTime: '10:00', endTime: '11:30', room: 'AI Lab' },
        { day: 'Thursday', startTime: '11:00', endTime: '12:30', room: 'AI Lab' }
      ],
      'CS402': [
        { day: 'Monday', startTime: '15:00', endTime: '16:00', room: 'Room D102' },
        { day: 'Wednesday', startTime: '15:00', endTime: '16:00', room: 'Room D102' }
      ],
      'CS403': [
        { day: 'Friday', startTime: '14:00', endTime: '15:30', room: 'Room A301' },
        { day: 'Saturday', startTime: '09:00', endTime: '10:30', room: 'Room A301' }
      ],
      'CS404': [
        { day: 'Tuesday', startTime: '15:00', endTime: '16:30', room: 'Cyber Lab' },
        { day: 'Thursday', startTime: '15:00', endTime: '16:30', room: 'Cyber Lab' }
      ],
      'CS501': [
        { day: 'Wednesday', startTime: '16:00', endTime: '17:30', room: 'Cloud Lab' },
        { day: 'Saturday', startTime: '11:00', endTime: '12:30', room: 'Cloud Lab' }
      ],
      'CS502': [
        { day: 'Monday', startTime: '16:00', endTime: '17:30', room: 'ML Lab' },
        { day: 'Thursday', startTime: '16:00', endTime: '17:30', room: 'ML Lab' }
      ],
      'IT201': [
        { day: 'Tuesday', startTime: '12:00', endTime: '13:00', room: 'Room B301' },
        { day: 'Friday', startTime: '12:00', endTime: '13:00', room: 'Room B301' }
      ],
      'IT301': [
        { day: 'Wednesday', startTime: '12:00', endTime: '13:30', room: 'Mobile Lab' },
        { day: 'Friday', startTime: '15:00', endTime: '16:30', room: 'Mobile Lab' }
      ],
      'IT302': [
        { day: 'Monday', startTime: '12:00', endTime: '13:00', room: 'Room C301' },
        { day: 'Thursday', startTime: '12:00', endTime: '13:00', room: 'Room C301' }
      ],
      'IT401': [
        { day: 'Saturday', startTime: '10:30', endTime: '12:00', room: 'IoT Lab' }
      ],
      'IT402': [
        { day: 'Saturday', startTime: '14:00', endTime: '15:30', room: 'Room D201' }
      ],
      'MATH201': [
        { day: 'Tuesday', startTime: '09:00', endTime: '10:00', room: 'Room A102' },
        { day: 'Thursday', startTime: '09:00', endTime: '10:00', room: 'Room A102' },
        { day: 'Saturday', startTime: '09:00', endTime: '10:00', room: 'Room A102' }
      ]
    };

    let updated = 0;
    for (const [code, schedule] of Object.entries(scheduleData)) {
      const result = await Course.findOneAndUpdate(
        { code },
        { schedule },
        { new: true }
      );
      if (result) updated++;
    }

    res.json({ message: `Schedule seeded for ${updated} courses` });
  } catch (error) {
    console.error('Schedule seed error:', error);
    res.status(500).json({ message: 'Server error seeding schedule' });
  }
});

module.exports = router;
