const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a course code'],
    unique: true,
    trim: true,
    uppercase: true
  },
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  instructor: {
    type: String,
    required: [true, 'Please add an instructor name'],
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Please add credits'],
    min: 1,
    max: 6
  },
  capacity: {
    type: Number,
    required: true,
    default: 40
  },
  enrolled: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
