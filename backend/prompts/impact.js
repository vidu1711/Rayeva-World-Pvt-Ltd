/**
 * Prompt for AI Impact Statement (Module 3)
 */
function buildImpactStatementPrompt({ plastic_saved_grams, carbon_avoided_grams }) {
  return `You are a sustainability impact analyst.

Given calculated environmental impact values, generate a short human-readable sustainability impact statement (2-4 sentences) explaining the environmental benefit.

Input:
- Plastic saved: ${plastic_saved_grams} grams
- Carbon avoided: ${carbon_avoided_grams} grams

Return ONLY the impact statement text. No JSON, no quotes, no labels—just the statement.`;
}

module.exports = { buildImpactStatementPrompt };
