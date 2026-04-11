import React from 'react';
import {
  Search,
  Bell,
  User,
  Calendar,
  Database,
  Menu,
  ChevronRight
} from 'lucide-react';

const Header = ({ currentTab, onNavigate, username = 'Admin User', role = 'Member 1' }) => {
  const isHome = currentTab === 'home';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getPageTitle = (tab) => {
    const titles = {
      home: 'Portal Home',
      dashboard: 'Dashboard Overview',
      catalogue: 'Resource Catalogue',
      admin: 'Facilities & Assets',
      bookings: 'Booking Management',
      maintenance: 'Maintenance & Service',
      notifications: 'Alert Center',
      settings: 'System Settings'
    };
    return titles[tab] || 'Dashboard';
  };

  return (
    <header className={`app-header ${isHome ? 'header-home' : 'header-app'}`}>
      <div className="header-container">

        {/* ── Left Side: Logo (Home) or Title (App) ── */}
        <div className="header-left">
          {isHome ? (
            <div className="header-logo" onClick={() => onNavigate('home')}>
              <div className="logo-icon-sm">
                <Database size={20} />
              </div>
              <span className="brand-name">SmartCampus</span>
            </div>
          ) : (
            <div className="header-breadcrumb">
              <span className="breadcrumb-parent">Console</span>
              <ChevronRight size={14} className="breadcrumb-sep" />
              <h2 className="header-page-title">{getPageTitle(currentTab)}</h2>
            </div>
          )}
        </div>

        {/* ── Center: Search (App) or Nav Links (Home) ── */}
        <div className="header-center">
          {isHome ? (
            <nav className="header-nav hide-mobile">
              <button onClick={() => onNavigate('catalogue')}>Catalogue</button>
              <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
              <button onClick={() => onNavigate('admin')}>Admin Hub</button>
            </nav>
          ) : (
            <div className="header-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Find resources, documents, or members..."
                className="search-input"
              />
            </div>
          )}
        </div>

        {/* ── Right Side: Date & Actions ── */}
        <div className="header-right">
          {!isHome && (
            <div className="header-date hide-mobile">
              <Calendar size={16} />
              <span>{today}</span>
            </div>
          )}

          <div className="header-actions">
            <button className="header-action-btn" title="View Alerts">
              <div className="notification-ping" />
              <Bell size={20} />
            </button>

            <div className="header-user">
              <div className="user-details hide-mobile">
                <span className="name">{username}</span>
                <span className="role">{role}</span>
              </div>
              <div className="user-avatar">
                <User size={20} />
              </div>
            </div>

            <button className="mobile-menu-btn show-mobile">
              <Menu size={24} />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
