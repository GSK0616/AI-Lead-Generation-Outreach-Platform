import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerComponentClient();
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabase = await createServerComponentClient();

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerComponentClient();

    const { error } = await supabase.from('campaigns').delete().eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}
