const config = require('../config');
const AILog = require('../models/AILog');

let openai = null;
let geminiModel = null;

if (config.openaiApiKey && config.openaiApiKey.startsWith('sk-')) {
  const OpenAI = require('openai');
  openai = new OpenAI({ apiKey: config.openaiApiKey });
} else if (config.geminiApiKey) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

/**
 * Call AI API (Gemini or OpenAI) and log prompt/response.
 * Prefers Gemini if GEMINI_API_KEY (or GOOGLE_API_KEY) is set; otherwise uses OPENAI_API_KEY.
 * @param {string} userMessage - The prompt to send
 * @param {string} moduleName - e.g. 'proposal' or 'impact'
 * @returns {Promise<string>} - Raw response content
 */
async function complete(userMessage, moduleName) {
  let content = '';

  if (geminiModel) {
    const result = await geminiModel.generateContent(userMessage);
    const response = result.response;
    if (!response || !response.text) {
      throw new Error('Gemini returned no text');
    }
    content = response.text().trim();
  } else if (openai) {
    const temperature = moduleName === 'proposal' ? 0.8 : 0.4;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: userMessage }],
      temperature,
    });
    content = response.choices[0]?.message?.content?.trim() || '';
  } else {
    throw new Error(
      'No AI provider configured. Set GEMINI_API_KEY (Google Gemini) or OPENAI_API_KEY (OpenAI) in .env'
    );
  }

  try {
    await AILog.create({
      prompt: userMessage,
      response: content,
      module_name: moduleName,
    });
  } catch (logErr) {
    console.error('Failed to log AI request:', logErr.message);
  }

  return content;
}

module.exports = { complete };
