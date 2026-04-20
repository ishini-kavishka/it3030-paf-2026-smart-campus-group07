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
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.substring(1) || 'home';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = currentTab === 'home';
  
  const username = user ? user.name || user.username : 'Guest';
  const roleDisplay = user ? (user.role === 'ROLE_ADMIN' ? 'System Administrator' : 'Campus Member') : 'Unauthenticated';

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

  const nav = (path) => {
    navigate(`/${path}`);
    setMobileMenuOpen(false);
  };

  const mobileLinks = [
    { label: 'Home', tab: 'home', icon: <LayoutDashboard size={18} /> },
    { label: 'Catalogue', tab: 'catalogue', icon: <BookOpen size={18} /> },
    { label: 'Booking', tab: 'booking', icon: <Calendar size={18} /> },
    ...(user ? [{ label: 'My Bookings', tab: 'my-bookings', icon: <Calendar size={18} /> }] : []),
    ...(user?.role === 'ROLE_ADMIN' ? [
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
              <div className="header-logo" onClick={() => nav('home')}>
                <div className="logo-icon-sm">
                  <Database size={22} />
                </div>
                <span className="brand-name">SmartCampus</span>
              </div>
            ) : (
              <div className="header-logo" onClick={() => nav('home')} style={{ cursor: 'pointer' }}>
                <div className="logo-icon-sm">
                  <Database size={20} />
                </div>
                <div className="header-breadcrumb">
                  <span className="breadcrumb-parent">Console</span>
                  <ChevronRight size={16} className="breadcrumb-sep" />
                  <h2 className="header-page-title">{getPageTitle(currentTab)}</h2>
                </div>
              </div>
            )}
          </div>

          {/* ── Center: Search ── */}
          <div className="header-center hide-mobile">
            {isHome ? (
              <nav className="header-nav">
                <button onClick={() => nav('catalogue')}>Catalogue</button>
                <button className={currentTab === 'booking' ? 'active-nav' : ''} onClick={() => nav('booking')}>
                  Booking
                </button>
                {user && (
                    <button className={currentTab === 'dashboard' ? 'active-nav' : ''} onClick={() => nav('dashboard')}>
                      Dashboard
                    </button>
                )}
                {user?.role === 'ROLE_ADMIN' && <button onClick={() => nav('admin')}>Admin Hub</button>}
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

          {/* ── Right: Actions / Auth ── */}
          <div className="header-right">
            {!isHome && (
              <div className="header-date hide-mobile" style={{marginRight: '1rem'}}>
                <Calendar size={16} />
                <span>{today}</span>
              </div>
            )}

            <div className="flex items-center gap-4">
              {!user ? (
                  <div className="flex items-center gap-3">
                      <Link to="/login" className="text-gray-600 font-medium hover:text-[#534AB7] px-2 transition-colors">Log In</Link>
                      <Link to="/signup" className="text-sm font-medium bg-[#534AB7] text-[#ffffff] px-4 py-2 rounded-xl hover:bg-[#3C3489] transition-colors whitespace-nowrap shadow-sm">Sign Up</Link>
                  </div>
              ) : (
                  <>
                      <button className="header-action-btn" title="View Alerts" onClick={() => nav('notifications')}>
                        <div className="notification-ping" />
                        <Bell size={20} />
                      </button>
        
                      <div className="header-user hide-mobile" onClick={() => nav('settings')} style={{ cursor: 'pointer' }}>
                        <div className="user-details text-right">
                          <span className="name block text-sm font-bold">{username}</span>
                          <span className="role block text-xs text-gray-500">{roleDisplay}</span>
                        </div>
                        <div className="user-avatar bg-[#EEEDFE] w-10 h-10 rounded-full flex items-center justify-center text-[#534AB7]">
                          <User size={20} />
                        </div>
                      </div>
                  </>
              )}

              {/* Mobile Hamburger */}
              <button
                className="mobile-menu-btn block md:hidden"
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
        <div className="mobile-nav-drawer absolute w-full bg-white shadow-lg z-50">
          <div className="mobile-nav-user p-4 border-b">
            {user ? (
               <div className="flex items-center gap-3">
                    <div className="user-avatar bg-[#EEEDFE] w-12 h-12 rounded-full flex items-center justify-center text-[#534AB7]">
                        <User size={22} />
                    </div>
                    <div>
                        <div className="font-bold">{username}</div>
                        <div className="text-xs text-gray-500">{roleDisplay}</div>
                    </div>
               </div>
            ) : (
               <div className="flex flex-col gap-2">
                    <button onClick={() => nav('login')} className="w-full text-center py-2 bg-gray-100 rounded-lg font-medium">Log In</button>
                    <button onClick={() => nav('signup')} className="w-full text-center py-2 bg-[#534AB7] text-white rounded-lg font-medium">Sign Up</button>
               </div>
            )}
          </div>

          <nav className="mobile-nav-links p-2 flex flex-col gap-1">
            {mobileLinks.map(link => (
              <button
                key={link.tab}
                className={`flex items-center gap-3 p-3 rounded-lg w-full text-left font-medium ${currentTab === link.tab ? 'bg-[#EEEDFE] text-[#534AB7]' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => nav(link.tab)}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
