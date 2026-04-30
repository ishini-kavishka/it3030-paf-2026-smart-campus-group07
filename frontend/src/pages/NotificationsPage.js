import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import { Bell, Trash2, ArrowLeft, Clock, ShieldAlert, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();
            setNotifications(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch notifications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleDelete = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            alert('Failed to delete notification.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#534AB7] p-3 rounded-xl text-white shadow-sm">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 font-['Outfit']">Notifications</h1>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                            <div className="w-8 h-8 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p>Loading your notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-16 text-gray-400 text-center animate-in fade-in zoom-in duration-300">
                            <Bell className="w-16 h-16 mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Outfit']">All Caught Up!</h3>
                            <p>You don't have any recent notifications.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map(notification => {
                                const isAdminAlert = notification.message.startsWith('ADMIN MESSAGE:');
                                let displayMsg = isAdminAlert
                                    ? notification.message.replace('[EMAIL DISPATCHED] ADMIN MESSAGE:', '').replace('ADMIN MESSAGE:', '').trim()
                                    : notification.message;

                                const isEmailDispatched = notification.message.includes('[EMAIL DISPATCHED]');
                                
                                const hasMyBookingsAction = displayMsg.includes('[ACTION:MY_BOOKINGS]');
                                if (hasMyBookingsAction) {
                                    displayMsg = displayMsg.replace('[ACTION:MY_BOOKINGS]', '').trim();
                                }

                                const hasCatalogueAction = displayMsg.includes('[ACTION:CATALOGUE]');
                                if (hasCatalogueAction) {
                                    displayMsg = displayMsg.replace('[ACTION:CATALOGUE]', '').trim();
                                }

                                // Extract [REASON]...[/REASON] tag
                                const reasonMatch = displayMsg.match(/\[REASON\]([\s\S]*?)\[\/REASON\]/);
                                const rejectionReason = reasonMatch ? reasonMatch[1].trim() : null;
                                if (rejectionReason) {
                                    displayMsg = displayMsg.replace(/\[REASON\][\s\S]*?\[\/REASON\]/, '').trim();
                                }

                                return (
                                <div key={notification.id} className={`p-6 transition-colors flex gap-4 animate-in slide-in-from-left-4 duration-300 ${
                                    isEmailDispatched ? 'bg-amber-50/50 border-l-4 border-amber-500 hover:bg-amber-50/80 shadow-sm'
                                    : isAdminAlert ? 'bg-red-50/40 border-l-4 border-red-500 hover:bg-red-50/80 shadow-sm'
                                    : hasCatalogueAction ? 'bg-emerald-50/60 border-l-4 border-emerald-500 hover:bg-emerald-50 shadow-sm'
                                    : 'hover:bg-gray-50'
                                }`}>
                                    <div className="mt-1">
                                        {isEmailDispatched ? (
                                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shadow-sm border border-amber-200 mt-1">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                        ) : isAdminAlert ? (
                                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-sm border border-red-200 mt-1">
                                                <ShieldAlert className="w-4 h-4" />
                                            </div>
                                        ) : hasCatalogueAction ? (
                                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200 mt-1 text-base">
                                                🏫
                                            </div>
                                        ) : (
                                            <div className="w-2 h-2 bg-[#534AB7] rounded-full mt-2"></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        {isEmailDispatched && (
                                            <div className="text-[0.65rem] font-bold text-amber-600 tracking-widest uppercase mb-1 flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> Official Admin Alert — Also Dispatched to Email
                                            </div>
                                        )}
                                        {!isEmailDispatched && isAdminAlert && (
                                            <div className="text-[0.65rem] font-bold text-red-600 tracking-widest uppercase mb-1">Official System Alert</div>
                                        )}
                                        {hasCatalogueAction && (
                                            <div className="text-[0.65rem] font-bold text-emerald-600 tracking-widest uppercase mb-1">🏫 New Facility Announcement</div>
                                        )}
                                        <p className={`${
                                            isEmailDispatched ? 'text-amber-900 font-bold'
                                            : isAdminAlert ? 'text-red-900 font-bold'
                                            : hasCatalogueAction ? 'text-emerald-900 font-semibold'
                                            : 'text-gray-900 font-semibold'
                                        } mb-1`}>
                                            {displayMsg}
                                        </p>
                                        {rejectionReason && (
                                            <div className="mt-2 mb-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                                <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
                                                <div>
                                                    <span className="text-[0.65rem] font-bold text-red-500 tracking-widest uppercase block mb-0.5">Rejection Reason</span>
                                                    <span className="text-red-800 font-semibold text-sm">{rejectionReason}</span>
                                                </div>
                                            </div>
                                        )}
                                        {hasMyBookingsAction && (
                                            <button 
                                                onClick={() => navigate('/my-bookings')}
                                                className="mt-2 mb-3 bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm px-4 py-1.5 rounded-lg font-medium transition-colors border border-[#3C3489]"
                                            >
                                                View My Bookings
                                            </button>
                                        )}
                                        {hasCatalogueAction && (
                                            <button 
                                                onClick={() => navigate('/catalogue')}
                                                className="mt-2 mb-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition-colors border border-emerald-700"
                                            >
                                                🏫 Browse Catalogue
                                            </button>
                                        )}
                                        <div className={`flex items-center text-sm ${
                                            isEmailDispatched ? 'text-amber-500/80'
                                            : isAdminAlert ? 'text-red-500/80'
                                            : hasCatalogueAction ? 'text-emerald-600/70'
                                            : 'text-gray-400'
                                        }`}>
                                            <Clock className="w-4 h-4 mr-1" />
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(notification.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 h-fit"
                                        title="Delete Notification"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
