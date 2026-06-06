import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaign_id');
    const leadId = searchParams.get('lead_id');

    if (!campaignId || !leadId) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      );
    }

    const supabase = await createServerComponentClient();

    // Update campaign_lead status to opened
    await supabase
      .from('campaign_leads')
      .update({ status: 'opened', opened_at: new Date() })
      .eq('campaign_id', campaignId)
      .eq('lead_id', leadId);

    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    return new NextResponse(pixel, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Email tracking error:', error);
    return new NextResponse('', { status: 200 });
  }
}
