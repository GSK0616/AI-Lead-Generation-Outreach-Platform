import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppMessage({
  to,
  message,
}: {
  to: string;
  message: string;
}) {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
    });

    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('WhatsApp error:', error);
    throw error;
  }
}

export async function sendSMS({
  to,
  message,
}: {
  to: string;
  message: string;
}) {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('SMS error:', error);
    throw error;
  }
}
