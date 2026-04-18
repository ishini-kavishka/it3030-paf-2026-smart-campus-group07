import React, { useState } from 'react';
import { User as UserIcon, Lock, LogOut, Trash2, Save, X, Monitor, Sun, Moon } from 'lucide-react';
import axios from 'axios';

const SettingsPage = ({ user, onChangeUser, onLogout, onNavigate, theme, setTheme }) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', type: '' });
    try {
      const response = await axios.put(`http://localhost:8082/api/auth/profile/${user.id}`, { name, email });
      onChangeUser(response.data);
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: err.response?.data || 'Failed to update profile.', type: 'error' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ text: '', type: '' });
    if (newPassword !== confirmPassword) {
      setPwdMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    try {
      await axios.put(`http://localhost:8082/api/auth/change-password/${user.id}`, { currentPassword, newPassword });
      setPwdMsg({ text: 'Password changed successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdMsg({ text: err.response?.data || 'Failed to change password.', type: 'error' });
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(`http://localhost:8082/api/auth/profile/${user.id}`);
      onLogout();
    } catch (err) {
      alert("Failed to delete profile: " + (err.response?.data || err.message));
    }
  };

  if (!user) return null;

  return (
    <div className="section-container animate-in">
      <div className="section-header">
        <h2 className="section-title">Account Settings</h2>
        <p className="section-subtitle">Manage your personal information and security preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex flex-col gap-2">
          <button 
            className={`px-4 py-3 text-left rounded-lg font-bold flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-muted hover:bg-surface hover:text-white'}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserIcon size={18} /> Edit Profile
          </button>
          <button 
            className={`px-4 py-3 text-left rounded-lg font-bold flex items-center gap-3 transition-colors ${activeTab === 'password' ? 'bg-indigo-600 text-white' : 'text-muted hover:bg-surface hover:text-white'}`}
            onClick={() => setActiveTab('password')}
          >
            <Lock size={18} /> Change Password
          </button>
          <button 
            className={`px-4 py-3 text-left rounded-lg font-bold flex items-center gap-3 transition-colors ${activeTab === 'theme' ? 'bg-indigo-600 text-white' : 'text-muted hover:bg-surface hover:text-white'}`}
            onClick={() => setActiveTab('theme')}
          >
            <Monitor size={18} /> Display Preferences
          </button>
          <div className="h-px bg-surface my-2" />
          <button 
            className="px-4 py-3 text-left rounded-lg font-bold flex items-center gap-3 text-muted hover:bg-surface hover:text-white transition-colors"
            onClick={onLogout}
          >
            <LogOut size={18} /> Logout
          </button>
          <button 
            className="px-4 py-3 text-left rounded-lg font-bold flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors mt-4"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>

        <div className="flex-1 glass-card p-8 min-h-[400px]">
          {activeTab === 'profile' && (
            <div className="animate-in">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-surface-border pb-4">Personal Details</h3>
              {profileMsg.text && (
                <div className={`p-4 mb-6 rounded-lg text-sm border ${profileMsg.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/50' : 'bg-red-500/10 text-red-400 border-red-500/50'}`}>
                  {profileMsg.text}
                </div>
              )}
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-muted uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full bg-surface border border-surface-border rounded-lg p-3 text-white focus:border-indigo-500 outline-none" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full bg-surface border border-surface-border rounded-lg p-3 text-white focus:border-indigo-500 outline-none" 
                    required
                  />
                </div>
                <button type="submit" className="btn-primary-lg flex items-center gap-2">
                  <Save size={18} /> Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="animate-in">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-surface-border pb-4">Security</h3>
              {pwdMsg.text && (
                <div className={`p-4 mb-6 rounded-lg text-sm border ${pwdMsg.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/50' : 'bg-red-500/10 text-red-400 border-red-500/50'}`}>
                  {pwdMsg.text}
                </div>
              )}
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-muted uppercase tracking-wider mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    className="w-full bg-surface border border-surface-border rounded-lg p-3 text-white focus:border-indigo-500 outline-none" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted uppercase tracking-wider mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    className="w-full bg-surface border border-surface-border rounded-lg p-3 text-white focus:border-indigo-500 outline-none" 
                    required 
                    minLength="6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    className="w-full bg-surface border border-surface-border rounded-lg p-3 text-white focus:border-indigo-500 outline-none" 
                    required
                  />
                </div>
                <button type="submit" className="btn-primary-lg flex items-center gap-2">
                  <Lock size={18} /> Update Password
                </button>
              </form>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="animate-in">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-surface-border pb-4">Display Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-8 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 ${theme === 'light' ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)] border-2' : 'bg-surface border-surface-border border hover:bg-surface-alt'}`}
                >
                  <Sun size={48} className={theme === 'light' ? 'text-indigo-400' : 'text-muted'} />
                  <span className={`font-bold text-lg ${theme === 'light' ? 'text-indigo-400' : 'text-muted'}`}>Light Mode</span>
                </button>
                
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-8 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 ${theme === 'dark' ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)] border-2' : 'bg-surface border-surface-border border hover:bg-surface-alt'}`}
                >
                  <Moon size={48} className={theme === 'dark' ? 'text-indigo-400' : 'text-muted'} />
                  <span className={`font-bold text-lg ${theme === 'dark' ? 'text-indigo-400' : 'text-muted'}`}>Premium Dark Mode</span>
                </button>
              </div>
              <p className="text-muted mt-6 text-sm">
                Your preference is securely saved to your local browser environment. The interface dynamically reacts to the theme engine upon toggling.
              </p>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] border border-surface-border p-8 rounded-2xl max-w-md w-full relative">
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 text-muted hover:text-white">
              <X size={24} />
            </button>
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-6 mx-auto">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">Delete Account</h3>
            <p className="text-muted text-center mb-8">
              Are you sure you want to permanently delete your account? This action cannot be undone and will erase all your data.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-surface hover:bg-surface-alt text-white rounded-lg font-bold transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteProfile} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
