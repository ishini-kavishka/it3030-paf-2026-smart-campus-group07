import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    ShieldAlert, CheckCircle, XCircle, RefreshCw, MessageSquare,
    Send, X, Search, Filter, Users, UserCheck, UserX, BarChart2
} from 'lucide-react';
import adminApi from '../api/adminApi';

const AdminUserList = () => {
    const { user, token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messagingUser, setMessagingUser] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [sendingMsg, setSendingMsg] = useState(false);
    const [dispatchEmail, setDispatchEmail] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminApi.getAllUsers(token);
            setUsers(data.filter(u => u.username !== user.username));
        } catch (err) {
            setError('Failed to load users. Backend server rejected the request.');
        } finally {
            setLoading(false);
        }
    }, [token, user]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter(u => u.accountStatus !== 'SUSPENDED').length;
        const suspended = users.filter(u => u.accountStatus === 'SUSPENDED').length;
        const avg = total > 0 ? Math.round((active / total) * 100) : 0;
        return { total, active, suspended, avg };
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
            const matchSearch = !searchQuery || fullName.includes(searchQuery.toLowerCase());
            const matchStatus =
                filterStatus === 'ALL' ||
                (filterStatus === 'ACTIVE' && u.accountStatus !== 'SUSPENDED') ||
                (filterStatus === 'SUSPENDED' && u.accountStatus === 'SUSPENDED');
            return matchSearch && matchStatus;
        });
    }, [users, searchQuery, filterStatus]);

    const handleStatusChange = async (e, u) => {
        const newStatus = e.target.value;
        try {
            if (newStatus === 'ACTIVE') {
                await adminApi.activateUser(u.id, token);
                setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, accountStatus: 'ACTIVE' } : usr));
            } else if (newStatus === 'SUSPENDED') {
                await adminApi.suspendUser(u.id, token);
                setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, accountStatus: 'SUSPENDED' } : usr));
            }
        } catch {
            alert('Failed to update user status.');
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        setSendingMsg(true);
        try {
            await adminApi.sendMessage(messagingUser.username, messageText, token, dispatchEmail);
            setMessagingUser(null);
            setMessageText('');
            setDispatchEmail(false);
        } catch (err) {
            alert('Failed to broadcast message to user.');
        } finally {
            setSendingMsg(false);
        }
    };

    const statCards = [
        { label: 'Total Users',     value: stats.total,      icon: <Users size={20} />,     color: '#6366f1', bg: '#eef2ff' },
        { label: 'Active Users',    value: stats.active,     icon: <UserCheck size={20} />,  color: '#10b981', bg: '#d1fae5' },
        { label: 'Suspended Users', value: stats.suspended,  icon: <UserX size={20} />,      color: '#f43f5e', bg: '#ffe4e6' },
        { label: 'Active Rate',     value: `${stats.avg}%`,  icon: <BarChart2 size={20} />,  color: '#f59e0b', bg: '#fef3c7' },
    ];

    return (
        <div style={{ marginTop: '1.5rem' }}>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {statCards.map(card => (
                    <div key={card.label} style={{
                        background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                        padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center',
                        gap: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: '12px',
                            background: card.bg, color: card.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            {card.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                                {card.value}
                            </div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginTop: '0.3rem' }}>
                                {card.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Error Banner ── */}
            {error && (
                <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '12px', padding: '0.85rem 1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>{error}</span>
                    <button onClick={fetchUsers} style={{ background: '#fff', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '8px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
                </div>
            )}

            {/* ── Main Card ── */}
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h2 style={{ fontWeight: 800, color: '#111827', fontSize: '1rem', margin: 0 }}>Registered Members</h2>
                        <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '0.2rem 0.75rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700 }}>
                            {filteredUsers.length} / {users.length}
                        </span>
                    </div>
                    <button
                        onClick={fetchUsers}
                        title="Reload"
                        style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '10px', padding: '0.45rem', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    </button>
                </div>

                {/* Toolbar */}
                <div style={{ padding: '0.85rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#fff' }}>
                    {/* Search */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.5rem 0.85rem' }}>
                        <Search size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by first or last name…"
                            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.85rem', color: '#374151', width: '100%' }}
                        />
                    </div>

                    {/* Status filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Filter size={14} style={{ color: '#94a3b8' }} />
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.5rem 0.85rem', fontSize: '0.82rem', fontWeight: 600, color: '#374151', background: '#f8fafc', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="SUSPENDED">Suspended</option>
                        </select>
                    </div>

                    {/* Clear */}
                    {(searchQuery || filterStatus !== 'ALL') && (
                        <button
                            onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); }}
                            style={{ background: '#fff5f5', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '10px', padding: '0.5rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Table */}
                {loading && users.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                        <div style={{ width: 36, height: 36, border: '3px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                        Syncing user database…
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1.5px solid #e5e7eb' }}>
                                <tr>
                                    {['User Details', 'Contact', 'Role', 'Status', 'Moderation Actions'].map((h, i) => (
                                        <th key={h} style={{ padding: '0.85rem 1.25rem', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#64748b', textAlign: i === 4 ? 'right' : 'left' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u, idx) => (
                                    <tr
                                        key={u.id}
                                        style={{ borderBottom: idx < filteredUsers.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                    >
                                        {/* User Details */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                                                {(u.firstName || '') + ' ' + (u.lastName || '') || 'No Name'}
                                            </div>
                                            <span style={{ fontSize: '0.72rem', color: '#4f46e5', background: '#eef2ff', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>
                                                @{u.username}
                                            </span>
                                        </td>
                                        {/* Contact */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ color: '#374151', fontWeight: 500, fontSize: '0.85rem' }}>{u.email}</div>
                                            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.2rem' }}>{u.phoneNumber || 'N/A'}</div>
                                        </td>
                                        {/* Role */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #e2e8f0' }}>
                                                {(u.role || '').replace('ROLE_', '')}
                                            </span>
                                        </td>
                                        {/* Status */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            {u.accountStatus === 'SUSPENDED' ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#dc2626', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    <XCircle size={13} /> Suspended
                                                </span>
                                            ) : (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    <CheckCircle size={13} /> Active
                                                </span>
                                            )}
                                        </td>
                                        {/* Actions */}
                                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                                                <select
                                                    value={u.accountStatus || 'ACTIVE'}
                                                    onChange={e => handleStatusChange(e, u)}
                                                    style={{
                                                        padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.72rem',
                                                        fontWeight: 700, cursor: 'pointer', border: '1.5px solid', outline: 'none', width: '120px',
                                                        background: u.accountStatus === 'SUSPENDED' ? '#fff5f5' : '#f0fdf4',
                                                        color: u.accountStatus === 'SUSPENDED' ? '#dc2626' : '#059669',
                                                        borderColor: u.accountStatus === 'SUSPENDED' ? '#fca5a5' : '#86efac',
                                                    }}
                                                >
                                                    <option value="ACTIVE">● Set Active</option>
                                                    <option value="SUSPENDED">● Suspend</option>
                                                </select>
                                                <button
                                                    onClick={() => setMessagingUser(u)}
                                                    style={{ width: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', background: '#fff', color: '#4f46e5', border: '1.5px solid #c7d2fe', padding: '0.35rem 0.6rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                                                >
                                                    <MessageSquare size={12} /> Send Alert
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '4rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                                <ShieldAlert size={40} style={{ marginBottom: '0.75rem', color: '#94a3b8' }} />
                                                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#374151' }}>No Users Found</span>
                                                <span style={{ fontSize: '0.82rem', marginTop: '0.3rem', color: '#94a3b8' }}>Try adjusting your search or status filter.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Admin Messaging Modal ── */}
            {messagingUser && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
                    <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '440px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}>
                        <div style={{ background: 'linear-gradient(135deg,#534AB7,#4038a0)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MessageSquare size={17} /> Custom Admin Alert
                            </h3>
                            <button onClick={() => { setMessagingUser(null); setDispatchEmail(false); }} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}>
                                <X size={16} />
                            </button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.6rem' }}>
                                <ShieldAlert size={15} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '0.1rem' }} />
                                <p style={{ fontSize: '0.8rem', color: '#1e40af', lineHeight: 1.5, margin: 0 }}>
                                    Broadcasting to <strong>{messagingUser.firstName} {messagingUser.lastName}</strong> (@{messagingUser.username}). This will appear in their notification center.
                                </p>
                            </div>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '0.5rem' }}>Message</label>
                            <textarea
                                value={messageText}
                                onChange={e => setMessageText(e.target.value)}
                                placeholder="Type your administrative message here…"
                                style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 1rem', color: '#374151', fontSize: '0.85rem', outline: 'none', minHeight: '130px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', background: '#f8fafc' }}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                            
                            {/* Email dispatch checkbox */}
                            <label
                                style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginTop: '0.85rem', padding: '0.75rem 1rem', borderRadius: '10px', border: `1.5px solid ${dispatchEmail ? '#c7d2fe' : '#e2e8f0'}`, background: dispatchEmail ? '#eef2ff' : '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                <input
                                    type="checkbox"
                                    checked={dispatchEmail}
                                    onChange={e => setDispatchEmail(e.target.checked)}
                                    style={{ marginTop: '0.1rem', accentColor: '#6366f1', width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
                                />
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: dispatchEmail ? '#4f46e5' : '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>
                                        <Send size={13} /> Dispatch to Email
                                    </div>
                                    <p style={{ fontSize: '0.72rem', color: dispatchEmail ? '#6366f1' : '#94a3b8', marginTop: '0.2rem', lineHeight: 1.4 }}>
                                        Also sends this message to the user's registered email inbox with official formatting.
                                    </p>
                                </div>
                            </label>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                                <button onClick={() => { setMessagingUser(null); setDispatchEmail(false); }} style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', color: '#6b7280', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!messageText.trim() || sendingMsg}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', background: '#534AB7', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: (!messageText.trim() || sendingMsg) ? 0.5 : 1, minWidth: '130px', justifyContent: 'center' }}
                                >
                                    {sendingMsg ? <RefreshCw size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <><Send size={15} /> Dispatch Alert</>}
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
