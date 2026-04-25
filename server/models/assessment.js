const mongoose = require('mongoose');

const ChildModel = require('./child');

const assessmentSchema = new mongoose.Schema(
  {
    child_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress'],
      required: true,
      default: 'in-progress',
    },
    active_in: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Assessment', assessmentSchema);
