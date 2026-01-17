import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

/**
 * Get or create nodemailer transporter
 * Lazy initialization ensures environment variables are loaded
 */
const getTransporter = (): Transporter => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "localhost",
            port: parseInt(process.env.SMTP_PORT || "1025", 10),
            secure: false, // Use true for port 465, false for other ports
            ...(process.env.SMTP_USER && process.env.SMTP_PASS
                ? {
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                }
                : {}),
        });
    }
    return transporter;
};

/**
 * Send a welcome email to newly registered users
 * @param to - Recipient email address
 * @param name - User's display name
 */
export const sendWelcomeEmail = async (to: string, name: string): Promise<void> => {
    const fromAddress = process.env.SMTP_FROM || "noreply@lms.com";

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to LMS</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to LMS</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your Learning Journey Begins Here</p>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 22px;">Hello, ${name}!</h2>
            
            <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0; font-size: 15px;">
              Thank you for joining our Learning Management System. We're excited to have you on board and can't wait to see you grow your skills with us.
            </p>
            
            <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0; font-size: 15px;">
              With LMS, you can:
            </p>
            
            <ul style="color: #4a5568; line-height: 1.8; padding-left: 20px; margin: 0 0 25px 0;">
              <li>Browse and enroll in professional courses</li>
              <li>Complete assignments and track your progress</li>
              <li>Earn certificates upon course completion</li>
              <li>Connect with expert instructors</li>
            </ul>
            
            <p style="color: #4a5568; line-height: 1.6; margin: 0 0 30px 0; font-size: 15px;">
              Start exploring our course catalog and take the first step towards advancing your career.
            </p>
            
            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
                  <a href="${process.env.FRONTEND_URL || "http://localhost:5174"}/courses" 
                     style="display: inline-block; padding: 14px 30px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">
                    Explore Courses
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f7fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; margin: 0; font-size: 13px;">
              This email was sent to ${to} because you registered on our platform.
            </p>
            <p style="color: #a0aec0; margin: 10px 0 0 0; font-size: 12px;">
              &copy; ${new Date().getFullYear()} LMS Platform. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

    const mailOptions = {
        from: `"LMS Platform" <${fromAddress}>`,
        to,
        subject: "Welcome to LMS - Start Your Learning Journey!",
        html: htmlContent,
    };

    await getTransporter().sendMail(mailOptions);
};

/**
 * Send email verification link to newly registered users
 * @param to - Recipient email address
 * @param name - User's display name
 * @param token - Verification token
 */
export const sendVerificationEmail = async (to: string, name: string, token: string): Promise<void> => {
    const fromAddress = process.env.SMTP_FROM || "noreply@lms.com";
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174";
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Verify Your Email</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">One last step to get started</p>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 22px;">Hello, ${name}!</h2>
            
            <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0; font-size: 15px;">
              Thank you for registering with LMS. Please verify your email address to complete your registration and start learning.
            </p>
            
            <p style="color: #4a5568; line-height: 1.6; margin: 0 0 30px 0; font-size: 15px;">
              Click the button below to verify your email address:
            </p>
            
            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
                  <a href="${verificationLink}" 
                     style="display: inline-block; padding: 14px 30px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">
                    Verify Email Address
                  </a>
                </td>
              </tr>
            </table>
            
            <p style="color: #718096; line-height: 1.6; margin: 30px 0 10px 0; font-size: 13px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="color: #667eea; word-break: break-all; font-size: 13px; margin: 0;">
              ${verificationLink}
            </p>
            
            <p style="color: #e53e3e; line-height: 1.6; margin: 25px 0 0 0; font-size: 13px;">
              This link will expire in 24 hours.
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f7fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; margin: 0; font-size: 13px;">
              If you didn't create an account, you can safely ignore this email.
            </p>
            <p style="color: #a0aec0; margin: 10px 0 0 0; font-size: 12px;">
              &copy; ${new Date().getFullYear()} LMS Platform. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

    const mailOptions = {
        from: `"LMS Platform" <${fromAddress}>`,
        to,
        subject: "Verify Your Email - LMS Platform",
        html: htmlContent,
    };

    await getTransporter().sendMail(mailOptions);
};

/**
 * Verify SMTP connection (useful for health checks)
 */
export const verifyEmailConnection = async (): Promise<boolean> => {
    try {
        await getTransporter().verify();
        console.log("✅ SMTP connection verified");
        return true;
    } catch (error) {
        console.error("❌ SMTP connection failed:", error);
        return false;
    }
};
