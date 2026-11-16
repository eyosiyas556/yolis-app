import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER || "eyosiyasfisseha51@gmail.com";
const smtpPass = (process.env.SMTP_PASS || "arzykjymzzmrgryd").replace(/\s+/g, "");
const fromName = process.env.SMTP_FROM_NAME || "Yolanda Beauty Equipment";
const fromEmail = process.env.SMTP_FROM_EMAIL || smtpUser;

export function createMailer() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    pool: false, // Fresh connection per send to prevent idle ECONNRESET
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export async function sendPasswordResetEmail({
  to,
  recipientName,
  otpCode,
}: {
  to: string;
  recipientName: string;
  otpCode: string;
}) {
  const subject = `Yolanda Beauty Salon - Your Password Reset Code [${otpCode}]`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #FAF6F0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #2D1C14;
        }
        .container {
          max-width: 560px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid #EADCCF;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(46, 26, 17, 0.06);
        }
        .header {
          background-color: #2E1A11;
          color: #FAF6F0;
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #FAF6F0;
        }
        .header p {
          margin: 6px 0 0 0;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #EADCCF;
        }
        .content {
          padding: 36px 32px;
        }
        .greeting {
          font-size: 16px;
          font-weight: 600;
          color: #2D1C14;
          margin-bottom: 12px;
        }
        .lead {
          font-size: 14px;
          line-height: 1.6;
          color: #7D6E66;
          margin-bottom: 24px;
        }
        .code-box {
          background: linear-gradient(135deg, #FAF6F0 0%, #F5EBE1 100%);
          border: 1.5px dashed #2E1A11;
          border-radius: 14px;
          padding: 24px;
          text-align: center;
          margin: 28px 0;
        }
        .code-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #7D6E66;
          margin-bottom: 8px;
        }
        .otp-digits {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 8px;
          color: #2E1A11;
          font-family: 'Courier New', Courier, monospace;
          display: inline-block;
          padding: 4px 16px;
        }
        .expiry-note {
          font-size: 12px;
          color: #9E8E84;
          margin-top: 8px;
        }
        .instructions {
          font-size: 13px;
          line-height: 1.6;
          color: #7D6E66;
          border-left: 3px solid #2E1A11;
          padding-left: 14px;
          margin: 20px 0;
        }
        .footer {
          background-color: #FAF6F0;
          border-top: 1px solid #EADCCF;
          padding: 20px 32px;
          text-align: center;
          font-size: 11px;
          color: #7D6E66;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Yolanda Beauty Salon</h1>
          <p>Look Good ✦ Feel Better</p>
        </div>

        <div class="content">
          <p class="greeting">Hello ${recipientName || "Valued Salon Member"},</p>
          <p class="lead">
            We received a request to reset the password for your Yolanda Beauty Salon account.
            Use the verification code below to set a new password:
          </p>

          <div class="code-box">
            <div class="code-title">Your 6-Digit Reset Code</div>
            <div class="otp-digits">${otpCode}</div>
            <div class="expiry-note">⏱ This code is valid for 1.5 minutes (90 seconds).</div>
          </div>

          <div class="instructions">
            <strong>Security Reminder:</strong>
            Never share this OTP code with anyone. Yolanda Beauty Salon team members will never ask for your password or reset code.
          </div>

          <p class="lead" style="font-size: 12px; margin-top: 24px;">
            If you did not request this password reset, you can safely ignore this email — your account remains secure.
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 6px 0;">Sent by <strong>${fromName}</strong></p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Yolanda Beauty Salon. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailer = createMailer();
  const info = await mailer.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    text: `Your Yolanda Beauty Salon verification code is: ${otpCode}. It expires in 1.5 minutes (90 seconds).`,
    html,
  });

  return info;
}
