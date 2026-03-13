const mongoose = require('mongoose');

const aiLogSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    module_name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AILog', aiLogSchema);
