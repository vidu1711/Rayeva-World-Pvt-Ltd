require('dotenv').config();

const openaiKey = process.env.OPENAI_API_KEY;
const isGoogleKey = openaiKey && openaiKey.startsWith('AIzaSy');

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-systems',
  openaiApiKey: isGoogleKey ? null : openaiKey,
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || (isGoogleKey ? openaiKey : null),
};
