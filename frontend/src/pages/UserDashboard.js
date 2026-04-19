import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Settings, Bell, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const quickLinks = [
        { title: 'My Bookings', icon: <Calendar className="w-8 h-8" />, desc: 'View and manage your current reservations', color: 'bg-blue-50 text-blue-600', path: '/my-bookings' },
        { title: 'Settings', icon: <Settings className="w-8 h-8" />, desc: 'Manage your account and preferences', color: 'bg-purple-50 text-purple-600', path: '/settings' },
        { title: 'Notifications', icon: <Bell className="w-8 h-8" />, desc: 'Check your latest alerts and updates', color: 'bg-amber-50 text-amber-600', path: '/notifications' },
        { title: 'View Profile', icon: <User className="w-8 h-8" />, desc: 'See your public campus profile', color: 'bg-emerald-50 text-emerald-600', path: '/settings' }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 font-['Outfit'] mb-2">
                    Welcome back, {user?.firstName || user?.username || 'User'}! 👋
                </h1>
                <p className="text-gray-500 text-lg">Here is an overview of your campus activities today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {quickLinks.map((link, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => navigate(link.path)}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#534AB7] hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105 ${link.color}`}>
                            {link.icon}
                        </div>
                        <h3 className="text-[#111827] font-semibold text-lg font-['Outfit'] flex items-center justify-between">
                            {link.title}
                            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                        </h3>
                        <p className="text-gray-500 mt-2 text-sm">
                            {link.desc}
                        </p>
                    </div>
                ))}
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#534AB7]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <h2 className="text-2xl font-bold text-gray-900 font-['Outfit'] mb-4">Upcoming Schedule</h2>
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Calendar className="w-16 h-16 mb-4 opacity-50" />
                    <p>No upcoming events or bookings scheduled.</p>
                    <button 
                        onClick={() => navigate('/catalogue')}
                        className="mt-6 bg-[#534AB7] text-white px-6 py-2.5 rounded-xl font-medium tracking-wide hover:bg-[#3C3489] transition-colors"
                    >
                        Explore Catalogue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
