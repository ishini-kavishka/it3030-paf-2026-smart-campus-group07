import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import CataloguePage from './pages/CataloguePage';
import DashboardOverview from './pages/DashboardOverview';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import SettingsPage from './pages/SettingsPage';
import SignUpPage from './pages/SignUpPage';

// ─── Placeholder pages for sidebar items that belong to other members ─────────
const ComingSoon = ({ title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
    <div style={{ width: 64, height: 64, borderRadius: '1.5rem', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '2rem' }}>🔧</span>
    </div>
    <h2 className="text-white font-bold" style={{ fontSize: '1.5rem' }}>{title}</h2>
    <p className="text-muted text-sm">This module is being built by another team member.</p>
  </div>
);

const renderPage = (tab, setTab, currentUser, setCurrentUser, theme, setTheme) => {
  switch (tab) {
    case 'home': 
      return <HomePage user={currentUser} onNavigate={setTab} />;
    case 'login': 
      return <LoginPage 
        onNavigate={setTab} 
        onLogin={(user) => { setCurrentUser(user); setTab('dashboard'); }} 
      />;
    case 'signup': 
      return <SignUpPage 
        onNavigate={setTab} 
        onLogin={(user) => { setCurrentUser(user); setTab('dashboard'); }} 
      />;
    case 'dashboard': 
      if (currentUser?.role === 'admin') {
        return <AdminDashboard user={currentUser} onNavigate={setTab} />;
      }
      return currentUser && currentUser.role === 'student' ? 
        <UserDashboardPage user={currentUser} onNavigate={setTab} /> : 
        <DashboardOverview />;
    case 'catalogue': return <CataloguePage setTab={setTab} />;
    case 'admin': return <AdminDashboard />;
    case 'my-bookings': return <MyBookingsPage />;
    case 'admin-bookings': return <AdminBookingsPage />;
    case 'maintenance': return <ComingSoon title="Maintenance & Incident Ticketing" />;
    case 'notifications': return <ComingSoon title="Notifications" />;
    case 'settings': 
      return <SettingsPage 
        user={currentUser} 
        onChangeUser={setCurrentUser} 
        onLogout={() => { setCurrentUser(null); setTab('home'); }}
        onNavigate={setTab} 
        theme={theme}
        setTheme={setTheme}
      />;
    default: return <DashboardOverview />;
  }
};

function App() {
  const [currentTab, setTab] = useState('home');
  const [userRole, setUserRole] = useState('visitor');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Initialize Theme State
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'dark');

  // Sync Global Theme Document Root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Sync role if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUserRole(currentUser.role === 'admin' ? 'admin' : 'student');
    } else {
      setUserRole('visitor');
    }
  }, [currentUser]);

  return (
    <div className={`app-layout role-${userRole}`}>
      {currentTab !== 'home' && currentTab !== 'login' && currentTab !== 'signup' && (
        <Sidebar currentTab={currentTab} setTab={setTab} userRole={userRole} />
      )}

      <div className="content-wrapper">
        {currentTab !== 'login' && currentTab !== 'signup' && (
          <Header
            currentTab={currentTab}
            onNavigate={setTab}
            userRole={userRole}
            setUserRole={setUserRole} // Note: Keeping manual toggling for presentation testing purposes if any
          />
        )}

        <main className="main-view animate-in">
          {renderPage(currentTab, setTab, currentUser, setCurrentUser, theme, setTheme)}
        </main>

        {currentTab !== 'login' && currentTab !== 'signup' && <Footer />}
      </div>
    </div>
  );
}

export default App;
