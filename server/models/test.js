const mongoose = require('mongoose');

const CategoryModel = require('./category');
const TestDescModel = require('./testDesc');

const testSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
});

testSchema.set('toObject', { virtuals: true });

testSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.category = ret.category_id.name;

    delete ret.category_id;
    delete ret._id;
    delete ret.__v;
  },
});

testSchema.virtual('descriptions', {
  ref: 'TestDesc',
  localField: '_id',
  foreignField: 'test_id',
});

testSchema.pre(/^find/, function (next) {
  this.populate({ path: 'category_id', select: 'name' });
  next();
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
