import React from 'react';
import { Github, Globe, Heart, Twitter, Linkedin, Send } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="api-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo-icon-lg" style={{ background: '#fff', padding: '6px', borderRadius: '12px', width: '48px', height: '48px' }}>
            <img src="/logo.png" alt="SmartCampus" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 className="brand-title-lg">SmartCampus Ops</h2>
          <p className="newsletter-text">
            Next-generation campus operations management system. 
            Empowering universities with smart resource scheduling, 
            automated maintenance, and real-time data analytics.
          </p>
          <div className="social-links">
            <a href="https://github.com" className="social-icon-btn" title="GitHub"><Github size={18} /></a>
            <a href="https://twitter.com" className="social-icon-btn" title="Twitter"><Twitter size={18} /></a>
            <a href="https://linkedin.com" className="social-icon-btn" title="LinkedIn"><Linkedin size={18} /></a>
          </div>
        </div>

        <div className="footer-grid-links">
          <div className="footer-col">
            <h5 className="footer-heading">Platform</h5>
            <ul className="footer-links">
              <li><a href="#catalogue">Facility Catalogue</a></li>
              <li><a href="#bookings">Booking System</a></li>
              <li><a href="#maintenance">Maintenance Hub</a></li>
              <li><a href="#analytics">Ops Analytics</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="footer-heading">Support</h5>
            <ul className="footer-links">
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#api">API Reference</a></li>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#status">System Status</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="footer-heading">Legal</h5>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#security">Security Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-newsletter">
          <h5 className="footer-heading">Stay Updated</h5>
          <p className="newsletter-text">
            Subscribe to our newsletter for the latest features and campus news.
          </p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Email address" 
              className="newsletter-input" 
              id="newsletter-email"
            />
            <button className="newsletter-btn" title="Subscribe" onClick={() => {
              const email = document.getElementById('newsletter-email').value;
              if (email && email.includes('@')) alert('Successfully subscribed to operations newsletter!');
              else alert('Please enter a valid email address.');
            }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#94a3b8' }}>
          <Globe size={14} />
          <span>University Network v2.4.0</span>
        </div>

        <p className="text-xs" style={{ color: '#94a3b8' }}>
          © {currentYear} SmartCampus Team. Built with <Heart size={12} className="text-accent inline" style={{ color: '#ef4444' }} /> for Better Education.
        </p>

        <div className="flex items-center gap-4 text-xs" style={{ color: '#94a3b8' }}>
          <span>Region: Global</span>
          <span className="opacity-50">|</span>
          <span>System Healthy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

