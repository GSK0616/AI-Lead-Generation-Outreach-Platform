import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface LeadData {
  company_name: string;
  contact_first_name: string;
  contact_job_title: string;
  industry: string;
  company_description?: string;
  website?: string;
}

export async function generateLeadScore(leadData: LeadData): Promise<{
  score: number;
  quality: 'hot' | 'warm' | 'cold';
  reasoning: string;
}> {
  try {
    const prompt = `
Analyze this lead and provide a score from 1-100 based on lead quality:

Company: ${leadData.company_name}
Contact: ${leadData.contact_first_name} (${leadData.contact_job_title})
Industry: ${leadData.industry}
Description: ${leadData.company_description || 'Not provided'}
Website: ${leadData.website || 'Not provided'}

Evaluate based on:
1. Industry match potential
2. Company size and growth signals
3. Job title relevance
4. Engagement likelihood
5. Revenue potential

Respond in JSON format:
{
  "score": number (1-100),
  "quality": "hot" | "warm" | "cold",
  "reasoning": string
}
    `;

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    const result = JSON.parse(content.text);
    return result;
  } catch (error) {
    console.error('Error generating lead score:', error);
    // Fallback scoring
    return {
      score: 50,
      quality: 'warm',
      reasoning: 'Default scoring due to API error',
    };
  }
}

export async function generatePersonalizedMessage({
  lead,
  messageType,
  style = 'professional',
}: {
  lead: LeadData;
  messageType: 'cold_email' | 'linkedin_message' | 'instagram_dm' | 'whatsapp';
  style?: 'professional' | 'casual' | 'urgent';
}): Promise<string> {
  try {
    const styleGuide = {
      professional: 'formal, business-appropriate tone',
      casual: 'friendly, conversational tone',
      urgent: 'compelling, action-oriented tone',
    };

    const formatGuide = {
      cold_email: 'Write a compelling cold email subject line and 3-4 paragraph body. Max 150 words.',
      linkedin_message: 'Write a LinkedIn connection message. Max 100 words.',
      instagram_dm: 'Write a casual Instagram DM. Max 150 characters.',
      whatsapp: 'Write a WhatsApp message. Max 160 characters.',
    };

    const prompt = `
Generate a personalized outreach message for:
Company: ${lead.company_name}
Person: ${lead.contact_first_name}
Title: ${lead.contact_job_title}
Industry: ${lead.industry}

Message Type: ${messageType}
Tone: ${styleGuide[style]}
Format: ${formatGuide[messageType]}

Make it:
- Personalized and specific to their company
- Value-focused (what benefit do they get?)
- Conversational and authentic
- Action-oriented with clear next step

Respond with ONLY the message, no additional text.
    `;

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    return content.text;
  } catch (error) {
    console.error('Error generating message:', error);
    return `Hi ${lead.contact_first_name},

I came across ${lead.company_name} and was impressed by your work in ${lead.industry}.

Would you be open to a quick conversation about how we can help drive growth?

Best regards`;
  }
}

export async function generateFollowUpSequence({
  lead,
  messageCount = 5,
}: {
  lead: LeadData;
  messageCount?: number;
}): Promise<Array<{ day: number; message: string }>> {
  try {
    const prompt = `
Create a ${messageCount}-email follow-up sequence for:
Company: ${lead.company_name}
Contact: ${lead.contact_first_name}
Title: ${lead.contact_job_title}

Generate emails for days: 3, 5, 7, 10, 14

Requirements:
- Each email should be shorter than the last
- Include different value propositions
- Last email should have urgency
- All should be personalized

Respond in JSON format:
[
  { "day": number, "message": string },
  ...
]

Respond with ONLY valid JSON, no additional text.
    `;

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    const result = JSON.parse(content.text);
    return result;
  } catch (error) {
    console.error('Error generating follow-up sequence:', error);
    return [
      {
        day: 3,
        message: `Hi ${lead.contact_first_name}, just following up on my previous message. Still interested in connecting?`,
      },
      { day: 5, message: `Quick reminder - would love to chat about ${lead.company_name}'s growth.` },
      { day: 7, message: `One more thing - I think there's real value here for ${lead.company_name}.` },
      { day: 10, message: `Last attempt - let me know if this is a fit.` },
      { day: 14, message: `Hope to connect soon!` },
    ];
  }
}

export async function enrichLeadData(leadData: LeadData): Promise<{
  company_summary: string;
  growth_indicators: string[];
  decision_makers: string[];
  best_contact_channels: string[];
}> {
  try {
    const prompt = `
Provide insights about this company for B2B sales:
Company: ${leadData.company_name}
Industry: ${leadData.industry}
Website: ${leadData.website || 'Unknown'}
Description: ${leadData.company_description || 'Not provided'}

Respond with JSON:
{
  "company_summary": "2-3 sentence summary of what they do and their market position",
  "growth_indicators": ["Recent funding", "New product launch", etc.],
  "decision_makers": ["CFO", "VP Sales", etc.],
  "best_contact_channels": ["Email", "LinkedIn", etc.]
}

Respond with ONLY valid JSON.
    `;

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    const result = JSON.parse(content.text);
    return result;
  } catch (error) {
    console.error('Error enriching lead data:', error);
    return {
      company_summary: 'Company in the ' + leadData.industry + ' industry',
      growth_indicators: [],
      decision_makers: ['CEO', 'VP Operations'],
      best_contact_channels: ['Email', 'LinkedIn'],
    };
  }
}
