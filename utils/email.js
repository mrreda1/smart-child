const catchAsync = require('./catchAsync');
const { MailtrapClient } = require('mailtrap');
const resetTemplate = require('../utils/templates/email-reset');

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
  const message = `Hi ${user.name}!, forgot your password? You can visit our website with your token to reset your password: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  const options = {
    recipientsEmail: user.email,
    message: message,
    subject: 'Password reset token (valid for 10 min).',
    category: 'Password Reset',
    token: token,
    html: resetTemplate(token),
  };

  await sendEmail(options);
});
