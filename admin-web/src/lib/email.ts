import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.EMAIL_FROM || "LuckyFlow <no-reply@example.com>";

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!host || !user || !pass) {
    throw new Error("SMTP configuration is missing.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const info = await transporter.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  console.log("REAL EMAIL SENT:", info.messageId);

  return info;
}

export function approvedEmailTemplate(data: {
  fullName: string;
  itemTitle: string;
  referenceCode: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:30px;">
      <div style="max-width:600px; margin:auto; background:white; border-radius:12px; padding:24px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        
        <h2 style="color:#0f172a;"> Payment Confirmed</h2>

        <p>Hello <strong>${data.fullName}</strong>,</p>

        <p>Your payment has been successfully verified. Your entry is now confirmed.</p>

        <div style="margin-top:20px; padding:16px; background:#ecfeff; border-radius:10px;">
          <p><strong>Lottery:</strong> ${data.itemTitle}</p>
          <p><strong>Reference:</strong> ${data.referenceCode}</p>
          <p><strong>Status:</strong> Confirmed</p>
        </div>

        <p style="margin-top:20px;">Good luck!</p>

        <hr style="margin:20px 0;" />

        <p style="font-size:12px; color:#64748b;">
          This is an automated message. Please do not reply.
        </p>
      </div>
    </div>
  `;
}

export function rejectedEmailTemplate(data: {
  fullName: string;
  itemTitle: string;
  referenceCode: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a;">
      <h2 style="color:#0f172a;">Lottery Entry Update</h2>

      <p>Hello ${data.fullName},</p>

      <p>Unfortunately, your submitted payment proof could not be approved.</p>

      <div style="padding: 16px; background: #fef2f2; border-radius: 12px; border: 1px solid #fecaca;">
        <p><strong>Lottery Item:</strong> ${data.itemTitle}</p>
        <p><strong>Reference Code:</strong> ${data.referenceCode}</p>
        <p><strong>Status:</strong> Rejected</p>
      </div>

      <p>Please contact support or submit a clearer proof if allowed.</p>
    </div>
  `;
}