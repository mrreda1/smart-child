const catchAsync = require('../utils/catchAsync');
const { AssessmentModel } = require('../models/index');

const getDailyReports = catchAsync(async (req, res, next) => {
  const { childId } = req.params;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;

  const skip = (page - 1) * limit;

  let assessments = await AssessmentModel.find({ child_id: childId, status: 'completed' })
    .select('_id')
    .populate({ path: 'report', justOne: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalItems = await AssessmentModel.countDocuments({ child_id: childId, status: 'completed' });

  const hasNextPage = skip + assessments.length < totalItems;

  res.json({
    data: assessments,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      hasNextPage,
    },
  });
});

module.exports = { getDailyReports };
