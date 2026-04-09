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
      email: options.email,
      // email: "mohamedredaelsaid0@gmail.com",
    },
  ];

  const response = await client.send({
    from: sender,
    to: recipients,
    subject: options.subject,
    // text: options.message,
    html: resetTemplate(options.token),
    category: options.category,
  });
  // .then(console.log, console.error);
  console.log('Email sent.', response);
});

module.exports = sendEmail;
