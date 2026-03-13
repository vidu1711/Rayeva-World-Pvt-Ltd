const { buildImpactStatementPrompt } = require('../prompts/impact');
const aiService = require('./aiService');
const { getMockImpactStatement } = require('../utils/mockAi');
const ImpactReport = require('../models/ImpactReport');

const PLASTIC_SAVED_PER_ITEM_GRAMS = 10;
const CARBON_AVOIDED_PER_ITEM_GRAMS = 25;

/**
 * Logic-based sustainability calculations from order_items.
 */
function computeImpact(order_items) {
  if (!order_items || !Array.isArray(order_items)) {
    throw new Error('order_items must be a non-empty array');
  }
  let totalQty = 0;
  const materials = new Set();
  for (const item of order_items) {
    const qty = Number(item.quantity) || 0;
    totalQty += qty;
    if (item.material) materials.add(item.material);
  }
  if (totalQty === 0) {
    throw new Error('Total quantity across order_items must be greater than 0');
  }
  const plastic_saved_grams = totalQty * PLASTIC_SAVED_PER_ITEM_GRAMS;
  const carbon_avoided_grams = totalQty * CARBON_AVOIDED_PER_ITEM_GRAMS;
  const local_sourcing_impact = materials.size > 0
    ? `Products use ${[...materials].join(', ')} materials.`
    : '';
  return {
    plastic_saved_grams,
    carbon_avoided_grams,
    plastic_saved: `${plastic_saved_grams}g`,
    carbon_avoided: `${carbon_avoided_grams}g`,
    local_sourcing_impact,
  };
}

/**
 * Generate impact report: compute metrics + AI impact statement, then persist.
 * @param {{ order_items: Array<{ product: string, quantity: number, material?: string }> }} input
 */
async function generateImpactReport(input) {
  const { order_items } = input;
  const computed = computeImpact(order_items);

  const prompt = buildImpactStatementPrompt({
    plastic_saved_grams: computed.plastic_saved_grams,
    carbon_avoided_grams: computed.carbon_avoided_grams,
  });
  let impact_statement;
  try {
    impact_statement = (await aiService.complete(prompt, 'impact')).trim();
  } catch (aiErr) {
    console.warn('Impact AI fallback:', aiErr.message);
    impact_statement = getMockImpactStatement(computed.plastic_saved_grams, computed.carbon_avoided_grams);
  }

  const doc = await ImpactReport.create({
    order_items,
    plastic_saved: computed.plastic_saved,
    carbon_avoided: computed.carbon_avoided,
    local_sourcing_impact: computed.local_sourcing_impact,
    impact_statement,
  });

  return {
    plastic_saved: computed.plastic_saved,
    carbon_avoided: computed.carbon_avoided,
    local_sourcing_impact: computed.local_sourcing_impact,
    impact_statement,
    id: doc._id,
  };
}

module.exports = { generateImpactReport, computeImpact };
