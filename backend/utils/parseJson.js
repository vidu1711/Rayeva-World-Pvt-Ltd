/**
 * Safely parse JSON from AI response (may be wrapped in markdown code blocks).
 */
function parseJsonFromResponse(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid response: empty or non-string');
  }
  let cleaned = text.trim();
  // Remove markdown code block if present
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Invalid JSON in AI response: ${e.message}`);
  }
}

module.exports = { parseJsonFromResponse };
