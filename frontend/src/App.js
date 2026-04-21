import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import CataloguePage from './pages/CataloguePage';
// import DashboardOverview from './pages/DashboardOverview';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import SettingsPage from './pages/SettingsPage';
import ViewProfilePage from './pages/ViewProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import { useAuth } from './context/AuthContext';

const ComingSoon = ({ title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
    <div style={{ width: 64, height: 64, borderRadius: '1.5rem', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '2rem' }}>🔧</span>
    </div>
    <h2 className="text-white font-bold" style={{ fontSize: '1.5rem' }}>{title}</h2>
    <p className="text-muted text-sm">This module is being built by another team member.</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'ROLE_ADMIN') return <Navigate to="/dashboard" replace />;
    return children;
};

const Layout = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();
    const isHome = location.pathname === '/' || location.pathname === '/home';
    const isLogin = location.pathname === '/login';
    const isSignup = location.pathname === '/signup';

    // Disable sidebar/navbar elements on strictly standalone pages like login
    if (isLogin || isSignup) {
        return <>{children}</>;
    }

    return (
        <div className={`app-layout role-${user?.role || 'client'}`}>
            {!isHome && user?.role === 'ROLE_ADMIN' && <Sidebar currentTab={location.pathname.substring(1)} setTab={() => {}} userRole={user?.role || 'client'} />}
            
            <div className="content-wrapper">
                <Header currentTab={location.pathname.substring(1)} onNavigate={() => {}} userRole={user?.role || 'client'} setUserRole={() => {}} />
                
                <main className="main-view animate-in">
                    {children}
                </main>
                
                {isHome && <Footer />}
            </div>
        </div>
    );
};

function App() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || import.meta.env?.VITE_GOOGLE_CLIENT_ID || "111206311022-2cbq7i20jd0c7e555iiafkuje7ovn3h6.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage onNavigate={() => {}} />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/catalogue" element={<CataloguePage setTab={() => {}} />} />
          <Route path="/booking" element={<BookingPage setTab={() => {}} />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ViewProfilePage /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage setTab={() => {}} /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin-bookings" element={<AdminRoute><AdminBookingsPage /></AdminRoute>} />
          <Route path="/maintenance" element={<AdminRoute><ComingSoon title="Maintenance & Incident Ticketing" /></AdminRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
