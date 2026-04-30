import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Settings, Bell, User, ChevronRight, ShieldCheck, CalendarClock, BarChart3, Clock, Box, Wrench } from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import { bookingService } from '../services/api';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isNewSignup = location.state?.isNewSignup || false;

    const [adminBookings, setAdminBookings] = useState([]);
    const [loadingStats, setLoadingStats] = useState(false);

    useEffect(() => {
        if (user?.role === 'ROLE_ADMIN') {
            const fetchAdminData = async () => {
                setLoadingStats(true);
                try {
                    const data = await bookingService.getAllBookings();
                    setAdminBookings(data);
                } catch (error) {
                    console.error('Failed to fetch stats:', error);
                } finally {
                    setLoadingStats(false);
                }
            };
            fetchAdminData();
        }
    }, [user]);

    const { topResources, peakHours } = useMemo(() => {
        if (user?.role !== 'ROLE_ADMIN' || !adminBookings.length) return { topResources: [], peakHours: [] };

        const resourceCount = {};
        const hourCount = {};

        adminBookings.forEach(b => {
            if (b.resourceName) {
                resourceCount[b.resourceName] = (resourceCount[b.resourceName] || 0) + 1;
            }
            if (b.startTime) {
                const hourStr = b.startTime.split(':')[0];
                const hour = parseInt(hourStr, 10);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                const formattedHour = `${hour12}:00 ${ampm}`;
                hourCount[formattedHour] = (hourCount[formattedHour] || 0) + 1;
            }
        });

        const topRes = Object.entries(resourceCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        const topHrs = Object.entries(hourCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([hour, count]) => ({ hour, count }));

        return { topResources: topRes, peakHours: topHrs };
    }, [adminBookings, user]);

    const quickLinks = [
        { title: 'My Bookings', icon: <Calendar className="w-8 h-8" />, desc: 'View and manage your current reservations', color: 'bg-blue-50 text-blue-600', path: '/my-bookings' },
        { title: 'Settings', icon: <Settings className="w-8 h-8" />, desc: 'Manage your account and preferences', color: 'bg-purple-50 text-purple-600', path: '/settings' },
        { title: 'My Incidents', icon: <Wrench className="w-8 h-8" />, desc: 'Report and track campus maintenance issues', color: 'bg-indigo-50 text-indigo-600', path: '/maintenance' },
        { title: 'Notifications', icon: <Bell className="w-8 h-8" />, desc: 'Check your latest alerts and updates', color: 'bg-amber-50 text-amber-600', path: '/notifications' },
        { title: 'View Profile', icon: <User className="w-8 h-8" />, desc: 'See your public campus profile', color: 'bg-emerald-50 text-emerald-600', path: '/profile' }
    ];

    if (user?.role === 'ROLE_ADMIN') {
        const adminLinks = [
            { title: 'Facilities & Assets', icon: <ShieldCheck className="w-8 h-8" />, desc: 'Manage campus infrastructure', color: 'bg-indigo-50 text-indigo-600', path: '/admin' },
            { title: 'Booking Requests', icon: <CalendarClock className="w-8 h-8" />, desc: 'Review facility bookings', color: 'bg-emerald-50 text-emerald-600', path: '/admin-bookings' },
            { title: 'System Settings', icon: <Settings className="w-8 h-8" />, desc: 'Manage administrative profile', color: 'bg-gray-50 text-gray-600', path: '/settings' },
            { title: 'Broadcast Alerts', icon: <Bell className="w-8 h-8" />, desc: 'Send notifications to groups', color: 'bg-amber-50 text-amber-600', path: '/notifications' }
        ];

        return (
            <div className="p-8 max-w-7xl mx-auto animate-in">
                <div className="bg-gradient-to-r from-[#534AB7] to-[#3C3489] rounded-3xl p-8 mb-8 text-white shadow-lg flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shrink-0 bg-white/10 flex items-center justify-center shadow-inner">
                         {user.profileImage ? (
                             <img src={user.profileImage} alt="Admin Profile" className="w-full h-full object-cover" />
                         ) : (
                             <User className="w-16 h-16 opacity-80" />
                         )}
                    </div>
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
                            <ShieldCheck className="w-4 h-4" /> System Administrator
                        </div>
                        <h1 className="text-4xl font-extrabold font-['Outfit'] mb-2">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-white/80 max-w-2xl leading-relaxed text-sm md:text-base">
                            Welcome to the Smart Campus Control Center. As an administrator, you possess elevated privileges to oversee physical facilities, orchestrate global bookings, and govern the system's operational continuity.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {adminLinks.map((link, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => navigate(link.path)}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#534AB7] hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${link.color}`}>
                                {link.icon}
                            </div>
                            <h3 className="text-[#111827] font-semibold text-lg font-['Outfit'] flex items-center justify-between">
                                {link.title}
                                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                            </h3>
                            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                                {link.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Usage Analytics Section */}
                <div className="mt-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 font-['Outfit']">Usage Analytics</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Resources Card */}
                        <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Box className="w-5 h-5 text-indigo-500" /> Top Booked Resources
                                </h3>
                                {loadingStats && <div className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">Loading...</div>}
                            </div>
                            <div className="space-y-5">
                                {!loadingStats && topResources.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                                        <Box className="w-10 h-10 mb-2 opacity-50" />
                                        <p className="text-sm font-medium">No resource data available</p>
                                    </div>
                                ) : (
                                    topResources.map((res, i) => {
                                        const maxCount = topResources[0]?.count || 1;
                                        const pct = Math.round((res.count / maxCount) * 100);
                                        return (
                                            <div key={i} className="group">
                                                <div className="flex justify-between text-sm mb-1.5">
                                                    <span className="font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">{res.name}</span>
                                                    <span className="text-gray-500 font-semibold">{res.count} bookings</span>
                                                </div>
                                                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Peak Booking Hours Card */}
                        <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-emerald-500" /> Peak Booking Hours
                                </h3>
                                {loadingStats && <div className="text-xs font-semibold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Loading...</div>}
                            </div>
                            <div className="space-y-5">
                                {!loadingStats && peakHours.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                                        <Clock className="w-10 h-10 mb-2 opacity-50" />
                                        <p className="text-sm font-medium">No booking hours available</p>
                                    </div>
                                ) : (
                                    peakHours.map((ph, i) => {
                                        const maxCount = peakHours[0]?.count || 1;
                                        const pct = Math.round((ph.count / maxCount) * 100);
                                        return (
                                            <div key={i} className="group">
                                                <div className="flex justify-between text-sm mb-1.5">
                                                    <span className="font-bold text-gray-700 group-hover:text-emerald-600 transition-colors">{ph.hour}</span>
                                                    <span className="text-gray-500 font-semibold">{ph.count} bookings</span>
                                                </div>
                                                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 font-['Outfit'] mb-2">
                    {isNewSignup ? 'Welcome' : 'Welcome back'}, {user?.firstName || user?.username || 'User'}! 👋
                </h1>
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
