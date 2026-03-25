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
    console.warn("SMTP env vars missing. Email skipped.");
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}

export function registrationEmailTemplate(data: {
  fullName: string;
  itemTitle: string;
  referenceCode: string;
  amount: number;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a;">
      <h2>Registration Received</h2>
      <p>Hello ${data.fullName},</p>
      <p>Your lottery registration has been created successfully.</p>
      <div style="padding: 16px; background: #ecfeff; border-radius: 12px; border: 1px solid #67e8f9;">
        <p><strong>Item:</strong> ${data.itemTitle}</p>
        <p><strong>Reference Code:</strong> ${data.referenceCode}</p>
        <p><strong>Amount:</strong> Rs ${data.amount}</p>
      </div>
      <p>Please complete payment and upload your payment proof.</p>
    </div>
  `;
}

export function approvedEmailTemplate(data: {
  fullName: string;
  itemTitle: string;
  referenceCode: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a;">
      <h2>Payment Approved</h2>
      <p>Hello ${data.fullName},</p>
      <p>Your payment proof has been approved.</p>
      <div style="padding: 16px; background: #f0fdfa; border-radius: 12px; border: 1px solid #99f6e4;">
        <p><strong>Item:</strong> ${data.itemTitle}</p>
        <p><strong>Reference Code:</strong> ${data.referenceCode}</p>
        <p><strong>Status:</strong> Approved</p>
      </div>
      <p>Your entry is now confirmed.</p>
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
      <h2>Payment Review Update</h2>
      <p>Hello ${data.fullName},</p>
      <p>Your payment proof could not be approved.</p>
      <div style="padding: 16px; background: #fef2f2; border-radius: 12px; border: 1px solid #fecaca;">
        <p><strong>Item:</strong> ${data.itemTitle}</p>
        <p><strong>Reference Code:</strong> ${data.referenceCode}</p>
        <p><strong>Status:</strong> Rejected</p>
      </div>
      <p>Please contact support or submit a clearer receipt.</p>
    </div>
  `;
}