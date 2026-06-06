import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase';
import { generateFollowUpSequence } from '@/lib/ai';
import { followUpQueue } from '@/lib/queue';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createServerComponentClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId, campaignId, messageCount = 5 } = body;

    // Get lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Generate follow-up sequence
    const sequence = await generateFollowUpSequence({
      lead: {
        company_name: lead.company_name,
        contact_first_name: lead.contact_first_name,
        contact_job_title: lead.contact_job_title,
        industry: lead.industry,
      },
      messageCount,
    });

    // Save follow-up sequences to database
    const followUpData = sequence.map((item) => ({
      campaign_id: campaignId,
      lead_id: leadId,
      sequence_day: item.day,
      message_content: item.message,
      status: 'pending',
    }));

    await supabase.from('follow_up_sequences').insert(followUpData);

    // Queue follow-up emails
    for (const item of sequence) {
      const scheduledTime = new Date();
      scheduledTime.setDate(scheduledTime.getDate() + item.day);

      await followUpQueue.add(
        {
          campaignId,
          leadId,
          email: lead.contact_email,
          message: item.message,
          recipientName: lead.contact_first_name,
          companyName: lead.company_name,
          senderName: user.email?.split('@')[0] || 'Sales',
        },
        {
          delay: item.day * 24 * 60 * 60 * 1000, // Convert days to milliseconds
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      sequence: sequence,
      scheduled_count: sequence.length,
    });
  } catch (error) {
    console.error('Follow-up sequence error:', error);
    return NextResponse.json(
      { error: 'Failed to create follow-up sequence' },
      { status: 500 }
    );
  }
}
