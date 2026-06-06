import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase';
import { campaignQueue } from '@/lib/queue';
import { generatePersonalizedMessage } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createServerComponentClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaignId, leads } = body;

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get user profile for sender details
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const senderName = profile?.full_name || 'LeadForge';

    let successCount = 0;
    let errorCount = 0;

    // Process each lead
    for (const leadData of leads) {
      try {
        // Generate personalized message
        const message = await generatePersonalizedMessage({
          lead: {
            company_name: leadData.company_name,
            contact_first_name: leadData.contact_first_name || 'User',
            contact_job_title: leadData.contact_job_title || 'Manager',
            industry: leadData.industry,
          },
          messageType: 'cold_email',
          style: 'professional',
        });

        // Create campaign_lead entry
        const { data: campaignLead, error: clError } = await supabase
          .from('campaign_leads')
          .insert([
            {
              campaign_id: campaignId,
              lead_id: leadData.id,
              status: 'pending',
            },
          ])
          .select()
          .single();

        if (!clError && campaignLead) {
          // Queue email sending
          await campaignQueue.add(
            {
              campaignId,
              leadId: leadData.id,
              email: leadData.contact_email,
              message,
              subject: `Quick question about ${leadData.company_name}`,
              recipientName: leadData.contact_first_name,
              companyName: leadData.company_name,
              senderName,
            },
            {
              attempts: 3,
              backoff: {
                type: 'exponential',
                delay: 2000,
              },
            }
          );

          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error('Lead processing error:', error);
        errorCount++;
      }
    }

    // Update campaign status
    await supabase
      .from('campaigns')
      .update({
        status: 'active',
        total_leads: successCount,
        sent_count: successCount,
      })
      .eq('id', campaignId);

    return NextResponse.json({
      success: true,
      processed: successCount,
      failed: errorCount,
      campaign_id: campaignId,
    });
  } catch (error) {
    console.error('Campaign launch error:', error);
    return NextResponse.json(
      { error: 'Failed to launch campaign' },
      { status: 500 }
    );
  }
}
