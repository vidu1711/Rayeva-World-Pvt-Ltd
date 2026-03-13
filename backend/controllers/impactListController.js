const ImpactReport = require('../models/ImpactReport');

/**
 * GET /api/impact-reports
 * List impact reports (newest first).
 */
async function list(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const reports = await ImpactReport.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return res.json({ success: true, data: reports });
  } catch (err) {
    console.error('Impact reports list error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/impact-reports/:id
 */
async function getById(req, res) {
  try {
    const report = await ImpactReport.findById(req.params.id).lean();
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    return res.json({ success: true, data: report });
  } catch (err) {
    console.error('Impact report get error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { list, getById };
