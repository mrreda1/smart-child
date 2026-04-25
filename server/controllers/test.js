const factoryHandler = require('./handlerFactory');

const Test = require('../models/test');
const catchAsync = require('../utils/catchAsync');

const getTests = factoryHandler.getMany(Test);

const getTestsDescription = catchAsync(async (req, res, next) => {
  const testsDescription = await Test.find().populate({ path: 'descriptions' });

  res.json({ results: testsDescription.length, data: testsDescription });
});

module.exports = { getTests, getTestsDescription };
