require('dotenv').config();


const BREVO_API_KEY = process.env.BREVO_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME;

async function sendViaBrevo({ to, subject, html }) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: EMAIL_FROM_NAME, email: EMAIL_FROM },
      to: [{ email: to }],
      subject,
      htmlContent: html
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(' Brevo API error:', data);
    throw new Error(data.message || 'Failed to send email via Brevo');
  }

  console.log('Email sent via Brevo:', data.messageId);
  return { success: true, messageId: data.messageId };
}

// Send OTP email for registration
const sendOTPEmail = async (email, otp) => {
  const html = `
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
  `;

  try {
    return await sendViaBrevo({ to: email, subject: 'UniLost - Email Verification OTP', html });
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw error;
  }
};

// Send password reset OTP email
const sendPasswordResetEmail = async (email, otp) => {
  const html = `
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
              <li>If you didn't request this, please ignore this email and your password will remain unchanged</li>
              <li>For security, change your password immediately if you suspect unauthorized access</li>
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
  `;

  try {
    return await sendViaBrevo({ to: email, subject: 'UniLost - Password Reset OTP', html });
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail
};