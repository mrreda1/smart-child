const catchAsync = require('./catchAsync');
const nodemailer = require('nodemailer');
const passwordResetTemplate = require('./../utils/templates/email-reset');
const emailVerificationTemplate = require('./../utils/templates/email-verification');

const sendEmail = catchAsync(async (options) => {
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
});

exports.sendPasswordResetTokenEmail = catchAsync(
  async (user, token, expireTimeInMinutes) => {
    const options = {
      recipientsEmail: user.email,
      subject: `Password reset token (valid for ${expireTimeInMinutes} min).`,
      token: token,
      html: passwordResetTemplate(user, token),
    };

    // console.log('Password reset token: ' + token);
    await sendEmail(options);
  },
);

exports.sendEmailVerificationToken = catchAsync(async (user, token) => {
  const options = {
    recipientsEmail: user.email,
    subject: 'Email verification token.',
    token: token,
    html: emailVerificationTemplate(user, token),
  };

  // console.log('Email verification token: ' + token);
  await sendEmail(options);
});
