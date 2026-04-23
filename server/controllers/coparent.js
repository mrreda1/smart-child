const { StatusCodes } = require('http-status-codes/build/cjs');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendChildLinkRequest } = require('../utils/email');

const ChildModel = require('../models/child');
const ParentModel = require('../models/parent');
const ParentChildModel = require('../models/parentChild');
const tokenModel = require('../models/token');

const email = require('../utils/email');

const requestCoParentAccess = catchAsync(async (req, res, next) => {
  const parentId = req.user.id;
  const child = req.child;

  if (!child.parents?.[0]?.parent_id)
    throw new AppError('Data inconsistency: Child owner not found.', StatusCodes.INTERNAL_SERVER_ERROR);

  const { name: ownerName, email: ownerEmail, id: ownerId } = child.parents[0].parent_id;

  if (parentId === ownerId) throw new AppError('You are the owner of that child.', StatusCodes.BAD_REQUEST);

  let existingLink = await ParentChildModel.findOne({
    parent_id: parentId,
    child_id: child._id,
  });

  if (!existingLink) existingLink = await ParentChildModel.create({ parent_id: parentId, child_id: child._id });
  else if (existingLink.status === 'accepted')
    throw new AppError('You are already linked to this child.', StatusCodes.BAD_REQUEST);
  else if (existingLink.status === 'pending')
    await tokenModel.deleteOne({
      referenceId: existingLink._id,
      tokenType: 'coparent_request',
    });
  else {
    existingLink.status = 'pending';
    await existingLink.save();
  }

  const token = await tokenModel.generateToken(existingLink._id, 'coparent_request');

  const recipient = { email: ownerEmail, name: ownerName };
  const sender = { email: req.user.email, name: req.user.name };
  const data = { sender, recipient, child: { name: child.name } };

  await sendChildLinkRequest(data, token);

  res.status(StatusCodes.OK).json({ status: 'success', message: "Requeest is sent to owner's email." });
});

const replyCoParentAcess = catchAsync(async (req, res, next) => {
  const { pendingLink, tokenDoc } = req;

  const { action } = req.query;

  let newStatus = null;
  let resMsg = null;

  const requester = await ParentModel.findById(pendingLink.parent_id);
  const child = await ChildModel.findById(pendingLink.child_id);

  if (!requester)
    throw new AppError(
      'The account associated with this request has been deactivated or deleted',
      StatusCodes.NOT_FOUND,
    );

  if (!child) {
    throw new AppError('The child profile associated with this request no longer exists.', StatusCodes.NOT_FOUND);
  }

  if (action === 'accept') {
    newStatus = 'accepted';

    resMsg = `${requester.name} is now sharing child profile with read-only access`;
  } else if (action === 'deny') {
    newStatus = 'denied';

    resMsg = 'Request to share child profile is denied';
  }

  await tokenDoc.deleteOne();

  pendingLink.status = newStatus;

  await pendingLink.save();

  await email.sendCoparentReply(action, {
    user: { name: requester.name, email: requester.email },
    child: { name: child.name },
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: resMsg,
  });
});

module.exports = { requestCoParentAccess, replyCoParentAcess };
