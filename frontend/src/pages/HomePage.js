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
  Search
} from 'lucide-react';

const HomePage = ({ onNavigate }) => {
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
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="hero-accent-glow" />
        <div className="hero-inner">
          <div className="flex items-center gap-2 mb-6">
            <span className="badge badge-indigo">PAF Assignment 2026</span>
            <div className="divider-h" />
            <span className="text-xs font-bold text-dim uppercase tracking-widest">v2.1.0-Stable</span>
          </div>

          <h1 className="hero-main-title">
            Smart Campus <br />
            <span className="text-gradient">Operations Hub</span>
          </h1>

          <p className="hero-description">
            A production-inspired central nerve center designed to modernize university operations.
            From facility catalogues to complex booking workflows and incident tracking—all in one seamless experience.
          </p>

          <div className="flex items-center gap-4 mt-10">
            <button
              className="btn-primary-lg"
              onClick={() => onNavigate('catalogue')}
            >
              Explore Catalogue
              <ArrowRight size={18} />
            </button>
            <button
              className="btn-ghost-lg"
              onClick={() => onNavigate('dashboard')}
            >
              View Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ── Features Grid ───────────────────────────────────────── */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Core Modules</h2>
          <p className="section-subtitle">A layered architecture delivering mission-critical functionality.</p>
        </div>

        <div className="home-grid">
          {modules.map((mod) => (
            <div key={mod.id} className="module-card glass-card">
              <div className="module-icon-wrap" style={{ background: `${mod.color}15`, color: mod.color }}>
                <mod.icon size={28} />
              </div>
              <div className="module-content">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="module-title">{mod.title}</h3>
                  <span className="member-badge">{mod.member}</span>
                </div>
                <p className="module-desc">{mod.desc}</p>
                <div className="feature-tags">
                  {mod.features.map(f => (
                    <span key={f} className="feature-tag">{f}</span>
                  ))}
                </div>
              </div>
              <button
                className="module-link"
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
