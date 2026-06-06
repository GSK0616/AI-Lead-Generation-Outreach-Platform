import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createServerComponentClient();

    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create campaign
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert([
        {
          user_id: user.id,
          name: body.name,
          description: body.description,
          campaign_type: body.campaign_type,
          status: 'draft',
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerComponentClient();

    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ campaigns });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
