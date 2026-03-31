const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
}); 

const sendNotification = async (office, message) => {
  try {
    await transporter.verify();
    console.log("SMTP ready");

    const info = await transporter.sendMail({
      from: `"Fire Alert System" <${process.env.EMAIL_USER}>`,
      to: office.email,
      subject: "🔥 Fire Incident Alert",
      text: message,
      html: `<b>${message}</b>`,
    });

    console.log("📧 Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email failed:", error.message);
  }
};

module.exports = { sendNotification };