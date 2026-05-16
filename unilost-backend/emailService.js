const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = process.env.EMAIL_FROM || 'UniLost <onboarding@resend.dev>';

console.log('✅ Email service ready (using Resend)');

// ── Send OTP email for registration ──────────────────────────────────────────
const sendOTPEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: 'UniLost - Email Verification OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #5f6fff; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #5f6fff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #5f6fff; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 UniLost Email Verification</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for registering with <strong>UniLost</strong> - Manipal University Jaipur's Lost & Found System.</p>
              <p>Please use the following OTP to verify your email address:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              <p><strong>Important:</strong></p>
              <ul>
                <li>This OTP is valid for <strong>10 minutes</strong></li>
                <li>Do not share this OTP with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
              <p>Best regards,<br><strong>UniLost Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2025 UniLost - Manipal University Jaipur</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Error sending OTP email:', error);
      throw new Error(error.message);
    }

    console.log('✅ OTP email sent:', data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    throw error;
  }
};

// ── Send password reset OTP email ─────────────────────────────────────────────
const sendPasswordResetEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: 'UniLost - Password Reset OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #dc2626; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 5px; }
            .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your <strong>UniLost</strong> account.</p>
              <p>Please use the following OTP to reset your password:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              <div class="warning">
                <p style="margin: 0;"><strong>⚠️ Security Alert:</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>This OTP is valid for <strong>10 minutes</strong></li>
                  <li>Never share this OTP with anyone</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Change your password immediately if you suspect unauthorized access</li>
                </ul>
              </div>
              <p>Best regards,<br><strong>UniLost Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2025 UniLost - Manipal University Jaipur</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Error sending password reset email:', error);
      throw new Error(error.message);
    }

    console.log('✅ Password reset email sent:', data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
};