import React, { useEffect, useState } from 'react';
import '../HomePage.css';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Wrench,
  Bell,
  ShieldCheck,
  Zap,
  Layout,
  Database,
  Users,
  CheckCircle,
  TrendingUp,
  ChevronRight,
  Star,
  Globe,
  Lock,
  Activity
} from 'lucide-react';

/* ── Animated counter hook ── */
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const StatCard = ({ value, label, icon: Icon, color }) => {
  const count = useCounter(value);
  return (
    <div className="hp-stat-card" style={{ '--accent': color }}>
      <div className="hp-stat-icon" style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div className="hp-stat-num">{count.toLocaleString()}+</div>
      <div className="hp-stat-label">{label}</div>
    </div>
  );
};

const HomePage = ({ onNavigate }) => {
  const [activeModule, setActiveModule] = useState(null);

  const modules = [
    {
      id: 'catalogue',
      title: 'Facility Catalogue',
      desc: 'Browse and explore all bookable university facilities — from lecture halls to specialized labs — with live availability and rich metadata.',
      icon: BookOpen,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
      member: 'M1',
      memberFull: 'Member 1',
      features: ['Smart Search & Filters', 'Real-time Availability', 'Detailed Asset Metadata'],
      action: 'Explore Catalogue'
    },
    {
      id: 'booking',
      title: 'Booking Engine',
      desc: 'Intelligent scheduling with automatic conflict detection, approval workflows, and a full personal booking history dashboard.',
      icon: Calendar,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      member: 'M2',
      memberFull: 'Member 2',
      features: ['Conflict Detection', 'Pending / Approved / Rejected', 'My Bookings History'],
      action: 'Book a Facility'
    },
    {
      id: 'maintenance',
      title: 'Incident Ticketing',
      desc: 'Report and track campus maintenance issues with image attachments, priority levels, and real-time technician assignment.',
      icon: Wrench,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      member: 'M3',
      memberFull: 'Member 3',
      features: ['Image Attachments', 'Priority Escalation', 'Comments & Updates'],
      action: 'Report Issue'
    },
    {
      id: 'notifications',
      title: 'Alert Center',
      desc: 'Stay instantly informed with real-time push notifications on booking approvals, ticket status changes, and campus-wide announcements.',
      icon: Bell,
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #a855f7, #c084fc)',
      member: 'M4',
      memberFull: 'Member 4',
      features: ['Real-time Alerts', 'Notification Panel', 'Status History Log'],
      action: 'Open Alerts'
    }
  ];

  const techStack = [
    { icon: Layout, label: 'React 18', desc: 'Frontend SPA', color: '#61dafb' },
    { icon: Zap, label: 'Spring Boot', desc: 'REST API Backend', color: '#6db33f' },
    { icon: Database, label: 'MongoDB', desc: 'NoSQL Persistence', color: '#4db33d' },
    { icon: Lock, label: 'JWT Auth', desc: 'Secure Role System', color: '#f59e0b' },
  ];

  const benefits = [
    { icon: ShieldCheck, title: 'Role-Based Security', desc: 'Granular USER and ADMIN role management with JWT token authentication and route protection.', color: '#6366f1' },
    { icon: Activity, title: 'Real-Time Operations', desc: 'Live booking statuses, instant alert dispatch, and up-to-date facility availability tracking.', color: '#10b981' },
    { icon: Globe, title: 'Full-Stack Architecture', desc: 'Layered Spring Boot REST API with MongoDB persistence, built for scalability and reliability.', color: '#f59e0b' },
    { icon: Users, title: 'Multi-Role Workflows', desc: 'Tailored experiences for Students, Staff, and Administrators with dedicated dashboards.', color: '#a855f7' },
  ];

  return (
    <div className="hp-root animate-in">

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="hp-hero">
        <div className="hp-hero-bg">
          <div className="hp-orb hp-orb-1" />
          <div className="hp-orb hp-orb-2" />
          <div className="hp-orb hp-orb-3" />
          <div className="hp-grid-overlay" />
        </div>

        <div className="hp-hero-inner">
          <div className="hp-hero-content">
            <div className="hp-hero-pill">
              <span className="hp-pill-dot" />
              PAF Assignment 2026 · Group 07
            </div>

            <h1 className="hp-hero-title">
              Smart Campus<br />
              <span className="hp-hero-gradient">Operations Hub</span>
            </h1>

            <p className="hp-hero-desc">
              A production-grade digital nervous system for modern universities.
              Manage facilities, bookings, incidents, and alerts — all from a single,
              beautifully-crafted platform.
            </p>

            <div className="hp-hero-actions">
              <button className="hp-btn-primary" onClick={() => onNavigate('catalogue')}>
                <BookOpen size={18} />
                Explore Catalogue
                <ArrowRight size={16} />
              </button>
              <button className="hp-btn-ghost" onClick={() => onNavigate('dashboard')}>
                View Dashboard
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="hp-hero-badges">
              <span className="hp-badge"><CheckCircle size={12} /> Spring Boot</span>
              <span className="hp-badge"><CheckCircle size={12} /> React 18</span>
              <span className="hp-badge"><CheckCircle size={12} /> MongoDB</span>
              <span className="hp-badge"><CheckCircle size={12} /> JWT Auth</span>
            </div>
          </div>

          <div className="hp-hero-visual">
            <div className="hp-dashboard-mock">
              <div className="hp-mock-header">
                <div className="hp-mock-dots">
                  <span className="hp-dot red" />
                  <span className="hp-dot yellow" />
                  <span className="hp-dot green" />
                </div>
                <span className="hp-mock-title">SmartCampus Dashboard</span>
              </div>
              <div className="hp-mock-body">
                <div className="hp-mock-stats">
                  <div className="hp-mock-stat" style={{ '--c': '#6366f1' }}><span>42</span><small>Facilities</small></div>
                  <div className="hp-mock-stat" style={{ '--c': '#10b981' }}><span>128</span><small>Bookings</small></div>
                  <div className="hp-mock-stat" style={{ '--c': '#f59e0b' }}><span>7</span><small>Incidents</small></div>
                  <div className="hp-mock-stat" style={{ '--c': '#a855f7' }}><span>24</span><small>Alerts</small></div>
                </div>
                <div className="hp-mock-bar-chart">
                  {[60, 80, 45, 90, 70, 85, 55].map((h, i) => (
                    <div key={i} className="hp-mock-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <div className="hp-mock-list">
                  {['Lecture Hall A', 'Computer Lab 2', 'Conference Rm'].map((name, i) => (
                    <div key={i} className="hp-mock-list-item">
                      <span>{name}</span>
                      <span className={`hp-mock-tag ${i === 1 ? 'pending' : 'active'}`}>{i === 1 ? 'Pending' : 'Active'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────── */}
      <section className="hp-stats-section">
        <StatCard value={42}  label="Managed Facilities" icon={BookOpen}    color="#6366f1" />
        <StatCard value={128} label="Bookings Processed" icon={Calendar}    color="#10b981" />
        <StatCard value={15}  label="Incidents Resolved" icon={Wrench}      color="#f59e0b" />
        <StatCard value={200} label="Campus Users"       icon={Users}       color="#a855f7" />
        <StatCard value={98}  label="Uptime (%)"         icon={TrendingUp}  color="#ef4444" />
      </section>

      {/* ─── CORE MODULES ──────────────────────────────────────── */}
      <section className="hp-section">
        <div className="hp-section-header">
          <div className="hp-section-pill">Core Modules</div>
          <h2 className="hp-section-title">Everything your campus needs</h2>
          <p className="hp-section-sub">Four integrated modules, one seamless experience — built by a dedicated team.</p>
        </div>

        <div className="hp-modules-grid">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`hp-module-card ${activeModule === mod.id ? 'active' : ''}`}
              onMouseEnter={() => setActiveModule(mod.id)}
              onMouseLeave={() => setActiveModule(null)}
              style={{ '--mod-color': mod.color }}
            >
              <div className="hp-module-card-top">
                <div className="hp-module-icon" style={{ background: `${mod.color}18`, color: mod.color }}>
                  <mod.icon size={26} />
                </div>
                <span className="hp-module-member" style={{ background: `${mod.color}15`, color: mod.color }}>
                  <Star size={10} /> {mod.memberFull}
                </span>
              </div>

              <h3 className="hp-module-title">{mod.title}</h3>
              <p className="hp-module-desc">{mod.desc}</p>

              <ul className="hp-module-features">
                {mod.features.map(f => (
                  <li key={f}><CheckCircle size={13} style={{ color: mod.color, flexShrink: 0 }} /> {f}</li>
                ))}
              </ul>

              <div className="hp-module-footer">
                <div className="hp-module-bar" style={{ background: mod.gradient }} />
                <button className="hp-module-btn" style={{ color: mod.color, borderColor: `${mod.color}30` }} onClick={() => onNavigate(mod.id)}>
                  {mod.action} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TECH STACK ────────────────────────────────────────── */}
      <section className="hp-tech-section">
        <div className="hp-tech-inner">
          <div className="hp-tech-text">
            <div className="hp-section-pill" style={{ alignSelf: 'flex-start' }}>Tech Stack</div>
            <h2 className="hp-section-title" style={{ textAlign: 'left' }}>Built for production,<br />designed to impress</h2>
            <p className="hp-section-sub" style={{ textAlign: 'left' }}>
              SmartCampus is powered by an industry-standard full-stack architecture — delivering speed, security, and scalability at every layer.
            </p>
            <div className="hp-tech-chips">
              {techStack.map(t => (
                <div key={t.label} className="hp-tech-chip" style={{ '--tc': t.color }}>
                  <t.icon size={18} style={{ color: t.color }} />
                  <div>
                    <div className="hp-tech-chip-label">{t.label}</div>
                    <div className="hp-tech-chip-sub">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hp-tech-visual">
            <div className="hp-arch-diagram">
              <div className="hp-arch-layer" style={{ '--lc': '#61dafb' }}>
                <Layout size={16} />
                React 18 Client
                <span className="hp-arch-tag">Port 3000</span>
              </div>
              <div className="hp-arch-arrow">↓ REST / JSON</div>
              <div className="hp-arch-layer" style={{ '--lc': '#6db33f' }}>
                <Zap size={16} />
                Spring Boot API
                <span className="hp-arch-tag">Port 8080</span>
              </div>
              <div className="hp-arch-arrow">↓ MongoDB Driver</div>
              <div className="hp-arch-layer" style={{ '--lc': '#4db33d' }}>
                <Database size={16} />
                MongoDB Atlas
                <span className="hp-arch-tag">NoSQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY SMART CAMPUS ──────────────────────────────────── */}
      <section className="hp-section">
        <div className="hp-section-header">
          <div className="hp-section-pill">Why SmartCampus?</div>
          <h2 className="hp-section-title">Industrial-grade intelligence</h2>
          <p className="hp-section-sub">Designed with scalability, security, and user experience at its core.</p>
        </div>

        <div className="hp-benefits-grid">
          {benefits.map(b => (
            <div key={b.title} className="hp-benefit-card" style={{ '--bc': b.color }}>
              <div className="hp-benefit-icon" style={{ background: `${b.color}15`, color: b.color }}>
                <b.icon size={24} />
              </div>
              <h4 className="hp-benefit-title">{b.title}</h4>
              <p className="hp-benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <section className="hp-cta-section">
        <div className="hp-cta-orb hp-cta-orb-1" />
        <div className="hp-cta-orb hp-cta-orb-2" />
        <div className="hp-cta-inner">
          <h2 className="hp-cta-title">Ready to modernize your campus?</h2>
          <p className="hp-cta-sub">Jump into the Facility Catalogue, create a booking, or explore the admin dashboard right now.</p>
          <div className="hp-cta-actions">
            <button className="hp-btn-primary hp-btn-lg" onClick={() => onNavigate('catalogue')}>
              <BookOpen size={20} />
              Start Exploring
              <ArrowRight size={18} />
            </button>
            <button className="hp-btn-outline-white" onClick={() => onNavigate('dashboard')}>
              Open Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;