const OpenAI = require('openai');
const config = require('../config');
const AILog = require('../models/AILog');

const openai = config.openaiApiKey
  ? new OpenAI({ apiKey: config.openaiApiKey })
  : null;

/**
 * Call OpenAI API and log prompt/response.
 * @param {string} userMessage - The prompt to send
 * @param {string} moduleName - e.g. 'proposal' or 'impact'
 * @returns {Promise<string>} - Raw response content
 */
async function complete(userMessage, moduleName) {
  if (!openai) {
    throw new Error('OPENAI_API_KEY is not set in environment');
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: userMessage }],
    temperature: 0.4,
  });

  const content = response.choices[0]?.message?.content?.trim() || '';

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
