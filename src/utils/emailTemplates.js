/**
 * Generates an attractive HTML email template for Password Reset requests.
 * @param {string} userName - The recipient's display name
 * @param {string} resetUrl - The clickable frontend reset password URL
 * @returns {string} - Styled HTML email body
 */
export const generateResetPasswordEmailTemplate = (userName, resetUrl) => {
  const displayName = userName || 'User';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - IlmSaathi School ERP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #090d16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #090d16; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Top Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #6366f1 100%); padding: 32px 30px; text-align: center;">
              <div style="display: inline-block; width: 48px; h-line: 48px; background: rgba(255, 255, 255, 0.15); border-radius: 14px; margin-bottom: 12px;">
                <span style="font-size: 26px; line-height: 48px; color: #ffffff;">🔒</span>
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                IlmSaathi School ERP
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #c7d2fe; font-weight: 500;">
                Password Reset Instructions
              </p>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 32px; background-color: #0f172a;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #f1f5f9; font-weight: 600;">
                Hello ${displayName},
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                We received a request to reset the password associated with your account on <strong style="color: #cbd5e1;">IlmSaathi School ERP</strong>. Click the button below to create a new password:
              </p>

              <!-- Call to Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4); transition: all 0.2s ease;">
                      Reset Password →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Plain Text URL -->
              <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 14px; margin: 24px 0; word-break: break-all;">
                <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">
                  If the button above does not work, copy and paste this URL into your browser:
                </p>
                <a href="${resetUrl}" target="_blank" style="font-size: 12px; color: #818cf8; text-decoration: underline;">
                  ${resetUrl}
                </a>
              </div>

              <!-- Security Notice -->
              <p style="margin: 20px 0 0 0; font-size: 12px; line-height: 1.5; color: #64748b; border-top: 1px solid #1e293b; padding-top: 18px;">
                ⚠️ <strong>Security Notice:</strong> This password reset link expires in <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email or contact your administrator immediately.
              </p>
            </td>
          </tr>

          <!-- Footer Section with Branding & Team Signature -->
          <tr>
            <td style="background-color: #090d16; border-top: 1px solid #1e293b; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #cbd5e1;">
                IlmSaathi School ERP Team
              </p>
              <p style="margin: 0 0 12px 0; font-size: 11px; color: #64748b; line-height: 1.4;">
                Empowering Educational Institutions with Next-Gen Digital Management
              </p>
              <p style="margin: 0; font-size: 10px; color: #475569;">
                &copy; 2026 IlmSaathi School ERP. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
