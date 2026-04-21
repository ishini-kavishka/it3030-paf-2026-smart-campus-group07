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
                <div className="logo-icon-sm bg-white overflow-hidden p-0.5 rounded-lg border border-gray-100">
                  <img src="/logo.png" alt="Smart Campus" className="w-full h-full object-contain" />
                </div>
                <span className="brand-name">SmartCampus</span>
              </div>
            ) : (
              <div className="header-logo" onClick={() => nav('home')} style={{ cursor: 'pointer' }}>
                <div className="logo-icon-sm bg-white overflow-hidden p-0.5 rounded-lg border border-gray-100">
                  <img src="/logo.png" alt="Smart Campus" className="w-full h-full object-contain" />
                </div>
                <div className="header-breadcrumb">
                  <span className="breadcrumb-parent font-['Outfit'] font-bold tracking-tight text-gray-800">SmartCampus</span>
                  <ChevronRight size={16} className="breadcrumb-sep text-gray-400" />
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
              <div className="hidden md:flex items-center gap-2 bg-[#EEEDFE] text-[#534AB7] px-4 py-1.5 rounded-full font-bold text-[0.85rem] mr-4 shadow-sm border border-[#534AB7]/20">
                <Calendar size={15} />
                <span className="tracking-wide uppercase">{today}</span>
              </div>
            )}

            <div className="flex items-center gap-4">
              {!user ? (
                  <div className="flex items-center gap-4">
                      <Link to="/login" className="text-[0.9rem] font-bold text-[#534AB7] hover:text-[#3C3489] px-4 py-2 rounded-lg bg-[#534AB7]/10 hover:bg-[#534AB7]/20 transition-all">Log In</Link>
                      <Link to="/signup" className="text-[0.9rem] font-bold bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all whitespace-nowrap">Sign Up</Link>
                  </div>
              ) : (
                  <>
                      <div className="flex items-center gap-2 mr-2">
                        <button className="relative p-2.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-[#534AB7] transition-all" title="System Settings" onClick={() => nav('settings')}>
                          <Settings size={20} />
                        </button>
                        <button className="relative p-2.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-[#534AB7] transition-all" title="View Alerts" onClick={() => nav('notifications')}>
                          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                          <Bell size={20} />
                        </button>
                      </div>
        
                      <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity hide-mobile" onClick={() => nav('dashboard')}>
                        <div className="user-details text-right">
                          <span className="block text-[0.9rem] font-extrabold text-gray-900">{username}</span>
                          <span className="block text-[0.65rem] font-bold tracking-widest text-[#534AB7] uppercase">{roleDisplay}</span>
                        </div>
                        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gray-100 border-2 border-[#534AB7] overflow-hidden shadow-sm">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={username} className="w-full h-full object-cover" />
                          ) : (
                            <User size={20} className="text-[#534AB7]" />
                          )}
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
