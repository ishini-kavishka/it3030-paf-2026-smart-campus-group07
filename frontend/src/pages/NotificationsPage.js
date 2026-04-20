import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import { Bell, Trash2, ArrowLeft, Clock } from 'lucide-react';
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
                            {notifications.map(notification => (
                                <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors flex gap-4 animate-in slide-in-from-left-4 duration-300">
                                    <div className="mt-1">
                                        <div className="w-2 h-2 bg-[#534AB7] rounded-full mt-2"></div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-semibold mb-1">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center text-gray-400 text-sm">
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
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
