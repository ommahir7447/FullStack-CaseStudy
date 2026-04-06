const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://localhost:27017/student_course_registration';

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || DEFAULT_URI;

  if (!process.env.MONGO_URI) {
    console.warn(
      '⚠️  MONGO_URI not found in environment variables.\n' +
      '   Falling back to default: ' + DEFAULT_URI + '\n' +
      '   Create a backend/.env file (see backend/.env.example) to configure this.'
    );
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('   Make sure MongoDB is running and MONGO_URI is set correctly in backend/.env');
    process.exit(1);
  }
};

module.exports = connectDB;
