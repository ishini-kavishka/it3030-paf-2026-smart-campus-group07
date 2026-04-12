import React, { useState } from 'react';
import {
  Search,
  Bell,
  User,
  Calendar,
  Database,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  Settings,
  Wrench
} from 'lucide-react';

const Header = ({ currentTab, onNavigate, userRole, setUserRole }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = currentTab === 'home';
  const username = userRole === 'admin' ? 'Admin Controller' : 'Ishini Kavishka';
  const roleDisplay = userRole === 'admin' ? 'System Administrator' : 'Campus Member';

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
      'my-bookings': 'My Bookings',
      bookings: 'Booking Management',
      maintenance: 'Maintenance & Service',
      notifications: 'Alert Center',
      settings: 'System Settings'
    };
    return titles[tab] || 'Dashboard';
  };

  const toggleRole = () => {
    const newRole = userRole === 'admin' ? 'client' : 'admin';
    setUserRole(newRole);
    if (newRole === 'client' && (currentTab === 'admin' || currentTab === 'dashboard')) {
      onNavigate('home');
    }
    setMobileMenuOpen(false);
  };

  const navigate = (tab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  // Mobile menu items — filtered by role
  const mobileLinks = [
    { label: 'Home', tab: 'home', icon: <LayoutDashboard size={18} /> },
    { label: 'Catalogue', tab: 'catalogue', icon: <BookOpen size={18} /> },
    { label: 'My Bookings', tab: 'my-bookings', icon: <Calendar size={18} /> },
    ...(userRole === 'admin' ? [
      { label: 'Dashboard', tab: 'dashboard', icon: <LayoutDashboard size={18} /> },
      { label: 'Admin Hub', tab: 'admin', icon: <Settings size={18} /> },
      { label: 'Maintenance', tab: 'maintenance', icon: <Wrench size={18} /> },
    ] : []),
  ];

  return (
    <>
      <header className={`app-header ${isHome ? 'header-home' : 'header-app'}`}>
        <div className="header-container">

          {/* ── Left: Logo or Breadcrumb ── */}
          <div className="header-left">
            {isHome ? (
              <div className="header-logo" onClick={() => navigate('home')}>
                <div className="logo-icon-sm">
                  <Database size={20} />
                </div>
                <span className="brand-name">SmartCampus</span>
              </div>
            ) : (
              <div className="header-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
                <div className="logo-icon-sm">
                  <Database size={18} />
                </div>
                <div className="header-breadcrumb">
                  <span className="breadcrumb-parent">Console</span>
                  <ChevronRight size={14} className="breadcrumb-sep" />
                  <h2 className="header-page-title">{getPageTitle(currentTab)}</h2>
                </div>
              </div>
            )}
          </div>

          {/* ── Center: Nav Links (Home) or Search (App) ── */}
          <div className="header-center hide-mobile">
            {isHome ? (
              <nav className="header-nav">
                <button onClick={() => navigate('catalogue')}>Catalogue</button>
                {userRole === 'admin' && <button onClick={() => navigate('dashboard')}>Dashboard</button>}
                {userRole === 'admin' && <button onClick={() => navigate('admin')}>Admin Hub</button>}
              </nav>
            ) : (
              <div className="header-search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Find resources, documents..."
                  className="search-input"
                />
              </div>
            )}
          </div>

          {/* ── Right: Actions ── */}
          <div className="header-right">
            {!isHome && (
              <div className="header-date hide-mobile">
                <Calendar size={16} />
                <span>{today}</span>
              </div>
            )}

            <div className="header-actions">
              {/* Role Switcher */}
              <button
                className={`role-toggle-btn ${userRole}`}
                onClick={toggleRole}
                title={`Switch to ${userRole === 'admin' ? 'Client' : 'Admin'} View`}
              >
                <div className="toggle-dot" />
                <span className="hide-mobile">{userRole.toUpperCase()}</span>
              </button>

              <button className="header-action-btn" title="View Alerts">
                <div className="notification-ping" />
                <Bell size={20} />
              </button>

              <div className="header-user hide-mobile">
                <div className="user-details">
                  <span className="name">{username}</span>
                  <span className="role">{roleDisplay}</span>
                </div>
                <div className="user-avatar">
                  <User size={20} />
                </div>
              </div>

              {/* Mobile Hamburger */}
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ── Mobile Slide-Down Menu ── */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-user">
            <div className="user-avatar" style={{ width: 44, height: 44 }}>
              <User size={22} />
            </div>
            <div>
              <div className="mobile-nav-name">{username}</div>
              <div className="mobile-nav-role">{roleDisplay}</div>
            </div>
          </div>

          <nav className="mobile-nav-links">
            {mobileLinks.map(link => (
              <button
                key={link.tab}
                className={`mobile-nav-item ${currentTab === link.tab ? 'active' : ''}`}
                onClick={() => navigate(link.tab)}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>

          <div className="mobile-nav-footer">
            <button className="role-toggle-btn-full" onClick={toggleRole}>
              <div className={`toggle-dot ${userRole}`} />
              Switch to {userRole === 'admin' ? 'Client' : 'Admin'} View
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
