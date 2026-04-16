import React, { useState } from 'react';
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
import BookingPage from './pages/BookingPage';

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

const renderPage = (tab, setTab) => {
  switch (tab) {
    case 'home': return <HomePage onNavigate={setTab} />;
    case 'dashboard': return <DashboardOverview />;
    case 'catalogue': return <CataloguePage setTab={setTab} />;
    case 'admin': return <AdminDashboard />;
    case 'my-bookings': return <MyBookingsPage setTab={setTab} />;
    case 'booking': return <BookingPage setTab={setTab} />;
    case 'admin-bookings': return <AdminBookingsPage />;
    case 'maintenance': return <ComingSoon title="Maintenance & Incident Ticketing" />;
    case 'notifications': return <ComingSoon title="Notifications" />;
    case 'settings': return <ComingSoon title="Settings" />;
    default: return <DashboardOverview />;
  }
};

function App() {
  const [currentTab, setTab] = useState('home');
  const [userRole, setUserRole] = useState('admin');


  return (
    <div className={`app-layout role-${userRole}`}>
      {currentTab !== 'home' && (
        <Sidebar currentTab={currentTab} setTab={setTab} userRole={userRole} />
      )}

      <div className="content-wrapper">
        <Header
          currentTab={currentTab}
          onNavigate={setTab}
          userRole={userRole}
          setUserRole={setUserRole}
        />

        <main className="main-view animate-in">
          {renderPage(currentTab, setTab)}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
