const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');
const APIFeatures = require('./../utils/apifeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      const err = new AppError(`Document with ID '${id}' not found.`, 404);
      return next(err);
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findById(id);

    if (!doc) {
      const err = new AppError(`Document with ID '${id}' not found.`, 404);
      return next(err);
    }

    const docName = Model.modelName.toLowerCase();

    res.status(200).json({
      status: 'success',
      data: {
        [docName]: doc,
      },
    });
  });

exports.getMany = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .sort()
      .limit()
      .filter()
      .paginate();

    const docs = await features.query;

    const docsName = `${Model.modelName.toLowerCase()}List`;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        [docsName]: docs,
      },
    });
  });
