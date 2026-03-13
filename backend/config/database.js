const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message);
    console.warn('Server will start anyway. Start MongoDB or set MONGODB_URI to use storage.');
  }
};

module.exports = { connectDB };
