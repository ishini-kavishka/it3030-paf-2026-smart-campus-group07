import React from 'react';
import { Database, Github, Globe, Heart, Shield } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="api-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="flex items-center gap-2 mb-3">
            <div className="logo-icon-sm">
              <Database size={16} />
            </div>
            <h4 className="text-white font-bold">SmartCampus Ops</h4>
          </div>
          <p className="text-xs text-dim max-w-xs">
            Next-generation campus operations management system. 
            Empowering universities with smart resource scheduling and maintenance.
          </p>
        </div>

        <div className="footer-grid-links">
          <div className="footer-col">
            <h5 className="footer-heading">Platform</h5>
            <ul className="footer-links">
              <li><a href="#catalogue">Catalogue</a></li>
              <li><a href="#bookings">Bookings</a></li>
              <li><a href="#maintenance">Maintenance</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="footer-heading">Support</h5>
            <ul className="footer-links">
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#status">System Status</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 className="footer-heading">Legal</h5>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="flex items-center gap-2 text-xs text-dim">
          <Globe size={14} />
          <span>University Network v2.4.0</span>
        </div>

        <p className="text-xs text-dim">
          © {currentYear} SmartCampus Team. Built with <Heart size={12} className="text-accent inline" /> for Better Education.
        </p>

        <div className="flex items-center gap-4">
          <a href="https://github.com" className="icon-link" title="GitHub Repository">
            <Github size={16} />
          </a>
          <a href="#security" className="icon-link" title="Security Compliance">
            <Shield size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
