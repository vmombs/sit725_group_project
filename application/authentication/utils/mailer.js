const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'hello.sneezl@gmail.com',
      pass: 'tnwo vlzo npvl hjgz',
    }
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const mailOptions = {
    from: '"Sneezl" <no-reply@sneezl.com>',
    to: email,
    subject: 'Password Reset Link',
    html: `
      <p>You requested a password reset for your account.</p>
      <p>Click this link to reset your password within 1 hour:</p>
      <a href="https://www.sneezl.com/reset-password/${resetToken}">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully!');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

module.exports = { sendPasswordResetEmail };