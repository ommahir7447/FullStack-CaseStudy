const express = require('express');
const Course = require('../models/Course');
const protect = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ code: 1 });
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get a single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error fetching course' });
  }
});

// @route   POST /api/courses/seed
// @desc    Seed the database with sample courses
router.post('/seed', async (req, res) => {
  try {
    const count = await Course.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Courses already seeded', count });
    }

    const sampleCourses = [
      {
        code: 'CS101',
        title: 'Introduction to Computer Science',
        description: 'Foundational concepts of computer science including algorithms, data structures, and computational thinking.',
        instructor: 'Dr. Alan Turing',
        credits: 4,
        capacity: 60,
        enrolled: 0
      },
      {
        code: 'CS201',
        title: 'Data Structures & Algorithms',
        description: 'In-depth study of data structures (trees, graphs, hash tables) and algorithm design techniques.',
        instructor: 'Dr. Ada Lovelace',
        credits: 4,
        capacity: 45,
        enrolled: 0
      },
      {
        code: 'CS301',
        title: 'Database Management Systems',
        description: 'Relational databases, SQL, normalization, indexing, and NoSQL database concepts.',
        instructor: 'Dr. Edgar Codd',
        credits: 3,
        capacity: 50,
        enrolled: 0
      },
      {
        code: 'CS302',
        title: 'Web Development',
        description: 'Full-stack web development with HTML, CSS, JavaScript, Node.js, and modern frameworks.',
        instructor: 'Prof. Tim Berners-Lee',
        credits: 4,
        capacity: 40,
        enrolled: 0
      },
      {
        code: 'CS401',
        title: 'Artificial Intelligence',
        description: 'Search algorithms, machine learning fundamentals, neural networks, and natural language processing.',
        instructor: 'Dr. Geoffrey Hinton',
        credits: 4,
        capacity: 35,
        enrolled: 0
      },
      {
        code: 'CS402',
        title: 'Operating Systems',
        description: 'Process management, memory management, file systems, and concurrency control.',
        instructor: 'Dr. Linus Torvalds',
        credits: 3,
        capacity: 45,
        enrolled: 0
      },
      {
        code: 'MATH201',
        title: 'Discrete Mathematics',
        description: 'Logic, sets, relations, functions, graph theory, and combinatorics for computer science.',
        instructor: 'Dr. Euclid',
        credits: 3,
        capacity: 55,
        enrolled: 0
      },
      {
        code: 'CS501',
        title: 'Cloud Computing',
        description: 'Cloud architecture, virtualization, containers, microservices, and deployment strategies.',
        instructor: 'Prof. Werner Vogels',
        credits: 3,
        capacity: 30,
        enrolled: 0
      }
    ];

    await Course.insertMany(sampleCourses);
    res.status(201).json({ message: 'Courses seeded successfully', count: sampleCourses.length });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Server error seeding courses' });
  }
});

module.exports = router;
