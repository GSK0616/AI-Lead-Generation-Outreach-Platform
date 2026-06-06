export interface LeadData {
  company_name: string;
  website?: string;
  industry?: string;
  employee_count?: number;
  annual_revenue?: number;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_job_title?: string;
  linkedin_url?: string;
  company_linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface AIScoreResult {
  score: number;
  quality: 'hot' | 'warm' | 'cold';
  reasoning: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  campaign_type: 'email' | 'linkedin' | 'multi-channel';
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  total_leads: number;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  replied_count: number;
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  timestamp: string;
  data: Record<string, any>;
}
