import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // Must be false for 587
  tls: {
    rejectUnauthorized: false, // Helps with some VPS handshake issues
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  defaults: {
    from: `"${process.env.EMAIL_NAME || "Support"}" <${
      process.env.EMAIL_USER
    }>`,
  },
});

export default transporter;
