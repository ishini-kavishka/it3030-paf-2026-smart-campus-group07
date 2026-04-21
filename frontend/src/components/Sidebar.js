import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  CalendarClock,
  Wrench,
  Bell,
  Settings,
  LayoutDashboard,
  Home,
  LogOut
} from 'lucide-react';

const Sidebar = ({ currentTab, setTab, userRole }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      section: 'General',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
      ],
    },
    ...(userRole === 'ROLE_ADMIN' ? [
      {
        section: 'Facilities',
        items: [
          { id: 'admin', icon: ShieldCheck, label: 'Facilities & Assets' },
        ],
      },
      {
        section: 'Operations',
        items: [
          { id: 'admin-bookings', icon: CalendarClock, label: 'Admin Bookings' },
          { id: 'maintenance', icon: Wrench, label: 'Maintenance' },
          { id: 'notifications', icon: Bell, label: 'Notifications' },
        ],
      }
    ] : [
      {
        section: 'My Activities',
        items: [
          { id: 'my-bookings', icon: CalendarClock, label: 'My Bookings' },
          { id: 'maintenance', icon: Wrench, label: 'My Incidents' },
          { id: 'notifications', icon: Bell, label: 'Notifications' },
        ],
      }
    ]),
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
        <div className="logo-icon-sm bg-white overflow-hidden rounded-xl border border-gray-100 shadow-sm" style={{ width: '42px', height: '42px', padding: '4px', flexShrink: 0 }}>
          <img src="/logo.png" alt="SmartCampus" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                onClick={() => navigate(`/${id}`)}
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
      <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          className="nav-item"
          style={{
            background: 'rgba(244, 63, 94, 0.05)',
            color: '#f43f5e',
            border: '1px solid rgba(244, 63, 94, 0.1)'
          }}
          onClick={() => { 
             logout();
             navigate('/');
          }}
        >
          <LogOut size={18} />
          <span className="label">Log Out</span>
        </button>

        <button
          className="nav-item"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
          onClick={() => navigate('/')}
        >
          <Home size={18} />
          <span className="label">Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
