const mongoose = require('mongoose');

const AssessmentModel = require('./assessment');

const dailyReportSchema = new mongoose.Schema(
  {
    assessment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    system_recommendation: {
      type: String,
      trim: true,
    },
    results: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

dailyReportSchema.index({ assessment_id: 1 }, { unique: true });

module.exports = mongoose.model('DailyReport', dailyReportSchema);
