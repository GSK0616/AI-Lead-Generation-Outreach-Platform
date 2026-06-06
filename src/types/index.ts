export interface User {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  avatar_url: string;
  role: 'admin' | 'customer';
  subscription_plan: 'starter' | 'pro' | 'agency';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  subscription_end_date: string;
  total_leads_generated: number;
  monthly_leads_used: number;
  api_key: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  company_name: string;
  website: string;
  industry: string;
  employee_count: number;
  annual_revenue: number;
  location_city: string;
  location_state: string;
  location_country: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
  contact_job_title: string;
  linkedin_url: string;
  company_linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  lead_score: number; // 1-100
  lead_quality: 'hot' | 'warm' | 'cold';
  ai_reasoning: string;
  tags: string[];
  notes: string;
  status: 'new' | 'contacted' | 'replied' | 'meeting_scheduled' | 'proposal_sent' | 'won' | 'lost';
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description: string;
  campaign_type: 'email' | 'linkedin' | 'multi-channel';
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  total_leads: number;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  replied_count: number;
  scheduled_for: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignLead {
  id: string;
  campaign_id: string;
  lead_id: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied';
  sent_at: string;
  opened_at: string;
  clicked_at: string;
  replied_at: string;
  reply_content: string;
}

export interface PersonalizedMessage {
  id: string;
  lead_id: string;
  message_type: 'cold_email' | 'linkedin_message' | 'instagram_dm' | 'whatsapp';
  subject_line: string;
  message_content: string;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  user_id: string;
  lead_id: string;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_type: 'zoom' | 'google_meet' | 'phone' | 'in_person';
  meeting_url: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'new_lead' | 'reply' | 'meeting_booked' | 'campaign_completed';
  title: string;
  message: string;
  related_id: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_leads_generated: number;
  active_campaigns: number;
  emails_sent: number;
  response_rate: number;
  conversion_rate: number;
  revenue_generated: number;
  monthly_growth: number;
}

export interface LeadSearchFilters {
  industry: string;
  city: string;
  state: string;
  country: string;
  company_size: string;
  revenue_range: string;
  job_title: string;
  keywords: string;
}
