'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ProtectedLayout from '@/components/ProtectedLayout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Plus, Download, Filter, Search, Send, Eye } from 'lucide-react';

export default function CampaignsPage() {
  const [selectedCampaign, setSelectedCampaign] = React.useState<string | null>(null);

  const campaigns = [
    {
      id: '1',
      name: 'Q2 Tech Outreach',
      type: 'email',
      status: 'active',
      total_leads: 250,
      sent: 180,
      opened: 54,
      replied: 12,
      conversion_rate: 4.8,
      created_at: '2024-06-01',
    },
    {
      id: '2',
      name: 'LinkedIn B2B Initiative',
      type: 'linkedin',
      status: 'scheduled',
      total_leads: 150,
      sent: 0,
      opened: 0,
      replied: 0,
      conversion_rate: 0,
      created_at: '2024-06-02',
    },
    {
      id: '3',
      name: 'Financial Services Cold Email',
      type: 'email',
      status: 'completed',
      total_leads: 500,
      sent: 500,
      opened: 175,
      replied: 35,
      conversion_rate: 7.0,
      created_at: '2024-05-15',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400';
      case 'completed':
        return 'bg-slate-500/20 text-slate-400';
      case 'draft':
        return 'bg-slate-600/20 text-slate-300';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <ProtectedLayout>
      <div className="flex h-screen bg-slate-950">
        <Sidebar />
        <div className="flex-1 lg:ml-64 overflow-auto">
          <TopBar />
          <main className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
                <p className="text-slate-400">Create and manage outreach campaigns</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus size={18} />
                New Campaign
              </Button>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="glass-dark p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                  onClick={() => setSelectedCampaign(campaign.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{campaign.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <span className="text-sm text-slate-400">{campaign.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <Eye size={18} className="text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <Send size={18} className="text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Total Leads</span>
                      <span className="text-white font-semibold">{campaign.total_leads}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Sent</span>
                      <span className="text-white font-semibold">{campaign.sent}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Opened</span>
                      <span className="text-white font-semibold">{campaign.opened}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Replied</span>
                      <span className="text-white font-semibold">{campaign.replied}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Conversion Rate</span>
                        <span className="text-cyan-400 font-semibold">{campaign.conversion_rate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </ProtectedLayout>
  );
}
