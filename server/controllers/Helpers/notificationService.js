const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,    // same as in sendEmail.js
    pass: process.env.EMAIL_PASS,
  },
});

const sendNotification = async (office, message) => {
  try {
    const info = await transporter.sendMail({
      from: `"Fire Alert System" <${process.env.EMAIL_USER}>`,
      to: office.email,
      subject: "🔥 Fire Incident Alert",
      text: message,
      html: `<b>${message}</b>`,
    });

    console.log("📧 Notification email sent: %s", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send notification:", error.message);
  }
};

module.exports = { sendNotification };
