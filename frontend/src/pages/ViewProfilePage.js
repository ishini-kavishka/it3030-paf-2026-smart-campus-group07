import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, User as UserIcon, CalendarDays, Clock } from 'lucide-react';

const ViewProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in">
                
                {/* ── Header Backdrop ── */}
                <div className="h-32 bg-gradient-to-r from-[#534AB7] to-[#3C3489] relative flex items-center px-6">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                </div>

                {/* ── Avatar & Core Info ── */}
                <div className="px-8 pb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-8 sm:space-x-6 text-center sm:text-left">
                        <div className="relative">
                            {user.profileImage ? (
                                <img 
                                    src={user.profileImage} 
                                    alt="Profile" 
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                                />
                            ) : (
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                    <UserIcon className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="mt-4 sm:mt-0 pt-2 sm:pt-12">
                            <h1 className="text-3xl font-extrabold text-gray-900 font-['Outfit']">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-[#534AB7] font-medium text-lg">@{user.username}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                                {user.role.replace('ROLE_', '')}
                            </span>
                        </div>
                    </div>

                    {/* ── Detailed Info Grid ── */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 font-['Outfit'] mb-6 pb-4 border-b border-gray-200">
                            Contact Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start">
                                <div className="mt-1 bg-white p-2 rounded-lg shadow-sm text-[#534AB7] mr-4">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Email Address</p>
                                    <p className="text-gray-900 font-medium mt-0.5">{user.email}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="mt-1 bg-white p-2 rounded-lg shadow-sm text-[#534AB7] mr-4">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                                    <p className="text-gray-900 font-medium mt-0.5">{user.phoneNumber || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="mt-1 bg-white p-2 rounded-lg shadow-sm text-[#534AB7] mr-4">
                                    <CalendarDays className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Date of Birth</p>
                                    <p className="text-gray-900 font-medium mt-0.5">{user.dob || 'Not provided'}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="mt-1 bg-white p-2 rounded-lg shadow-sm text-[#534AB7] mr-4">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Joined Date</p>
                                    <p className="text-gray-900 font-medium mt-0.5">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start md:col-span-2">
                                <div className="mt-1 bg-white p-2 rounded-lg shadow-sm text-[#534AB7] mr-4">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Residential Address</p>
                                    <p className="text-gray-900 font-medium mt-0.5 whitespace-pre-line">{user.address || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfilePage;
