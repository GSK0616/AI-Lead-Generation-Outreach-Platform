import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = await createServerComponentClient();

    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile with stats
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    // Get lead stats
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get campaign stats
    const { count: activeCampaigns } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'active');

    // Get response rate
    const { data: campaignLeads } = await supabase
      .from('campaign_leads')
      .select('status')
      .in('status', ['replied', 'opened', 'clicked']);

    const responseCount = campaignLeads?.length || 0;
    const totalSent = campaignLeads?.length || 0;
    const responseRate = totalSent > 0 ? (responseCount / totalSent) * 100 : 0;

    return NextResponse.json({
      profile,
      stats: {
        total_leads: totalLeads || 0,
        active_campaigns: activeCampaigns || 0,
        response_rate: responseRate.toFixed(1),
        conversion_rate: 4.2,
        monthly_growth: 23,
        revenue_generated: profile?.total_leads_generated * 50 || 0,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
