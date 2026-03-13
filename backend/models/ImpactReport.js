const mongoose = require('mongoose');

const impactReportSchema = new mongoose.Schema(
  {
    order_items: [
      {
        product: String,
        quantity: Number,
        material: String,
      },
    ],
    plastic_saved: { type: String, required: true },
    carbon_avoided: { type: String, required: true },
    local_sourcing_impact: { type: String, default: '' },
    impact_statement: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ImpactReport', impactReportSchema);
