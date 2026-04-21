import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Trash2, LogOut, Save, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const { user, updateProfile, changePassword, logout, deleteProfile } = useAuth();
    const navigate = useNavigate();
    
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [dob, setDob] = useState(user?.dob || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [address, setAddress] = useState(user?.address || '');
    
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
    const [profileLoading, setProfileLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passMsg, setPassMsg] = useState({ type: '', text: '' });
    const [passLoading, setPassLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileMsg({ type: '', text: '' });

        // Validations
        const today = new Date().toISOString().split('T')[0];
        if (dob > today) {
            setProfileMsg({ type: 'error', text: 'Date of birth cannot be in the future.' });
            return;
        }
        if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
            setProfileMsg({ type: 'error', text: 'Phone number must be exactly 10 digits.' });
            return;
        }

        setProfileLoading(true);
        try {
            await updateProfile({ firstName, lastName, email, dob, phoneNumber, address });
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setProfileMsg({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPassLoading(true);
        setPassMsg({ type: '', text: '' });
        try {
            await changePassword(currentPassword, newPassword);
            setPassMsg({ type: 'success', text: 'Password changed successfully!' });
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            setPassMsg({ type: 'error', text: 'Failed to change password. Check your current password.' });
        } finally {
            setPassLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDeleteProfile = async () => {
        if (window.confirm("Are you absolutely sure you want to delete your profile? This action cannot be undone.")) {
            try {
                await deleteProfile();
                navigate('/');
            } catch (err) {
                alert("Failed to delete profile.");
            }
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 font-['Outfit']">Account Settings</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium tracking-wide hover:bg-gray-200 transition-colors"
                >
                    <LayoutDashboard size={18} /> Dashboard
                </button>
            </div>

            {/* Profile Update Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
                    <User className="text-[#534AB7] w-5 h-5"/>
                    <h2 className="text-lg font-semibold text-gray-900 font-['Outfit']">Profile Information</h2>
                </div>
                <div className="p-6">
                    {profileMsg.text && (
                        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {profileMsg.text}
                        </div>
                    )}
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input 
                                    type="date" 
                                    required
                                    max={new Date().toISOString().split('T')[0]}
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telephone Number</label>
                                <input 
                                    type="tel" 
                                    required
                                    maxLength="10"
                                    pattern="\d{10}"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input 
                                type="text" 
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" 
                                disabled={profileLoading}
                                className="flex items-center gap-2 bg-[#534AB7] text-white px-5 py-2 rounded-xl font-medium tracking-wide hover:bg-[#3C3489] transition-colors disabled:opacity-70"
                            >
                                <Save size={18} /> {profileLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
                    <Lock className="text-[#534AB7] w-5 h-5"/>
                    <h2 className="text-lg font-semibold text-gray-900 font-['Outfit']">Change Password</h2>
                </div>
                <div className="p-6">
                    {passMsg.text && (
                        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${passMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {passMsg.text}
                        </div>
                    )}
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input 
                                type="password" 
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input 
                                type="password" 
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors"
                                minLength={6}
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" 
                                disabled={passLoading}
                                className="flex items-center gap-2 bg-[#534AB7] text-white px-5 py-2 rounded-xl font-medium tracking-wide hover:bg-[#3C3489] transition-colors disabled:opacity-70"
                            >
                                <Lock size={18} /> {passLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden relative">
                <div className="bg-red-50/50 border-b border-red-100 px-6 py-4">
                    <h2 className="text-lg font-semibold text-red-700 font-['Outfit']">Danger Zone</h2>
                </div>
                {user?.role !== 'ROLE_ADMIN' && (
                    <>
                        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-gray-900 font-medium">Session Management</p>
                                <p className="text-sm text-gray-500">Log out from your current session.</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
                            >
                                <LogOut size={18} /> Log Out
                            </button>
                        </div>
                        <div className="border-t border-gray-100"></div>
                    </>
                )}
                <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-gray-900 font-medium">Delete Account</p>
                        <p className="text-sm text-gray-500">Permanently delete your profile and all data.</p>
                    </div>
                    <button 
                        onClick={handleDeleteProfile}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-50 text-red-700 font-medium hover:bg-red-100 border border-red-200 transition-colors w-full sm:w-auto justify-center"
                    >
                        <Trash2 size={18} /> Delete Profile
                    </button>
                </div>
            </div>
            
        </div>
    );
};

export default SettingsPage;
