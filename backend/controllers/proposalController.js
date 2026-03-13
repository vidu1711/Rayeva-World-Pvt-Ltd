const proposalService = require('../services/proposalService');
const { validateProposalBody } = require('../utils/validators');

/**
 * POST /api/proposal/generate
 * Body: { event_type, budget, sustainability_goal }
 */
async function generate(req, res) {
  try {
    const validation = validateProposalBody(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    const result = await proposalService.generateProposal(validation.normalized);
    return res.status(200).json({
      success: true,
      data: {
        id: result.id,
        proposal: result.proposal,
      },
    });
  } catch (err) {
    console.error('Proposal generate error:', err);
    let status = 500;
    if (err.status === 429 || err.code === 'insufficient_quota') {
      status = 429;
    } else if (err.message.includes('OPENAI')) {
      status = 503;
    } else if (err.message.includes('exceeds budget') || err.message.includes('Invalid JSON')) {
      status = 400;
    }
    const message = status === 429
      ? 'OpenAI quota exceeded. Add billing or credits at platform.openai.com.'
      : (err.message || 'Failed to generate proposal');
    return res.status(status).json({ success: false, error: message });
  }
}

module.exports = { generate };
