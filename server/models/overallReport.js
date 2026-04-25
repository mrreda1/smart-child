const mongoose = require('mongoose');

const ChildModel = require('./child');

const overallReportSchema = new mongoose.Schema({
  child_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
    unique: true,
  },
  system_recommendation: {
    type: String,
    trim: true,
  },
  overall_growth_percentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  overall_feeling: {
    type: String,
    enum: ['Happy', 'Sad', 'Angry', 'Fear'],
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

overallReportSchema.pre('save', function (next) {
  this.last_updated = Date.now();
  next();
});

module.exports = mongoose.model('OverallReport', overallReportSchema);
