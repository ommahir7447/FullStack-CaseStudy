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
        code: 'CS202',
        title: 'Object Oriented Programming',
        description: 'OOP principles: encapsulation, inheritance, polymorphism, and abstraction using Java and C++.',
        instructor: 'Dr. James Gosling',
        credits: 4,
        capacity: 50,
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
        code: 'CS303',
        title: 'Computer Networks',
        description: 'Network architectures, TCP/IP, routing protocols, network security, and wireless networks.',
        instructor: 'Dr. Vint Cerf',
        credits: 3,
        capacity: 45,
        enrolled: 0
      },
      {
        code: 'CS304',
        title: 'Software Engineering',
        description: 'Software development lifecycle, agile methodologies, design patterns, testing, and project management.',
        instructor: 'Prof. Frederick Brooks',
        credits: 4,
        capacity: 40,
        enrolled: 0
      },
      {
        code: 'CS305',
        title: 'Compiler Design',
        description: 'Lexical analysis, parsing, syntax-directed translation, code generation, and optimization techniques.',
        instructor: 'Dr. Alfred Aho',
        credits: 3,
        capacity: 35,
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
        code: 'CS403',
        title: 'Theory of Computation',
        description: 'Automata theory, formal languages, Turing machines, computability, and complexity classes.',
        instructor: 'Dr. Michael Sipser',
        credits: 3,
        capacity: 40,
        enrolled: 0
      },
      {
        code: 'CS404',
        title: 'Cybersecurity Fundamentals',
        description: 'Cryptography, network security, ethical hacking, vulnerability assessment, and security protocols.',
        instructor: 'Prof. Bruce Schneier',
        credits: 3,
        capacity: 35,
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
      },
      {
        code: 'CS502',
        title: 'Machine Learning',
        description: 'Supervised and unsupervised learning, deep learning, model evaluation, and real-world applications.',
        instructor: 'Dr. Andrew Ng',
        credits: 4,
        capacity: 35,
        enrolled: 0
      },
      {
        code: 'IT201',
        title: 'Information Systems',
        description: 'Information system concepts, ERP, CRM, business intelligence, and IT governance.',
        instructor: 'Prof. Peter Drucker',
        credits: 3,
        capacity: 50,
        enrolled: 0
      },
      {
        code: 'IT301',
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile development with React Native, Flutter, and mobile UX design.',
        instructor: 'Dr. Andy Rubin',
        credits: 4,
        capacity: 35,
        enrolled: 0
      },
      {
        code: 'IT302',
        title: 'Data Mining & Warehousing',
        description: 'Data preprocessing, association rules, clustering, classification, and data warehouse architecture.',
        instructor: 'Dr. Jiawei Han',
        credits: 3,
        capacity: 40,
        enrolled: 0
      },
      {
        code: 'IT401',
        title: 'Internet of Things (IoT)',
        description: 'IoT architecture, sensors, embedded systems, communication protocols, and smart applications.',
        instructor: 'Prof. Kevin Ashton',
        credits: 3,
        capacity: 30,
        enrolled: 0
      },
      {
        code: 'IT402',
        title: 'Blockchain Technology',
        description: 'Distributed ledger technology, consensus algorithms, smart contracts, and cryptocurrency fundamentals.',
        instructor: 'Dr. Vitalik Buterin',
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
