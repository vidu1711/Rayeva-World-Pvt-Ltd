const impactService = require('../services/impactService');
const { validateImpactBody } = require('../utils/validators');

/**
 * POST /api/impact/generate
 * Body: { order_items: [{ product, quantity, material? }] }
 */
async function generate(req, res) {
  try {
    const validation = validateImpactBody(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    const result = await impactService.generateImpactReport(validation.normalized);
    return res.status(200).json({
      success: true,
      data: {
        id: result.id,
        plastic_saved: result.plastic_saved,
        carbon_avoided: result.carbon_avoided,
        local_sourcing_impact: result.local_sourcing_impact,
        impact_statement: result.impact_statement,
      },
    });
  } catch (err) {
    console.error('Impact generate error:', err);
    let status = 500;
    if (err.status === 429 || err.code === 'insufficient_quota') {
      status = 429;
    } else if (err.message.includes('OPENAI')) {
      status = 503;
    }
    const message = status === 429
      ? 'OpenAI quota exceeded. Add billing or credits at platform.openai.com.'
      : (err.message || 'Failed to generate impact report');
    return res.status(status).json({ success: false, error: message });
  }
}

module.exports = { generate };
