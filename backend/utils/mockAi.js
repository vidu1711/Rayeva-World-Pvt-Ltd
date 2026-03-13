/**
 * Fallback mock data when AI provider fails (quota, 404, etc.) so the app still works for demos.
 * Product mix varies by event_type and sustainability_goal so different proposals look different.
 */

const PRODUCT_MIXES = [
  // Conference / events
  [
    { product_name: 'Reusable bamboo cutlery set', quantity: '100', estimated_cost: '$' },
    { product_name: 'Recycled paper notebooks', quantity: '150', estimated_cost: '$' },
    { product_name: 'Eco-friendly tote bags', quantity: '80', estimated_cost: '$' },
    { product_name: 'Plant-based beverage cups', quantity: '200', estimated_cost: '$' },
  ],
  // Office
  [
    { product_name: 'Bamboo desk organizers', quantity: '50', estimated_cost: '$' },
    { product_name: 'Recycled printer paper (reams)', quantity: '40', estimated_cost: '$' },
    { product_name: 'Refillable whiteboard markers', quantity: '100', estimated_cost: '$' },
    { product_name: 'Compostable coffee pods', quantity: '200', estimated_cost: '$' },
  ],
  // Retail / packaging
  [
    { product_name: 'Kraft paper shopping bags', quantity: '500', estimated_cost: '$' },
    { product_name: 'Recycled cardboard boxes', quantity: '200', estimated_cost: '$' },
    { product_name: 'Biodegradable packing peanuts', quantity: '50', estimated_cost: '$' },
    { product_name: 'Paper tape dispenser rolls', quantity: '30', estimated_cost: '$' },
  ],
  // Hospitality / catering
  [
    { product_name: 'Compostable plates and bowls', quantity: '300', estimated_cost: '$' },
    { product_name: 'Wooden cutlery set', quantity: '300', estimated_cost: '$' },
    { product_name: 'Paper straws (box)', quantity: '20', estimated_cost: '$' },
    { product_name: 'Reusable glass bottles', quantity: '100', estimated_cost: '$' },
  ],
  // Plastic-free focus
  [
    { product_name: 'Bamboo toothbrush (bulk)', quantity: '200', estimated_cost: '$' },
    { product_name: 'Metal straw set', quantity: '150', estimated_cost: '$' },
    { product_name: 'Cotton produce bags', quantity: '100', estimated_cost: '$' },
    { product_name: 'Glass food containers', quantity: '80', estimated_cost: '$' },
  ],
  // School / education (reduce plastic waste)
  [
    { product_name: 'Recycled paper notebooks and binders', quantity: '200', estimated_cost: '$' },
    { product_name: 'Plant-based pens and pencils (bulk)', quantity: '500', estimated_cost: '$' },
    { product_name: 'Reusable lunch containers (BPA-free)', quantity: '150', estimated_cost: '$' },
    { product_name: 'Bamboo rulers and eco craft supplies', quantity: '100', estimated_cost: '$' },
  ],
  // Healthcare
  [
    { product_name: 'Compostable medical-grade gloves (bulk)', quantity: '500', estimated_cost: '$' },
    { product_name: 'Recycled paper patient charts and folders', quantity: '200', estimated_cost: '$' },
    { product_name: 'Bamboo / wooden tongue depressors', quantity: '300', estimated_cost: '$' },
    { product_name: 'Eco-friendly sanitizer and cleaning supplies', quantity: '80', estimated_cost: '$' },
  ],
  // Recycled / general
  [
    { product_name: 'Recycled polyester uniforms', quantity: '30', estimated_cost: '$' },
    { product_name: 'Recycled plastic signage', quantity: '15', estimated_cost: '$' },
    { product_name: 'Eco-friendly cleaning supplies', quantity: '25', estimated_cost: '$' },
    { product_name: 'Recycled notepads', quantity: '120', estimated_cost: '$' },
  ],
];

function pickMixIndex(event_type, sustainability_goal) {
  const et = (event_type || '').toLowerCase();
  const sg = (sustainability_goal || '').toLowerCase();
  if (et.includes('school') || et.includes('education') || et.includes('campus')) return 5;
  if (et.includes('healthcare') || et.includes('hospital') || et.includes('medical')) return 6;
  if (et.includes('office') || (et.includes('corporate') && sg.includes('office'))) return 1;
  if (et.includes('retail') || sg.includes('packaging')) return 2;
  if (et.includes('hospitality') || et.includes('catering') || et.includes('conference')) return 3;
  if (sg.includes('plastic') || sg.includes('plastic free')) return 4;
  if (sg.includes('recycled') || sg.includes('recycle')) return 7;
  if (sg.includes('compostable')) return 3;
  return 0;
}

function getMockProposal({ event_type, budget, sustainability_goal }) {
  const pct = Math.min(90, Math.floor(budget / 50));
  const mixIndex = pickMixIndex(event_type, sustainability_goal);
  const template = PRODUCT_MIXES[mixIndex];
  const shares = [0.28, 0.22, 0.25, 0.25];
  const suggested_product_mix = template.map((item, i) => ({
    ...item,
    estimated_cost: `$${Math.max(1, Math.floor(budget * shares[i]))}`,
  }));
  return {
    suggested_product_mix,
    budget_allocation: { products: `${pct}%`, contingency: `${100 - pct}%` },
    estimated_cost_breakdown: { products: budget, contingency: 0 },
    impact_summary: `Sustainable product mix for ${event_type} (budget $${budget}), aligned with: ${sustainability_goal}. [Demo fallback – set GEMINI_API_KEY or OPENAI_API_KEY for live AI.]`,
  };
}

function getMockImpactStatement(plastic_saved_grams, carbon_avoided_grams) {
  return `By choosing sustainable alternatives, this order avoided an estimated ${plastic_saved_grams}g of plastic and ${carbon_avoided_grams}g CO₂ equivalent—supporting waste reduction and lower carbon footprint. [Demo fallback – add API credits for live AI.]`;
}

module.exports = { getMockProposal, getMockImpactStatement };
