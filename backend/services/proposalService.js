const { buildProposalPrompt } = require('../prompts/proposal');
const aiService = require('./aiService');
const { parseJsonFromResponse } = require('../utils/parseJson');
const { getMockProposal } = require('../utils/mockAi');
const Proposal = require('../models/Proposal');

/**
 * Validate and normalize proposal JSON from AI.
 * Ensure total does not exceed budget.
 */
function validateProposalOutput(parsed, maxBudget) {
  if (!parsed.suggested_product_mix || !Array.isArray(parsed.suggested_product_mix)) {
    throw new Error('Proposal must include suggested_product_mix array');
  }
  let total = 0;
  for (const item of parsed.suggested_product_mix) {
    const cost = item.estimated_cost;
    if (cost === undefined || cost === null) continue;
    const num = typeof cost === 'string' ? parseFloat(cost.replace(/[^0-9.]/g, '')) : Number(cost);
    if (!Number.isNaN(num)) total += num;
  }
  if (total > maxBudget) {
    throw new Error(`Proposal total (${total}) exceeds budget (${maxBudget})`);
  }
  return {
    suggested_product_mix: parsed.suggested_product_mix,
    budget_allocation: parsed.budget_allocation || {},
    estimated_cost_breakdown: parsed.estimated_cost_breakdown || {},
    impact_summary: typeof parsed.impact_summary === 'string' ? parsed.impact_summary : '',
  };
}

/**
 * Generate B2B proposal and persist.
 * @param {{ event_type: string, budget: number, sustainability_goal: string }} input
 */
async function generateProposal(input) {
  const { event_type, budget, sustainability_goal } = input;
  const prompt = buildProposalPrompt({ event_type, budget, sustainability_goal });

  let generated_proposal;
  try {
    const rawResponse = await aiService.complete(prompt, 'proposal');
    const parsed = parseJsonFromResponse(rawResponse);
    generated_proposal = validateProposalOutput(parsed, budget);
  } catch (aiErr) {
    console.warn('Proposal AI fallback:', aiErr.message);
    const mock = getMockProposal({ event_type, budget, sustainability_goal });
    generated_proposal = validateProposalOutput(mock, budget);
  }

  const doc = await Proposal.create({
    event_type,
    budget,
    sustainability_goal,
    generated_proposal,
  });

  return { proposal: generated_proposal, id: doc._id };
}

module.exports = { generateProposal, validateProposalOutput };
