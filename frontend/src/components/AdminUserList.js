import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, CheckCircle, XCircle, Settings } from 'lucide-react';
import adminApi from '../api/adminApi';

const AdminUserList = () => {
    const { user, token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminApi.getAllUsers(token);
                // Filter out the current admin from the list
                setUsers(data.filter(u => u.username !== user.username));
            } catch (err) {
                setError('Failed to load users.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user, token]);

    const handleSuspend = async (id) => {
        try {
            await adminApi.suspendUser(id, token);
            setUsers(users.map(u => u.id === id ? { ...u, accountStatus: 'SUSPENDED' } : u));
        } catch (err) {
            alert('Failed to suspend user');
        }
    };

    const handleActivate = async (id) => {
        try {
            await adminApi.activateUser(id, token);
            setUsers(users.map(u => u.id === id ? { ...u, accountStatus: 'ACTIVE' } : u));
        } catch (err) {
            alert('Failed to activate user');
        }
    };

    return (
        <div className="animate-in mt-6">
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center">
                    <XCircle className="w-5 h-5 mr-3" />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 font-['Outfit']">Registered Members</h2>
                    <span className="bg-[#EEEDFE] text-[#534AB7] px-3 py-1 rounded-full text-xs font-bold">
                        {users.length} Users Found
                    </span>
                </div>
                
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading user database...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">User Details</th>
                                    <th className="px-6 py-4 font-semibold">Contact</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{u.firstName} {u.lastName}</div>
                                            <div className="text-gray-500 text-xs mt-1">@{u.username}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{u.email}</div>
                                            <div className="text-gray-500 text-xs mt-1">{u.phoneNumber}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                                                {u.role.replace('ROLE_', '')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.accountStatus === 'SUSPENDED' ? (
                                                <span className="flex items-center text-red-600 text-xs font-bold bg-red-50 border border-red-200 px-2.5 py-1 rounded-md w-max">
                                                    <XCircle className="w-3.5 h-3.5 mr-1.5" /> Suspended
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md w-max">
                                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {u.accountStatus === 'ACTIVE' ? (
                                                <button 
                                                    onClick={() => handleSuspend(u.id)}
                                                    className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                                                >
                                                    Suspend User
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleActivate(u.id)}
                                                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                                                >
                                                    Activate User
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No other users found in the system.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUserList;
