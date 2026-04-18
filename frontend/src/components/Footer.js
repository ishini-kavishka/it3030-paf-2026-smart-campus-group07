import React from 'react';
import { Database, Github, Globe, Heart, Shield, Lock, Activity } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface/30 backdrop-blur-md border-t border-surface-border mt-auto pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Database size={20} className="text-indigo-400" />
              </div>
              <h4 className="text-xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'Outfit' }}>SmartCampus Ops</h4>
            </div>
            <p className="text-sm text-muted max-w-xs leading-relaxed mb-6">
              Next-generation campus operations management system. 
              Empowering universities with smart resource scheduling, facility cataloging, and automated maintenance.
            </p>
            <div className="flex items-center gap-4">
              <a href="#github" className="w-10 h-10 rounded-full bg-surface border border-surface-border flex items-center justify-center text-muted hover:text-white hover:bg-surface-alt hover:border-indigo-500/50 transition-all duration-300">
                <Github size={18} />
              </a>
              <a href="#security" className="w-10 h-10 rounded-full bg-surface border border-surface-border flex items-center justify-center text-muted hover:text-white hover:bg-surface-alt hover:border-indigo-500/50 transition-all duration-300">
                <Shield size={18} />
              </a>
              <a href="#status" className="w-10 h-10 rounded-full bg-surface border border-surface-border flex items-center justify-center text-muted hover:text-white hover:bg-surface-alt hover:border-indigo-500/50 transition-all duration-300">
                <Activity size={18} />
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6 tracking-wide">Platform</h5>
            <ul className="space-y-4">
              <li><a href="#catalogue" className="text-sm text-muted hover:text-indigo-400 transition-colors">Facility Catalogue</a></li>
              <li><a href="#bookings" className="text-sm text-muted hover:text-indigo-400 transition-colors">Booking Engine</a></li>
              <li><a href="#maintenance" className="text-sm text-muted hover:text-indigo-400 transition-colors">Incident Ticketing</a></li>
              <li><a href="#auth" className="text-sm text-muted hover:text-indigo-400 transition-colors flex items-center gap-2">RBAC Auth <Lock size={12}/></a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6 tracking-wide">Support</h5>
            <ul className="space-y-4">
              <li><a href="#docs" className="text-sm text-muted hover:text-indigo-400 transition-colors">Documentation</a></li>
              <li><a href="#admin" className="text-sm text-muted hover:text-indigo-400 transition-colors">Admin Guides</a></li>
              <li><a href="#help" className="text-sm text-muted hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#status" className="text-sm text-muted hover:text-indigo-400 transition-colors flex items-center gap-2">System Status <div className="w-2 h-2 rounded-full bg-green-500"></div></a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6 tracking-wide">Legal</h5>
            <ul className="space-y-4">
              <li><a href="#privacy" className="text-sm text-muted hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="text-sm text-muted hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#cookies" className="text-sm text-muted hover:text-indigo-400 transition-colors">Cookie Preferences</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-dim tracking-widest uppercase">
            <Globe size={14} className="text-indigo-500" />
            <span>University Network Core v2.4.0</span>
          </div>

          <p className="text-xs text-dim font-medium">
            © {currentYear} SmartCampus Team. Built with <Heart size={12} className="text-red-500 inline mx-0.5" /> for Modern Education.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
