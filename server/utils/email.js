const catchAsync = require('./catchAsync');
const nodemailer = require('nodemailer');
const passwordResetTemplate = require('./../utils/templates/email-reset');
const emailVerificationTemplate = require('./../utils/templates/email-verification');
const { childLinkRequestTemplate } = require('./templates/child-link-request');
const AppError = require('./appError');
const { StatusCodes } = require('http-status-codes/build/cjs');
const { acceptedTemplate, deniedTemplate } = require('./templates/coparent-reply');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Smart Child" <smartchildorg@gmail.com>',
    to: options.recipientsEmail,
    subject: options.subject,
    html: options.html,
  });

  console.log('Email has been successfully sent!');
};

exports.sendPasswordResetTokenEmail = async (user, token, expireTimeInMinutes) => {
  const options = {
    recipientsEmail: user.email,
    subject: `Password reset token (valid for ${expireTimeInMinutes} min).`,
    token: token,
    html: passwordResetTemplate(user, token),
  };

  // console.log('Password reset token: ' + token);
  await sendEmail(options);
};

exports.sendEmailVerificationToken = async (user, token) => {
  const options = {
    recipientsEmail: user.email,
    subject: 'Email verification token.',
    token: token,
    html: emailVerificationTemplate(user, token),
  };

  // console.log('Email verification token: ' + token);
  await sendEmail(options);
};

exports.sendChildLinkRequest = async (data, token) => {
  const options = {
    recipientsEmail: data.recipient.email,
    subject: 'Child access request',
    html: childLinkRequestTemplate(data.recipient.name, data.sender.name, data.sender.email, data.child.name, token),
  };

  await sendEmail(options);
};

exports.sendCoparentReply = async (action, data) => {
  const isAccepted = action === 'accept';

  const replyTemplate = isAccepted ? acceptedTemplate : deniedTemplate;

  const subject = isAccepted
    ? 'Access Granted: Read-Only Profile Access Approved'
    : 'Status Update: Your profile access request';

  const options = {
    recipientsEmail: data.user.email,
    subject,
    html: replyTemplate(data),
  };

  await sendEmail(options);
};
