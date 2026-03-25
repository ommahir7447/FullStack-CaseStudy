const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
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
  examType: {
    type: String,
    enum: ['Quiz', 'Mid-Term', 'Final', 'Assignment'],
    required: true
  },
  marksObtained: {
    type: Number,
    required: true,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 1
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate marks for same student-course-examType
marksSchema.index({ student: 1, course: 1, examType: 1 }, { unique: true });

module.exports = mongoose.model('Marks', marksSchema);
