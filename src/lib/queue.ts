import Bull from 'bull';
import { sendColdEmail } from '@/lib/email';
import { createServerComponentClient } from '@/lib/supabase';

const campaignQueue = new Bull('campaigns', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

const followUpQueue = new Bull('followups', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

const analyticsQueue = new Bull('analytics', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

// Campaign email processing
campaignQueue.process(async (job) => {
  const { campaignId, leadId, email, message, subject } = job.data;

  try {
    await sendColdEmail({
      to: email,
      recipientName: job.data.recipientName,
      companyName: job.data.companyName,
      messageContent: message,
      senderName: job.data.senderName,
    });

    // Update campaign_leads status
    const supabase = await createServerComponentClient();
    await supabase
      .from('campaign_leads')
      .update({ status: 'sent', sent_at: new Date() })
      .eq('campaign_id', campaignId)
      .eq('lead_id', leadId);

    return { success: true };
  } catch (error) {
    console.error('Campaign email error:', error);
    throw error;
  }
});

// Follow-up email processing
followUpQueue.process(async (job) => {
  const { campaignId, leadId, email, message, sequenceDay } = job.data;

  try {
    await sendColdEmail({
      to: email,
      recipientName: job.data.recipientName,
      companyName: job.data.companyName,
      messageContent: message,
      senderName: job.data.senderName,
    });

    // Update follow_up_sequences status
    const supabase = await createServerComponentClient();
    await supabase
      .from('follow_up_sequences')
      .update({ status: 'sent', sent_at: new Date() })
      .eq('campaign_id', campaignId)
      .eq('lead_id', leadId)
      .eq('sequence_day', sequenceDay);

    return { success: true };
  } catch (error) {
    console.error('Follow-up email error:', error);
    throw error;
  }
});

// Analytics processing
analyticsQueue.process(async (job) => {
  const { userId, eventType, eventData } = job.data;

  try {
    const supabase = await createServerComponentClient();
    await supabase.from('analytics_events').insert([
      {
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
      },
    ]);

    return { success: true };
  } catch (error) {
    console.error('Analytics processing error:', error);
    throw error;
  }
});

export { campaignQueue, followUpQueue, analyticsQueue };
