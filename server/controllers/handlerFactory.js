const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');
const APIFeatures = require('./../utils/apifeatures');
const { StatusCodes } = require('http-status-codes');
const filterObj = require('../utils/filterObj.js');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    const docName = Model.modelName.toLowerCase();

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        [docName]: doc,
      },
    });
  });

exports.updateOne = (Model, sendResponse = true) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const docName = Model.modelName.toLowerCase();

    const capitalizedName = docName.charAt(0).toUpperCase() + docName.slice(1);

    const doc = await Model.findById(id);

    if (!doc) {
      return next(
        new AppError(
          `Document with ID '${id}' not found.`,
          StatusCodes.NOT_FOUND,
        ),
      );
    }

    req[`old${capitalizedName}`] = doc.toObject();

    const filteredBody = filterObj(req.body, 'name', 'age', 'gender', 'photo');

    Object.keys(filteredBody).forEach((key) => {
      doc[key] = req.body[key];
    });

    await doc.save();

    req[`new${capitalizedName}`] = doc;

    if (!sendResponse) return next();

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        [docName]: doc,
      },
    });
  });

exports.deleteOne = (Model, sendResponse = true) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const docName = Model.modelName.toLowerCase();
    const capitalizedName = docName.charAt(0).toUpperCase() + docName.slice(1);

    const doc = await Model.findById(id);

    if (!doc) {
      const err = new AppError(
        `Document with ID '${id}' not found.`,
        StatusCodes.NOT_FOUND,
      );
      return next(err);
    }

    req[`old${capitalizedName}`] = doc.toObject();

    await doc.deleteOne();

    if (!sendResponse) return next();

    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      data: null,
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findById(id);

    if (!doc) {
      const err = new AppError(
        `Document with ID '${id}' not found.`,
        StatusCodes.NOT_FOUND,
      );
      return next(err);
    }

    const docName = Model.modelName.toLowerCase();

    res.status(StatusCodes.OK).json({
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

    res.status(StatusCodes.OK).json({
      status: 'success',
      results: docs.length,
      data: {
        [docsName]: docs,
      },
    });
  });
