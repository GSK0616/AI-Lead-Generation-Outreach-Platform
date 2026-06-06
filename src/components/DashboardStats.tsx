'use client';

import React from 'react';
import { ArrowUpRight, Users, Mail, TrendingUp, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  color: 'cyan' | 'blue' | 'green' | 'purple';
}

const colorClasses = {
  cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
  blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
  green: 'from-green-500/20 to-green-500/5 border-green-500/30',
  purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
};

function StatCard({ title, value, icon, change, color }: StatCardProps) {
  return (
    <div className={`glass-dark bg-gradient-to-br ${colorClasses[color]} p-6 border rounded-xl`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
          {change && (
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight size={16} />
              <span>{change}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Leads Generated"
        value="2,543"
        icon={<Users size={24} />}
        change={23}
        color="cyan"
      />
      <StatCard
        title="Active Campaigns"
        value="8"
        icon={<Mail size={24} />}
        change={5}
        color="blue"
      />
      <StatCard
        title="Response Rate"
        value="24.5%"
        icon={<TrendingUp size={24} />}
        change={8}
        color="green"
      />
      <StatCard
        title="Revenue Generated"
        value="$18,540"
        icon={<DollarSign size={24} />}
        change={12}
        color="purple"
      />
    </div>
  );
}
