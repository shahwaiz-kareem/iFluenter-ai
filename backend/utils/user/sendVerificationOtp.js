import transporter from "../../config/nodemailer.config.js";
import otpGenerator from "otp-generator";
import UserOtpModel from "../../models/userOtp.model.js";
const sendVerificationOtp = async (user, userEmail) => {
  try {
    const otp = otpGenerator.generate(6, {
      digits: true,
      specialChars: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
    });

    const otpVerificationLink = `${
      process.env.FRONTEND_HOST
    }/account/verify-email?email=${userEmail || user.email}`;
    const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #eef2f7;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        color: #333;
      }

      .otp-container {
        background: #ffffff;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 100%;
      }

      .otp-container h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        color: #4caf50;
      }

      .otp-container h2 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: #333;
      }

      .otp-container p {
        margin-bottom: 0.5rem;
        font-size: 1rem;
        line-height: 1.6;
      }


      .otp-link {
        display: inline-block;
        background: #4caf50;
        color: white !important;
        padding: 0.5rem 1.5rem;
        border-radius: 5px;
        text-decoration: none;
        font-size: 1rem;
        font-weight: bold;
        transition: background-color 0.3s ease;
      }

      .otp-link:hover {
        background: #388e3c;
      }

      .footer {
        margin-top: 1.5rem;
        font-size: 0.9rem;
        color: #666;
        line-height: 1.4;
      }

      .footer a {
        color: #4caf50;
        text-decoration: none;
        font-weight: bold;
      }

      .footer a:hover {
        text-decoration: underline;
      }

      .otp-code {
        display: inline-block;
        background: #f4f4f4;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="otp-container">
      <h1>Welcome to iFluenter!</h1>
      <h2>Dear ${user.name},</h2>
      <p>To verify your email, please copy the One-Time Password (OTP) below.</p>
      <p>Your OTP is:</p>
      <p class="otp-code">${otp}</p>
      <p>Your OTP will automatically expire after 10 minutes. If you have lost the verification link, please click the link below:</p>
      <a href="${otpVerificationLink}" class="otp-link">Enter OTP</a>
      <p>If you haven't request this OTP, please ignore this email.</p>
      <p>Thanks</p>
      <div class="footer">
        Need help? Contact our support team at:
        <a href="mailto:${process.env.CONTACT_EMAIL}">${process.env.CONTACT_EMAIL}</a>
      </div>
    </div>
  </body>
  </html>`;

    // console.log("ENV USER:", process.env.EMAIL_USER);
    // console.log("SENDER STR:", `iFluenter <${process.env.EMAIL_USER}>`);

    await transporter.sendMail({
      from: `iFluenter <${process.env.EMAIL_USER}>`,
      to: userEmail || user.email,
      subject: "Verify Your Email",
      html,
    });

    await UserOtpModel.create({ userId: user._id, otp });
    return { otp, success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to send OTP" };
  }
};

export default sendVerificationOtp;
