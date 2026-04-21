import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, CheckCircle, XCircle, Settings, RefreshCw, MessageSquare, Send, X } from 'lucide-react';
import adminApi from '../api/adminApi';

const AdminUserList = () => {
    const { user, token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messagingUser, setMessagingUser] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [sendingMsg, setSendingMsg] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllUsers(token);
            // Filter out the current admin from the list
            setUsers(data.filter(u => u.username !== user.username));
        } catch (err) {
            setError('Failed to load users. Backend server rejected the request.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user, token]);

    const handleStatusChange = async (e, u) => {
        const newStatus = e.target.value;
        try {
            if (newStatus === 'ACTIVE') {
                await adminApi.activateUser(u.id, token);
                setUsers(users.map(usr => usr.id === u.id ? { ...usr, accountStatus: 'ACTIVE' } : usr));
            } else if (newStatus === 'SUSPENDED') {
                await adminApi.suspendUser(u.id, token);
                setUsers(users.map(usr => usr.id === u.id ? { ...usr, accountStatus: 'SUSPENDED' } : usr));
            }
        } catch (err) {
            alert('Failed to update user database access.');
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        setSendingMsg(true);
        try {
            await adminApi.sendMessage(messagingUser.username, messageText, token);
            setMessagingUser(null);
            setMessageText('');
        } catch (err) {
            alert('Failed to broadcast message to user.');
        } finally {
            setSendingMsg(false);
        }
    };

    return (
        <div className="animate-in mt-6">
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center shadow-sm border border-red-100">
                    <XCircle className="w-5 h-5 mr-3" />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900 font-['Outfit']">Registered Members</h2>
                        <span className="bg-[#EEEDFE] text-[#534AB7] px-3 py-1 rounded-full text-xs font-bold">
                            {users.length} Users Found
                        </span>
                    </div>
                    <button 
                        onClick={fetchUsers}
                        className={`p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-[#534AB7] hover:border-[#534AB7] transition-all shadow-sm ${loading ? 'animate-spin text-[#534AB7] border-[#534AB7]' : ''}`}
                        title="Reload Databases"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
                
                {loading && users.length === 0 ? (
                    <div className="p-16 text-center text-gray-500 font-medium animate-pulse">Syncing user database...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100 shadow-sm">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wider">User Details</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Contact</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Role</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-right">Moderation Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{u.firstName} {u.lastName}</div>
                                            <div className="text-[#534AB7] text-xs mt-1 bg-[#EEEDFE] px-2 py-0.5 rounded-md w-max border border-[#534AB7]/10">@{u.username}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 font-medium">{u.email}</div>
                                            <div className="text-gray-500 text-xs mt-1">{u.phoneNumber || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-[0.7rem] font-bold border border-gray-200 tracking-wide">
                                                {u.role.replace('ROLE_', '')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.accountStatus === 'SUSPENDED' ? (
                                                <span className="flex items-center text-red-600 text-[0.7rem] uppercase tracking-wider font-bold w-max">
                                                    <XCircle className="w-3.5 h-3.5 mr-1" /> Suspended
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-emerald-600 text-[0.7rem] uppercase tracking-wider font-bold w-max">
                                                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-end gap-2">
                                                <select
                                                    value={u.accountStatus}
                                                    onChange={(e) => handleStatusChange(e, u)}
                                                    className={`border rounded-lg px-2 py-1.5 text-xs font-bold w-[120px] outline-none cursor-pointer hover:shadow-sm transition-all focus:ring-2 focus:ring-offset-1 ${u.accountStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20' : 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500/20'}`}
                                                >
                                                    <option value="ACTIVE">● Set Active</option>
                                                    <option value="SUSPENDED">● Suspend</option>
                                                </select>
                                                <button
                                                    onClick={() => setMessagingUser(u)}
                                                    className="w-[120px] flex justify-center items-center gap-1.5 bg-white hover:bg-[#EEEDFE] text-[#534AB7] border border-gray-200 hover:border-[#534AB7]/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5" /> Send Alert
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                                            <div className="flex flex-col items-center opacity-60">
                                                <ShieldAlert className="w-12 h-12 mb-3 text-gray-400" />
                                                <span className="font-semibold text-lg">No Users Found</span>
                                                <span className="text-sm mt-1">There are currently no active students or members in the registry.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Admin Messaging Modal Overlay */}
            {messagingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in run-fast">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-black/5">
                        <div className="bg-gradient-to-r from-[#534AB7] to-[#4038a0] px-6 py-4 flex items-center justify-between">
                            <h3 className="text-white font-bold font-['Outfit'] flex items-center tracking-wide">
                                <MessageSquare className="w-5 h-5 mr-2 opacity-80" /> Custom Admin Alert
                            </h3>
                            <button onClick={() => setMessagingUser(null)} className="text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-5 flex items-start">
                                <ShieldAlert className="w-5 h-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                                <p className="text-xs font-medium text-blue-800 leading-relaxed">
                                    You are directly broadcasting to <strong>{messagingUser.firstName} {messagingUser.lastName}</strong> (@{messagingUser.username}). This will manifest in their secure alert center.
                                </p>
                            </div>
                            
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Message Payload</label>
                            <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Type your official administrative mandate here..."
                                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm font-medium outline-none focus:border-[#534AB7] focus:bg-white focus:ring-4 focus:ring-[#534AB7]/10 transition-all min-h-[140px] resize-none shadow-inner"
                            ></textarea>
                            
                            <div className="mt-6 flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setMessagingUser(null)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!messageText.trim() || sendingMsg}
                                    className="flex items-center justify-center min-w-[140px] bg-[#534AB7] hover:bg-[#3C3489] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    {sendingMsg ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <><Send className="w-4 h-4 mr-2" /> Dispatch Alert</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserList;
