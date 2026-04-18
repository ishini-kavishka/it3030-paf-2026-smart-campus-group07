import React, { useState, useEffect, useMemo } from 'react';
import StatCards from '../components/StatCards';
import ResourceCard from '../components/ResourceCard';
import ResourceForm from '../components/ResourceForm';
import { resourceService } from '../services/api';
import { Search, Plus, Filter, RefreshCw, Layers, ShieldCheck, Users, Ban, CheckCircle } from 'lucide-react';
import axios from 'axios';

const RESOURCE_TYPES = ['CLASSROOM', 'LAB', 'AUDITORIUM', 'OFFICE', 'MEETING_ROOM'];

const AdminDashboard = () => {
  const [activeAdminTab, setActiveAdminTab] = useState('facilities');

  // Facilities State
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [errorResources, setErrorResources] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResource, setSelected] = useState(null);
  const [searchQuery, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Users State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Fetch Facilities
  const fetchResources = async () => {
    try {
      setLoadingResources(true);
      const data = await resourceService.getAllResources();
      setResources(data);
      setErrorResources(null);
    } catch (err) {
      setErrorResources('Connection failed. Please ensure the backend server is running on port 8082.');
      console.error(err);
    } finally {
      setLoadingResources(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await axios.get('http://localhost:8082/api/auth/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeAdminTab === 'facilities') {
      fetchResources();
    } else {
      fetchUsers();
    }
  }, [activeAdminTab]);

  const stats = useMemo(() => ({
    total: resources.length,
    active: resources.filter(r => r.status === 'ACTIVE').length,
    oos: resources.filter(r => r.status !== 'ACTIVE').length,
    avgCapacity: resources.length > 0
      ? Math.round(resources.reduce((a, c) => a + c.capacity, 0) / resources.length)
      : 0,
  }), [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        r.name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q);
      const matchType = filterType === 'ALL' ||
        (r.type || '').toUpperCase().replace(/\s+/g, '_') === filterType;
      return matchSearch && matchType;
    });
  }, [resources, searchQuery, filterType]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = userSearchQuery.toLowerCase();
      return (u.name || '').toLowerCase().includes(q) ||
             (u.email || '').toLowerCase().includes(q);
    });
  }, [users, userSearchQuery]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (selectedResource) {
        const updated = await resourceService.updateResource(selectedResource.id, formData);
        setResources(prev => prev.map(r => r.id === selectedResource.id ? updated : r));
      } else {
        const created = await resourceService.createResource(formData);
        setResources(prev => [...prev, created]);
      }
      setIsFormOpen(false);
      setSelected(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error saving resource.';
      alert(`Save Failed: ${msg}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this facility? This cannot be undone.')) return;
    try {
      await resourceService.deleteResource(id);
      setResources(prev => prev.filter(r => r.id !== id));
    } catch {
      alert('Delete failed. Please try again.');
    }
  };

  const handleStatusToggle = async (id, newStatus) => {
    try {
      await resourceService.updateStatus(id, newStatus);
      fetchResources();
    } catch {
      alert('Status update failed.');
    }
  };

  const toggleUserSuspension = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:8082/api/auth/users/${id}/suspend`, { suspended: !currentStatus });
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────── */}
      <header className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} style={{ color: '#6366f1' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6366f1' }}>
              Administration
            </span>
          </div>
          <h1 className="text-white font-bold" style={{ fontSize: '2.25rem', letterSpacing: '-0.02em' }}>
            System Control Panel
          </h1>
          <p className="text-muted">Manage campus facilities and user accounts</p>
        </div>

        <div className="flex gap-2 p-1 bg-surface-alt rounded-lg border border-surface-border">
          <button 
            className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeAdminTab === 'facilities' ? 'bg-indigo-600 text-white' : 'text-muted hover:text-white'}`}
            onClick={() => setActiveAdminTab('facilities')}
          >
            Facilities
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 transition-colors ${activeAdminTab === 'users' ? 'bg-indigo-600 text-white' : 'text-muted hover:text-white'}`}
            onClick={() => setActiveAdminTab('users')}
          >
            Users
          </button>
        </div>
      </header>

      {activeAdminTab === 'facilities' && (
        <div className="animate-in">
          {/* ── Stat Cards ──────────────────────────────────────────── */}
          <StatCards stats={stats} />

          {/* ── Search / Filter Toolbar ──────────────────────────────── */}
          <div className="toolbar glass-card" style={{ padding: '1rem', borderStyle: 'dashed' }}>
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by facility name or location…"
                value={searchQuery}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Filter size={18} className="text-muted" />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Types</option>
                {RESOURCE_TYPES.map(t => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginLeft: 'auto' }} className="flex items-center gap-2">
              <button onClick={fetchResources} className="btn btn-ghost" title="Reload Data">
                <RefreshCw size={16} className={loadingResources ? 'spin' : ''} />
              </button>
              <button
                onClick={() => { setSelected(null); setIsFormOpen(true); }}
                className="btn btn-primary"
              >
                <Plus size={16} /> Add Resource
              </button>
              <div className="w-px h-6 bg-surface-border mx-2"></div>
              <Layers size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted">
                {filteredResources.length} records
              </span>
            </div>
          </div>

          {/* ── Error Banner ─────────────────────────────────────────── */}
          {errorResources && (
            <div
              className="glass-card mb-8"
              style={{ border: '1px solid rgba(244,63,94,0.2)', background: 'rgba(244,63,94,0.05)' }}
            >
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase" style={{ color: '#f43f5e' }}>{errorResources}</p>
                <button
                  onClick={fetchResources}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem' }}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* ── Results Grid ─────────────────────────────────────────── */}
          {loadingResources && resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div
                className="spin"
                style={{
                  width: '40px', height: '40px',
                  border: '3px solid rgba(99,102,241,0.1)',
                  borderTopColor: '#6366f1',
                  borderRadius: '50%',
                }}
              />
              <p className="text-muted text-sm mt-4">Connecting to core…</p>
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="resource-grid">
              {filteredResources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onEdit={r => { setSelected(r); setIsFormOpen(true); }}
                  onDelete={handleDelete}
                  onStatusToggle={handleStatusToggle}
                />
              ))}
            </div>
          ) : (
            <div
              className="glass-card flex flex-col items-center justify-center py-20"
              style={{ borderStyle: 'dashed' }}
            >
              <Search size={48} className="text-dim mb-4" />
              <h3 className="text-white font-bold">No facilities found</h3>
              <p className="text-muted text-sm px-10 text-center">
                Adjust your search or category filters, or add a new resource.
              </p>
            </div>
          )}

          {/* ── Create / Edit Modal ──────────────────────────────────── */}
          <ResourceForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            resource={selectedResource}
            onSubmit={handleCreateOrUpdate}
          />
        </div>
      )}

      {activeAdminTab === 'users' && (
        <div className="animate-in">
          <div className="toolbar glass-card" style={{ padding: '1rem', borderStyle: 'dashed', marginBottom: '2rem' }}>
            <div className="search-box" style={{ flex: 1 }}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search users by name or email…"
                value={userSearchQuery}
                onChange={e => setUserSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ marginLeft: 'auto' }} className="flex items-center gap-2">
              <button onClick={fetchUsers} className="btn btn-ghost" title="Reload Users">
                <RefreshCw size={16} className={loadingUsers ? 'spin' : ''} />
              </button>
              <div className="w-px h-6 bg-surface-border mx-2"></div>
              <Users size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted">
                {filteredUsers.length} users
              </span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', tracking: 'widest' }}>User Name</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', tracking: 'widest' }}>Email</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', tracking: 'widest' }}>Phone</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', tracking: 'widest' }}>Role</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', tracking: 'widest' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', tracking: 'widest', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                    <td style={{ padding: '1rem', color: '#fff', fontWeight: 'bold' }}>{u.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.phone || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--surface-alt)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {u.suspended ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          <Ban size={14} /> Suspended
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          <CheckCircle size={14} /> Active
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => toggleUserSuspension(u.id, u.suspended)}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${u.suspended ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                      >
                        {u.suspended ? 'Activate User' : 'Suspend User'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && !loadingUsers && (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No users found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
