// src/infrastructure/templates/email.templates.ts

export const otpTemplate = (firstName: string, otp: string, expiresIn: number): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your OTP</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:480px;background:#ffffff;border-radius:12px;
                 border:1px solid #e4e4e7;padding:40px 32px;">

          <!-- Brand -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <div style="display:inline-flex;align-items:center;justify-content:center;
                          width:48px;height:48px;border-radius:12px;background:#18181b;">
                <span style="color:#fff;font-size:22px;">🎓</span>
              </div>
              <p style="margin:12px 0 0;font-size:18px;font-weight:600;color:#18181b;">
                EduManage
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-size:22px;font-weight:600;color:#18181b;">
                Hi ${firstName},
              </h1>
              <p style="margin:8px 0 0;font-size:15px;color:#71717a;line-height:1.6;">
                Use the code below to complete your sign in.
                This code expires in <strong>${expiresIn} minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- OTP -->
          <tr>
            <td style="padding-bottom:24px;">
              <div style="background:#f4f4f5;border-radius:10px;padding:24px;text-align:center;">
                <span style="font-size:40px;font-weight:700;letter-spacing:12px;
                             color:#18181b;font-family:monospace;">
                  ${otp}
                </span>
              </div>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.6;">
                If you didn't request this code, you can safely ignore this email.
                Never share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #e4e4e7;padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                © ${new Date().getFullYear()} EduManage. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export const firstTimeSetupTemplate = (
  firstName: string,
  setupLink: string,
  role: string,
): string => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><title>Account Setup</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:480px;background:#fff;border-radius:12px;
                 border:1px solid #e4e4e7;padding:40px 32px;">
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <p style="margin:0;font-size:18px;font-weight:600;color:#18181b;">EduManage</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-size:22px;font-weight:600;color:#18181b;">
                Welcome, ${firstName}!
              </h1>
              <p style="margin:8px 0 0;font-size:15px;color:#71717a;line-height:1.6;">
                Your <strong>${role}</strong> account has been created.
                Click the button below to set your password and activate your account.
                This link expires in <strong>24 hours</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <a href="${setupLink}"
                style="display:inline-block;background:#18181b;color:#fff;
                       text-decoration:none;padding:14px 32px;border-radius:8px;
                       font-size:15px;font-weight:500;">
                Set Up My Account
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                Or copy this link: <br/>
                <span style="word-break:break-all;color:#71717a;">${setupLink}</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export const resetPasswordTemplate = (
  firstName: string,
  resetLink: string,
): string => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><title>Reset Password</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:480px;background:#fff;border-radius:12px;
                 border:1px solid #e4e4e7;padding:40px 32px;">
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <p style="margin:0;font-size:18px;font-weight:600;color:#18181b;">EduManage</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-size:22px;font-weight:600;color:#18181b;">
                Reset your password
              </h1>
              <p style="margin:8px 0 0;font-size:15px;color:#71717a;line-height:1.6;">
                Hi ${firstName}, we received a request to reset your password.
                Click the button below. This link expires in <strong>15 minutes</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <a href="${resetLink}"
                style="display:inline-block;background:#18181b;color:#fff;
                       text-decoration:none;padding:14px 32px;border-radius:8px;
                       font-size:15px;font-weight:500;">
                Reset Password
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin:0;font-size:13px;color:#a1a1aa;">
                If you didn't request this, ignore this email.
                Your password will not change.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`