const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function scheduleEmail(userId, email) {
  const mailOptions = {
    from: 'Bard <noreply@bard.example>',
    to: email,
    subject: 'Welcome to Bard!',
    text: 'This is an automated email from Bard. Please reply to this email to get started.',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

module.exports = {
  scheduleEmail,
};
