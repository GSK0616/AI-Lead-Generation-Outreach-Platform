import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase';
import { generateLeadScore, enrichLeadData } from '@/lib/ai';
import { cacheSet, cacheGet } from '@/lib/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createServerComponentClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { company_name, industry, description, website } = body;

    // Check cache first
    const cacheKey = `lead_enrichment:${company_name}`;
    let enrichedData = await cacheGet(cacheKey);

    if (!enrichedData) {
      // Enrich data from AI
      enrichedData = await enrichLeadData({
        company_name,
        industry,
        company_description: description,
        website,
      });

      // Cache for 24 hours
      await cacheSet(cacheKey, enrichedData, 86400);
    }

    // Generate lead score
    const scoreResult = await generateLeadScore({
      company_name,
      contact_first_name: body.contact_first_name || 'Unknown',
      contact_job_title: body.contact_job_title || 'Unknown',
      industry,
      company_description: description,
      website,
    });

    // Save enrichment to database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id')
      .eq('company_name', company_name)
      .eq('user_id', user.id)
      .single();

    if (lead && !leadError) {
      await supabase.from('lead_enrichments').insert([
        {
          lead_id: lead.id,
          company_description: enrichedData.company_summary,
          social_presence: {
            channels: enrichedData.best_contact_channels,
          },
          growth_indicators: enrichedData.growth_indicators,
        },
      ]);
    }

    return NextResponse.json({
      score: scoreResult.score,
      quality: scoreResult.quality,
      reasoning: scoreResult.reasoning,
      enrichment: enrichedData,
    });
  } catch (error) {
    console.error('Lead enrichment error:', error);
    return NextResponse.json(
      { error: 'Failed to enrich lead' },
      { status: 500 }
    );
  }
}
