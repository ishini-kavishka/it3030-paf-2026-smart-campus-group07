import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Wrench,
  Bell,
  ShieldCheck,
  Zap,
  Layout,
  Search,
  LogIn,
  UserPlus
} from 'lucide-react';

const HomePage = ({ user, onNavigate }) => {
  const modules = [
    {
      id: 'catalogue',
      title: 'Facility Catalogue',
      desc: 'Browse and explore all bookable facilities, from lecture halls to specialized labs.',
      icon: BookOpen,
      color: '#6366f1',
      member: 'Member 1',
      features: ['Search & Filters', 'Metadata Tracking', 'Status Awareness']
    },
    {
      id: 'bookings',
      title: 'Booking Engine',
      desc: 'Smart scheduling system with conflict detection and automated approval workflows.',
      icon: Calendar,
      color: '#10b981',
      member: 'Member 2',
      features: ['Conflict Checking', 'Workflow: Pending/Approved', 'My Bookings']
    },
    {
      id: 'maintenance',
      title: 'Incident Ticketing',
      desc: 'Report and track campus maintenance issues. Technician assignment and updates.',
      icon: Wrench,
      color: '#f59e0b',
      member: 'Member 3',
      features: ['Image Attachments', 'Priority Levels', 'Comment System']
    },
    {
      id: 'notifications',
      title: 'Alert Center',
      desc: 'Stay informed with real-time updates on booking approvals and ticket status.',
      icon: Bell,
      color: '#a855f7',
      member: 'Member 4',
      features: ['Real-time Alerts', 'Notification Panel', 'Status History']
    }
  ];

  return (
    <div className="home-page animate-in">
      {/* ── Ultra-Premium Hero Section ── */}
      <section className="home-hero relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[85vh] px-4">
        {/* Glowing Blobs Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="hero-accent-glow" />
        
        <div className="hero-inner relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-surface-border bg-surface/50 backdrop-blur-md shadow-lg">
            <span className="badge badge-indigo">PAF Assignment 2026</span>
            <div className="w-1 h-1 rounded-full bg-surface-border" />
            <span className="text-xs font-bold text-dim uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-yellow-500" />
              v2.1.0-Stable Operations
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white" style={{ fontFamily: 'Outfit' }}>
            Smart Campus <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-600" style={{ lineHeight: '1.2' }}>
              Operations Engine
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
            A production-grade central nervous system for academic enterprises.
            Synchronizing facility catalogues, dynamic booking logic, and rapid incident ticketing into one seamless architecture.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
            {user ? (
              <>
                <button
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all duration-300 flex items-center gap-3 hover:-translate-y-1"
                  onClick={() => onNavigate('dashboard')}
                >
                  Enter Core Dashboard
                  <ArrowRight size={20} />
                </button>
                <button
                  className="px-8 py-4 bg-surface hover:bg-surface-alt border border-surface-border text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-3 hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => onNavigate('catalogue')}
                >
                  Explore Catalogue
                </button>
              </>
            ) : (
              <>
                <button
                  className="px-8 py-4 bg-surface hover:bg-surface-alt border border-surface-border text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => onNavigate('login')}
                  style={{ minWidth: '180px' }}
                >
                  <LogIn size={20} /> Authentication
                </button>
                <button
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1"
                  onClick={() => onNavigate('signup')}
                  style={{ minWidth: '180px' }}
                >
                  <UserPlus size={20} /> Provision Identity
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Features Grid ───────────────────────────────────────── */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Core Modules</h2>
          <p className="section-subtitle">A layered architecture delivering mission-critical functionality.</p>
        </div>

        <div className="home-grid grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {modules.map((mod) => (
            <div key={mod.id} className="module-card bg-surface/50 backdrop-blur-md border border-surface-border p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] group-hover:bg-indigo-500/20 transition-all duration-500" />
              <div className="module-icon-wrap mb-4 w-14 h-14 rounded-xl flex items-center justify-center border border-surface-border relative z-10" style={{ background: `${mod.color}15`, color: mod.color }}>
                <mod.icon size={28} />
              </div>
              <div className="module-content relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white tracking-tight">{mod.title}</h3>
                  <span className="text-xs font-bold px-2 py-1 bg-surface-alt rounded text-dim uppercase tracking-wider">{mod.member}</span>
                </div>
                <p className="text-muted leading-relaxed mb-6">{mod.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {mod.features.map(f => (
                    <span key={f} className="text-xs font-medium text-dim bg-surface px-3 py-1.5 rounded-lg border border-surface-border">{f}</span>
                  ))}
                </div>
              </div>
              <button
                className="module-link mt-6 flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                onClick={() => onNavigate(mod.id)}
              >
                Launch Module <Zap size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why SmartCampus ─────────────────────────────────────── */}
      <section className="section-container bg-surface-alt">
        <div className="home-info-grid">
          <div className="info-text">
            <h2 className="section-title">Industrial Intelligence</h2>
            <p className="section-subtitle">Built with scalability and security in mind.</p>

            <div className="benefit-list">
              <div className="benefit-item">
                <div className="benefit-icon"><ShieldCheck size={20} /></div>
                <div>
                  <h4 className="benefit-title">Rule-Based Security</h4>
                  <p className="benefit-desc">OAuth 2.0 integration with granular USER and ADMIN role management.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon"><Layout size={20} /></div>
                <div>
                  <h4 className="benefit-title">Premium Interface</h4>
                  <p className="benefit-desc">High-performance React frontend designed for clarity and efficiency.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon"><Zap size={20} /></div>
                <div>
                  <h4 className="benefit-title">RESTful Foundation</h4>
                  <p className="benefit-desc">Spring Boot backend following layered architecture and best practices.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-visual glass-card">
            <div className="visual-header">
              <div className="dot red" />
              <div className="dot yellow" />
              <div className="dot green" />
              <span className="window-title">System Architecture</span>
            </div>
            <div className="visual-body">
              <div className="stack-layer">
                <Layout size={16} /> React Client App
              </div>
              <div className="stack-arrow" />
              <div className="stack-layer secondary">
                <Zap size={16} /> Spring Boot REST API
              </div>
              <div className="stack-arrow" />
              <div className="stack-layer dark">
                <Search size={16} /> MongoDB Data Persistence
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
