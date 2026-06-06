'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const chartData = [
  { month: 'Jan', leads: 120, sent: 80, replies: 20 },
  { month: 'Feb', leads: 240, sent: 160, replies: 45 },
  { month: 'Mar', leads: 380, sent: 280, replies: 98 },
  { month: 'Apr', leads: 520, sent: 390, replies: 165 },
  { month: 'May', leads: 680, sent: 520, replies: 245 },
  { month: 'Jun', leads: 850, sent: 680, replies: 320 },
];

const conversionData = [
  { name: 'Hot Leads', value: 45 },
  { name: 'Warm Leads', value: 35 },
  { name: 'Cold Leads', value: 20 },
];

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6'];

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart - Leads Over Time */}
      <div className="glass-dark p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Lead Generation Trend</h3>
          <TrendingUp className="text-cyan-500" size={20} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line type="monotone" dataKey="leads" stroke="#06b6d4" strokeWidth={2} />
            <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="replies" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Campaign Performance */}
      <div className="glass-dark p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Campaign Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="sent" stackId="a" fill="#3b82f6" />
            <Bar dataKey="replies" stackId="a" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Lead Quality Distribution */}
      <div className="glass-dark p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Lead Quality Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={conversionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {conversionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
