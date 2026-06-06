import nodemailer from 'nodemailer';
import { EmailTemplate } from '@/types/email';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = process.env.SMTP_FROM_EMAIL || 'noreply@leadforge.ai',
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}) {
  try {
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendColdEmail({
  to,
  recipientName,
  companyName,
  messageContent,
  senderName,
}: {
  to: string;
  recipientName: string;
  companyName: string;
  messageContent: string;
  senderName: string;
}) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <p>Hi ${recipientName},</p>
      ${messageContent.split('\n').map((line) => `<p>${line}</p>`).join('')}
      <p>Best regards,<br>${senderName}<br>LeadForge AI</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        This email was sent by LeadForge AI. <a href="{{unsubscribe_url}}" style="color: #06b6d4; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Quick question about ${companyName}`,
    html,
    text: messageContent,
  });
}

export async function sendCampaignEmail({
  to,
  campaignId,
  leadId,
  content,
  subject,
}: {
  to: string;
  campaignId: string;
  leadId: string;
  content: string;
  subject: string;
}) {
  const trackingPixel = `<img src="{{tracking_url}}/track/${campaignId}/${leadId}" width="1" height="1" alt="" style="display:none;" />`;

  return sendEmail({
    to,
    subject,
    html: content + trackingPixel,
    text: content,
  });
}
