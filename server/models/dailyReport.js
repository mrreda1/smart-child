const mongoose = require('mongoose');

const AssessmentModel = require('./assessment');

const dailyReportSchema = new mongoose.Schema({
  assessment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  system_recommendation: {
    type: String,
    trim: true,
  },
  daily_score_category: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair'],
    required: true,
  },
  generated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DailyReport', dailyReportSchema);
