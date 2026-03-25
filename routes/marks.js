const express = require('express');
const Marks = require('../models/Marks');
const Enrollment = require('../models/Enrollment');
const protect = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/marks/my
// @desc    Get all marks for the logged-in student (protected)
router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.studentId })
      .populate('course');

    const marksSummary = [];

    for (const enrollment of enrollments) {
      const course = enrollment.course;
      if (!course) continue;

      const marks = await Marks.find({
        student: req.studentId,
        course: course._id
      }).sort({ examType: 1 });

      const totalObtained = marks.reduce((sum, m) => sum + m.marksObtained, 0);
      const totalMax = marks.reduce((sum, m) => sum + m.totalMarks, 0);
      const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

      marksSummary.push({
        courseId: course._id,
        courseCode: course.code,
        courseTitle: course.title,
        instructor: course.instructor,
        marks: marks.map(m => ({
          _id: m._id,
          examType: m.examType,
          marksObtained: m.marksObtained,
          totalMarks: m.totalMarks,
          percentage: Math.round((m.marksObtained / m.totalMarks) * 100)
        })),
        totalObtained,
        totalMax,
        percentage
      });
    }

    res.json(marksSummary);
  } catch (error) {
    console.error('Get marks error:', error);
    res.status(500).json({ message: 'Server error fetching marks' });
  }
});

// @route   PUT /api/marks/:id
// @desc    Update marks (triggers real-time event)
router.put('/:id', protect, async (req, res) => {
  try {
    const { marksObtained } = req.body;

    const mark = await Marks.findById(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: 'Mark record not found' });
    }

    mark.marksObtained = marksObtained;
    mark.updatedAt = Date.now();
    await mark.save();

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.emit('marks-updated', {
        markId: mark._id,
        studentId: mark.student,
        courseId: mark.course,
        examType: mark.examType,
        marksObtained: mark.marksObtained,
        totalMarks: mark.totalMarks
      });
    }

    res.json({ message: 'Marks updated successfully', mark });
  } catch (error) {
    console.error('Update marks error:', error);
    res.status(500).json({ message: 'Server error updating marks' });
  }
});

// @route   POST /api/marks/seed
// @desc    Seed sample marks data for the logged-in student
router.post('/seed', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.studentId })
      .populate('course');

    if (enrollments.length === 0) {
      return res.status(400).json({ message: 'No enrollments found. Please enroll in courses first.' });
    }

    let seeded = 0;
    const examTypes = [
      { type: 'Quiz', total: 20 },
      { type: 'Assignment', total: 30 },
      { type: 'Mid-Term', total: 50 },
      { type: 'Final', total: 100 }
    ];

    for (const enrollment of enrollments) {
      const course = enrollment.course;
      if (!course) continue;

      for (const exam of examTypes) {
        const obtained = Math.floor(Math.random() * (exam.total * 0.4)) + Math.floor(exam.total * 0.5);

        try {
          await Marks.create({
            student: req.studentId,
            course: course._id,
            examType: exam.type,
            marksObtained: Math.min(obtained, exam.total),
            totalMarks: exam.total
          });
          seeded++;
        } catch (e) {
          // Skip duplicates
          if (e.code !== 11000) throw e;
        }
      }
    }

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.emit('marks-updated', { studentId: req.studentId, type: 'seed' });
    }

    res.status(201).json({ message: `Seeded ${seeded} marks records` });
  } catch (error) {
    console.error('Seed marks error:', error);
    res.status(500).json({ message: 'Server error seeding marks' });
  }
});

module.exports = router;
