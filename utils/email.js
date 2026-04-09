const catchAsync = require('./catchAsync');
const { MailtrapClient } = require('mailtrap');
const passwordResetTemplate = require('./../utils/templates/email-reset');
const emailVerificationTemplate = require('./../utils/templates/email-verification');

const sendEmail = catchAsync(async (options) => {
  const TOKEN = process.env.EMAIL_TOKEN;

  const client = new MailtrapClient({
    token: TOKEN,
  });

  const sender = {
    email: process.env.EMAIL,
    name: 'Mailtrap Test',
  };
  const recipients = [
    {
      email: options.recipientsEmail,
    },
  ];
  const response = await client.send({
    from: sender,
    to: recipients,
    subject: options.subject,
    html: options.html,
    category: options.category,
  });
  console.log('Email has been successfully sent!', response);
});

exports.sendPasswordResetTokenEmail = catchAsync(async (user, token) => {
  const options = {
    recipientsEmail: user.email,
    subject: 'Password reset token (valid for 10 min).',
    category: 'Password Reset',
    token: token,
    html: passwordResetTemplate(user, token),
  };

  await sendEmail(options);
});

exports.sendEmailVerificationToken = catchAsync(async (user, token) => {
  const options = {
    recipientsEmail: user.email,
    subject: 'Email verification token.',
    category: 'Email verification',
    token: token,
    html: emailVerificationTemplate(user, token),
  };

  await sendEmail(options);
});
