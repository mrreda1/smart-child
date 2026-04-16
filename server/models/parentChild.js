const mongoose = require('mongoose');
const { Schema } = mongoose;

const parentChildSchema = new Schema({
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: 'Parent',
    required: true,
  },
  child_id: {
    type: Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  is_owner: {
    type: Boolean,
    required: true,
    default: false,
  },
});

parentChildSchema.index({ parent_id: 1, child_id: 1 }, { unique: true });

const ParentChild = mongoose.model('ParentChild', parentChildSchema);

module.exports = ParentChild;
