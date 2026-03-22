const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const protect = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/enrollments
// @desc    Enroll in a course (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.studentId;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check capacity
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ message: 'Course is full, no seats available' });
    }

    // Check for duplicate enrollment
    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId
    });

    // Increment enrolled count on the course
    course.enrolled += 1;
    await course.save();

    // Populate course details for the response
    await enrollment.populate('course');

    res.status(201).json({
      message: `Successfully enrolled in ${course.title}`,
      enrollment
    });
  } catch (error) {
    console.error('Enroll error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }
    res.status(500).json({ message: 'Server error during enrollment' });
  }
});

// @route   GET /api/enrollments/my
// @desc    Get current student's enrollments (protected)
router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.studentId })
      .populate('course')
      .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ message: 'Server error fetching enrollments' });
  }
});

// @route   DELETE /api/enrollments/:id
// @desc    Drop/unenroll from a course (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Ensure the enrollment belongs to the logged-in student
    if (enrollment.student.toString() !== req.studentId) {
      return res.status(403).json({ message: 'Not authorized to drop this enrollment' });
    }

    // Decrement enrolled count on the course
    const course = await Course.findById(enrollment.course);
    if (course && course.enrolled > 0) {
      course.enrolled -= 1;
      await course.save();
    }

    await Enrollment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Successfully dropped the course' });
  } catch (error) {
    console.error('Drop error:', error);
    res.status(500).json({ message: 'Server error dropping enrollment' });
  }
});

module.exports = router;
