/**
 * Config: Email Configuration (Nodemailer)
 * 
 * This file sets up Nodemailer to send emails via Gmail SMTP.
 * Requires Gmail App Password (not regular password).
 * 
 * How to get App Password:
 * 1. Go to https://myaccount.google.com/apppasswords
 * 2. Enable 2-Factor Authentication first
 * 3. Generate a 16-character app password for "Mail" and "Windows Computer"
 * 4. Use this 16-character password in EMAIL_PASS .env variable
 * 
 * Called from: authController.js
 */

import nodemailer from 'nodemailer';

// Create reusable transporter object using Gmail SMTP
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP Email Helper Function
 * 
 * @param {string} userEmail - Recipient email address
 * @param {string} otp - 6-digit OTP to send
 * @returns {Promise<boolean>} - Returns true if email sent successfully
 */
export const sendOtpEmail = async (userEmail, otp) => {
  try {
    // Email message template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Fleet Flow - Your OTP Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #333;">Fleet Flow Authentication</h2>
            <p style="color: #666;">Your One-Time Password (OTP) for Fleet Flow is:</p>
            <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #999; font-size: 12px;">
              This OTP will expire in 5 minutes. Do not share this code with anyone.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`📧 OTP sent to: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return false;
  }
};

export default transporter;
