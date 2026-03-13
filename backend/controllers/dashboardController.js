const Proposal = require('../models/Proposal');
const ImpactReport = require('../models/ImpactReport');

/**
 * GET /api/dashboard/stats
 * Returns counts and aggregated impact for dashboard cards.
 */
async function getStats(req, res) {
  try {
    const [proposalCount, impactCount, proposals, impactReports, allReports] = await Promise.all([
      Proposal.countDocuments(),
      ImpactReport.countDocuments(),
      Proposal.find().sort({ createdAt: -1 }).limit(5).lean(),
      ImpactReport.find().sort({ createdAt: -1 }).limit(10).lean(),
      ImpactReport.find().select('plastic_saved carbon_avoided').lean(),
    ]);

    let totalPlasticGrams = 0;
    let totalCarbonGrams = 0;
    for (const r of allReports) {
      const p = parseInt(String(r.plastic_saved).replace(/\D/g, ''), 10) || 0;
      const c = parseInt(String(r.carbon_avoided).replace(/\D/g, ''), 10) || 0;
      totalPlasticGrams += p;
      totalCarbonGrams += c;
    }

    const totalPlasticKg = (totalPlasticGrams / 1000).toFixed(1);
    const totalCarbonKg = (totalCarbonGrams / 1000).toFixed(1);

    return res.json({
      success: true,
      data: {
        proposalCount,
        impactReportCount: impactCount,
        totalPlasticSavedKg: totalPlasticKg,
        totalCarbonAvoidedKg: totalCarbonKg,
        recentProposals: proposals,
        recentImpactReports: impactReports.slice(0, 10),
      },
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { getStats };
