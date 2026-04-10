import React from 'react';
import { Search, Bell, User, Calendar } from 'lucide-react';

const Header = ({ username = 'Admin User', role = 'Member 1' }) => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="app-header-top">
      <div className="header-search-container">
        <Search size={18} className="text-dim" />
        <input 
          type="text" 
          placeholder="Global search across campus..." 
          className="header-search-input"
        />
      </div>

      <div className="header-actions">
        <div className="date-display hide-mobile">
          <Calendar size={16} />
          <span>{today}</span>
        </div>
        
        <div className="divider-v" />
        
        <button className="icon-btn" title="Notifications">
          <div className="notification-dot" />
          <Bell size={20} />
        </button>

        <div className="user-profile-toggle">
          <div className="user-info hide-mobile">
            <span className="user-name">{username}</span>
            <span className="user-role">{role}</span>
          </div>
          <div className="avatar-circle">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
