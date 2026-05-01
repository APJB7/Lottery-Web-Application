import nodemailer from "nodemailer";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export function underReviewEmailTemplate({
  fullName,
  itemTitle,
  referenceCode,
}: {
  fullName: string;
  itemTitle: string;
  referenceCode: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f6fbfb; padding:24px;">
      <div style="max-width:600px; margin:auto; background:white; border-radius:20px; padding:28px;">
        <h2 style="color:#0f172a;">Payment Proof Under Review</h2>
        <p>Hello ${fullName},</p>
        <p>Your payment proof for <strong>${itemTitle}</strong> has been received.</p>
        <p>Your reference number is:</p>
        <p style="font-size:22px; font-weight:bold; color:#0891b2;">${referenceCode}</p>
        <p>Your entry is currently under admin review. You will receive a confirmation email shortly once your payment has been approved.</p>
        <p style="margin-top:24px;">Thank you,<br/>The Jackpot Team</p>
      </div>
    </div>
  `;
}