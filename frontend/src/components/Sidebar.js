import React from 'react';
import {
  Database,
  BookOpen,
  ShieldCheck,
  CalendarClock,
  Wrench,
  Bell,
  Settings,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ currentTab, setTab }) => {
  const menuItems = [
    {
      section: 'General',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
      ],
    },
    {
      section: 'Facilities',
      items: [
        { id: 'catalogue', icon: BookOpen, label: 'Resource Catalogue' },
        { id: 'admin', icon: ShieldCheck, label: 'Facilities & Assets' },
      ],
    },
    {
      section: 'Operations',
      items: [
        { id: 'my-bookings', icon: CalendarClock, label: 'My Bookings', tag: 'Client' },
        { id: 'admin-bookings', icon: CalendarClock, label: 'Admin Bookings', tag: 'Admin' },
        { id: 'maintenance', icon: Wrench, label: 'Maintenance' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
      ],
    },
    {
      section: 'System',
      items: [
        { id: 'settings', icon: Settings, label: 'Settings' },
      ],
    },
  ];

  const tagColors = {
    Client: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
    Admin: { bg: 'rgba(244,63,94,0.12)', color: '#f43f5e' },
  };

  return (
    <div className="sidebar">
      {/* ── Brand ─────────────────────────────────────────────── */}
      <div className="sidebar-header">
        <div className="logo-icon">
          <Database size={24} />
        </div>
        <div>
          <h1 className="brand-name">SmartCampus</h1>
          <p className="brand-sub">Ops Portal</p>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────────── */}
      <nav className="nav-menu" style={{ gap: 0 }}>
        {menuItems.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: '1.5rem' }}>
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--text-dim)',
                padding: '0 1rem',
                marginBottom: '0.5rem',
              }}
            >
              {section}
            </p>
            {items.map(({ id, icon: Icon, label, tag }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`nav-item ${currentTab === id ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span className="label" style={{ flex: 1 }}>{label}</span>
                {tag && (
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '50px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      ...tagColors[tag],
                    }}
                  >
                    {tag}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Footer ────────────────────────────────────────────── */}
      <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        <button
          className="nav-item"
          style={{
            background: 'rgba(244, 63, 94, 0.05)',
            color: '#f43f5e',
            border: '1px solid rgba(244, 63, 94, 0.1)'
          }}
          onClick={() => { if (window.confirm('Are you sure you want to sign out?')) window.location.reload(); }}
        >
          <LogOut size={18} />
          <span className="label">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
