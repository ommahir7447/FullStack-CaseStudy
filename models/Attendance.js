const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    required: true,
    default: 'Present'
  },
  markedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate attendance for same student-course-date
attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
