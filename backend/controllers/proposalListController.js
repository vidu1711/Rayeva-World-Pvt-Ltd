const Proposal = require('../models/Proposal');

/**
 * GET /api/proposals
 * List proposals (newest first).
 */
async function list(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const proposals = await Proposal.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return res.json({ success: true, data: proposals });
  } catch (err) {
    console.error('Proposals list error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { list };
