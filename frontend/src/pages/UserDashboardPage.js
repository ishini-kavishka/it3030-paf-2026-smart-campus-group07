import React from 'react';
import { Calendar, Settings, Bell, User, Clock, ArrowRight } from 'lucide-react';

const UserDashboardPage = ({ user, onNavigate }) => {
  if (!user) return null;

  const quickLinks = [
    {
      id: 'my-bookings',
      title: 'My Bookings',
      desc: 'View your upcoming and past reservations',
      icon: Calendar,
      color: '#10b981'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      desc: 'Check recent updates and alerts',
      icon: Bell,
      color: '#a855f7'
    },
    {
      id: 'settings',
      title: 'Account Settings',
      desc: 'Update your profile and preferences',
      icon: Settings,
      color: '#6366f1'
    }
  ];

  return (
    <div className="section-container animate-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, {user.name}! 👋</h1>
        <p className="text-muted text-lg">Manage your smart campus experience from your personal command center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 flex flex-col justify-between" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <User size={20} />
            </div>
            <h3 className="text-white font-bold text-xl mb-1">Your Profile</h3>
            <p className="text-muted text-sm">{user.email}</p>
            <p className="text-dim text-xs uppercase tracking-widest mt-2 font-bold">Role: {user.role}</p>
          </div>
          <button onClick={() => onNavigate('settings')} className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1 mt-6">
            View Profile <ArrowRight size={16} />
          </button>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between" style={{ borderLeft: '4px solid #10b981' }}>
          <div>
            <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
              <Calendar size={20} />
            </div>
            <h3 className="text-white font-bold text-xl mb-1">Active Bookings</h3>
            <p className="text-muted text-sm">You have no upcoming reservations today.</p>
          </div>
          <button onClick={() => onNavigate('my-bookings')} className="text-green-400 hover:text-green-300 text-sm font-semibold flex items-center gap-1 mt-6">
            Go to Bookings <ArrowRight size={16} />
          </button>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div>
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mb-4">
              <Clock size={20} />
            </div>
            <h3 className="text-white font-bold text-xl mb-1">Recent Activity</h3>
            <p className="text-muted text-sm">No recent activity found.</p>
          </div>
          <button className="text-yellow-500 hover:text-yellow-400 text-sm font-semibold flex items-center gap-1 mt-6">
            Log History <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Quick Shortcuts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {quickLinks.map(link => (
          <div 
            key={link.id} 
            className="p-4 rounded-xl cursor-pointer hover:bg-surface-alt transition-colors border border-surface-border flex items-center gap-4 bg-surface"
            onClick={() => onNavigate(link.id)}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${link.color}20`, color: link.color }}>
              <link.icon size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold">{link.title}</h4>
              <p className="text-muted text-xs">{link.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboardPage;
