# LeadForge AI - Production-Ready AI Lead Generation & Outreach Platform

A modern SaaS platform that helps businesses automatically discover leads, qualify them using AI, enrich contact information, generate personalized outreach messages, and track conversions.

## Features

### Core Features
- 🔍 **Lead Discovery Engine** - Search and filter leads by industry, location, company size, and more
- 🤖 **AI Lead Qualification** - Automatic lead scoring (1-100) with hot/warm/cold classification
- 📝 **AI Personalization** - Generate custom cold emails, LinkedIn messages, Instagram DMs, and WhatsApp messages
- 📧 **Campaign Builder** - Create and manage email, LinkedIn, and multi-channel campaigns
- 📊 **Built-in CRM** - Kanban board with customizable stages (New Lead → Won)
- 📈 **Analytics Dashboard** - Real-time metrics, response rates, conversion tracking
- 💼 **Meeting Booking** - Integrated calendar with Zoom/Google Meet
- 📱 **Lead Database** - Save, tag, and export leads (CSV/Excel)

### Subscription Plans
- **Starter**: 100 leads/month - $29/mo
- **Pro**: 1,000 leads/month - $99/mo
- **Agency**: Unlimited leads - $299/mo

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Shadcn UI
- Recharts (Analytics)
- React Query (Data fetching)

### Backend
- Node.js
- Express.js
- PostgreSQL
- Supabase (Auth & Database)
- Stripe (Payments)

### Deployment
- Vercel (Frontend)
- Docker (Backend)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Supabase account
- Stripe account

### Installation

1. Clone the repository
```bash
git clone https://github.com/GSK0616/AI-Lead-Generation-Outreach-Platform.git
cd AI-Lead-Generation-Outreach-Platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your Supabase, Stripe, and OpenAI keys
```

4. Set up the database
```bash
# Run migrations via Supabase dashboard or CLI
supabase migration up
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities (Supabase, API, auth)
│   ├── pages/           # API routes
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── supabase/
│   └── migrations/      # Database migrations
├── public/              # Static assets
└── docs/               # Documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/reset-password` - Reset password

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `POST /api/leads/search` - Search leads with filters

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/launch` - Launch campaign

### AI
- `POST /api/ai/score-lead` - Score a lead
- `POST /api/ai/generate-message` - Generate personalized message
- `POST /api/ai/generate-followup` - Generate follow-up sequences

## Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run migrations from `supabase/migrations`
3. Configure authentication providers (Email, Google)
4. Set RLS policies

### Stripe Setup
1. Create product and price IDs for subscription plans
2. Set webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Add API keys to environment variables

## Documentation

See [docs/](./docs) for detailed documentation on:
- Architecture overview
- API reference
- Database schema
- Deployment guide

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details

## Support

For support, email support@leadforge.ai or open an issue on GitHub.
