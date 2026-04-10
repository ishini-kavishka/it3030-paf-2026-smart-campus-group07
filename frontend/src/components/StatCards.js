import React from 'react';
import { Box, CheckCircle2, XCircle, Users } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <div className="glass-card stat-item animate-in" style={{ animationDelay: `${delay}ms` }}>
    <div className="stat-info">
      <h4>{label}</h4>
      <p className="value">{value}</p>
    </div>
    <div className="stat-icon" style={{ background: `${color}15`, color: color }}>
      <Icon size={24} />
    </div>
  </div>
);

const StatCards = ({ stats }) => {
  const items = [
    { label: 'Total Resources', value: stats.total, icon: Box, color: '#6366f1', delay: 100 },
    { label: 'Active Services', value: stats.active, icon: CheckCircle2, color: '#10b981', delay: 200 },
    { label: 'Out of Service', value: stats.oos, icon: XCircle, color: '#f43f5e', delay: 300 },
    { label: 'Avg Capacity', value: stats.avgCapacity, icon: Users, color: '#0ea5e9', delay: 400 },
  ];

  return (
    <div className="stats-grid">
      {items.map((item, idx) => (
        <StatCard key={idx} {...item} />
      ))}
    </div>
  );
};

export default StatCards;
