const mongoose = require('mongoose');

const AssessmentModel = require('./assessment');
const TestModel = require('./test');

const assessmentTestSchema = new mongoose.Schema({
  assessment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  isCompleted: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
    required: true,
  },
  rawData: {
    type: mongoose.Schema.Types.Mixed,
  },
  results: {
    metrics: {
      type: mongoose.Schema.Types.Mixed,
    },

    difficultyAction: {
      type: String,
      enum: ['level_down', 'maintain', 'level_up'],
    },
  },

  starsEarned: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
});

assessmentTestSchema.index({ assessment_id: 1, test_id: 1 }, { unique: true });

assessmentTestSchema.pre(/^find/, function (next) {
  this.populate({ path: 'test_id' });
  next();
});

assessmentTestSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.test = ret.test_id;

    delete ret.test_id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('AssessmentTest', assessmentTestSchema);
