import React, { useState, useEffect, useMemo } from 'react';
import { resourceService } from '../services/api';
import {
  Database,
  CalendarCheck,
  Wrench,
  Bell,
  LayoutDashboard,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const DashboardOverview = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await resourceService.getAllResources();
        setResources(data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const total = resources.length;
    const active = resources.filter(r => r.status === 'ACTIVE').length;
    return {
      totalResources: total,
      availableNow: active,
      mockBookings: 24, // Realistic mock for Member 2
      mockMaintenance: 7, // Realistic mock for Member 3
      mockNotifications: 12, // Realistic mock for Member 4
    };
  }, [resources]);

  // Mock activity data
  const activities = [
    { id: 1, type: 'facility', text: 'New Meeting Room B-204 added to catalogue', time: '10 mins ago', icon: Database, color: '#6366f1' },
    { id: 2, type: 'booking', text: 'Dr. Smith booked Auditorium for Symposium', time: '45 mins ago', icon: CalendarCheck, color: '#10b981' },
    { id: 3, type: 'alert', text: 'AC repair completed in Lab 102', time: '2 hours ago', icon: Wrench, color: '#f59e0b' },
    { id: 4, type: 'notif', text: 'Global announcement sent to all staff', time: '5 hours ago', icon: Bell, color: '#a855f7' },
  ];

  const resourceTypeCount = useMemo(() => {
    const types = {};
    resources.forEach(r => {
      const t = r.type || 'OTHER';
      types[t] = (types[t] || 0) + 1;
    });
    return Object.entries(types).sort((a, b) => b[1] - a[1]);
  }, [resources]);

  return (
    <div className="dashboard-overview animate-in">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Command Center</span>
          </div>
          <h1 className="text-white font-bold" style={{ fontSize: '2.5rem', letterSpacing: '-0.03em' }}>
            SmartCampus Overview
          </h1>
          <p className="text-muted">Welcome back. Here is what's happening on campus today.</p>
        </div>

        <div className="system-health-pill hide-mobile">
          <div className="pulse-dot" />
          <span>System Online: v2.4.0</span>
        </div>
      </div>

      {/* ── KPI Stat Grid ─────────────────────────────────────── */}
      <div className="dashboard-stats-grid mb-8">
        <div className="kpi-card glass-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
            <Database size={24} />
          </div>
          <div className="flex-1">
            <p className="kpi-label">Stored Facilities</p>
            <h3 className="kpi-value">{loading ? '...' : stats.totalResources}</h3>
            <div className="kpi-footer-text">
              <TrendingUp size={12} className="text-success" />
              <span>{stats.availableNow} currently available</span>
            </div>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
            <CalendarCheck size={24} />
          </div>
          <div className="flex-1">
            <p className="kpi-label">Active Bookings</p>
            <h3 className="kpi-value">{stats.mockBookings}</h3>
            <div className="kpi-footer-text">
              <span className="text-dim">8 occurring today</span>
            </div>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
            <Wrench size={24} />
          </div>
          <div className="flex-1">
            <p className="kpi-label">Open Tickets</p>
            <h3 className="kpi-value">{stats.mockMaintenance}</h3>
            <div className="kpi-footer-text">
              <span className="text-warning">2 high priority</span>
            </div>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>
            <Bell size={24} />
          </div>
          <div className="flex-1">
            <p className="kpi-label">Recent Alerts</p>
            <h3 className="kpi-value">{stats.mockNotifications}</h3>
            <div className="kpi-footer-text">
              <span className="text-dim">Sent to 420 recipients</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Middle Row ────────────────────────────────────────── */}
      <div className="dashboard-main-grid">
        {/* Resource Distribution Chart (Mock Viz) */}
        <div className="glass-card main-viz-card">
          <div className="flex justify-between items-center mb-6">
            <h4 className="card-title-sm">Resource Distribution</h4>
            <div className="badge badge-indigo">Inventory</div>
          </div>

          <div className="distribution-list">
            {loading ? (
              <p className="text-center py-10 text-muted">Calculating distribution...</p>
            ) : resourceTypeCount.length > 0 ? (
              resourceTypeCount.map(([type, count]) => (
                <div key={type} className="dist-item">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white font-medium uppercase tracking-wider">{type.replace(/_/g, ' ')}</span>
                    <span className="text-dim">{count} facilities</span>
                  </div>
                  <div className="progress-bg">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(count / stats.totalResources) * 100}%`,
                        background: 'linear-gradient(90deg, #6366f1, #a855f7)'
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-muted">No facility data available.</p>
            )}
          </div>

          <div className="viz-footer mt-auto pt-6 border-t border-glass">
            <div className="flex items-center gap-3 text-xs text-dim">
              <Clock size={14} />
              <span>Last inventory sync: Just now</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="glass-card main-activity-card">
          <div className="flex justify-between items-center mb-6">
            <h4 className="card-title-sm">Recent Activity</h4>
            <button className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </button>
          </div>

          <div className="activity-list">
            {activities.map(act => (
              <div key={act.id} className="activity-item">
                <div className="activity-icon" style={{ background: `${act.color}15`, color: act.color }}>
                  <act.icon size={16} />
                </div>
                <div className="activity-text">
                  <p className="text-sm text-white font-medium mb-0.5">{act.text}</p>
                  <p className="text-xs text-dim">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Operational Status ── */}
      <div className="glass-card mt-8 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-success/10 p-3 rounded-xl">
            <ShieldCheck size={28} className="text-success" />
          </div>
          <div>
            <h4 className="text-white font-bold">Campus Operations Healthy</h4>
            <p className="text-xs text-dim">All key systems are within normal operational parameters. No critical outages reported.</p>
          </div>
        </div>
        <button className="btn btn-ghost" style={{ gap: '0.5rem' }}>
          <Zap size={16} className="text-warning" />
          Run Diagnostics
        </button>
      </div>
    </div>
  );
};

export default DashboardOverview;
