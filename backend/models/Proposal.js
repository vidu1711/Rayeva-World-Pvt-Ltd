const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
  {
    event_type: { type: String, required: true },
    budget: { type: Number, required: true },
    sustainability_goal: { type: String, required: true },
    generated_proposal: {
      suggested_product_mix: Array,
      budget_allocation: mongoose.Schema.Types.Mixed,
      estimated_cost_breakdown: mongoose.Schema.Types.Mixed,
      impact_summary: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Proposal', proposalSchema);
