import React, { useState, useEffect, useMemo } from 'react';
import StatCards from '../components/StatCards';
import ResourceCard from '../components/ResourceCard';
import ResourceForm from '../components/ResourceForm';
import AdminUserList from '../components/AdminUserList';
import { resourceService } from '../services/api';
import { Search, Plus, Filter, RefreshCw, Layers, ShieldCheck, Users } from 'lucide-react';

const RESOURCE_TYPES = ['CLASSROOM', 'LAB', 'AUDITORIUM', 'OFFICE', 'MEETING_ROOM'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('RESOURCES');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResource, setSelected] = useState(null);
  const [searchQuery, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getAllResources();
      setResources(data);
      setError(null);
    } catch (err) {
      setError('Connection failed. Please ensure the backend server is running on port 8082.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

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

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────── */}
      <header className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} style={{ color: '#6366f1' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6366f1' }}>
              Facilities & Assets
            </span>
          </div>
          <h1 className="text-white font-bold" style={{ fontSize: '2.25rem', letterSpacing: '-0.02em' }}>
            Admin Dashboard
          </h1>
          <p className="text-muted">Manage campus facilities and user accounts</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('RESOURCES')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'RESOURCES' ? 'bg-[#6366f1] text-white shadow-lg' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
          >
            <ShieldCheck size={18} />
            Resources
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'USERS' ? 'bg-[#6366f1] text-white shadow-lg' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
          >
            <Users size={18} />
            Users
          </button>
        </div>
      </header>

      {activeTab === 'RESOURCES' ? (
        <>
          <div className="flex justify-end gap-3 mb-6">
            <button onClick={fetchResources} className="btn btn-ghost" title="Reload Data">
              <RefreshCw size={20} className={loading ? 'spin' : ''} />
            </button>
            <button
              onClick={() => { setSelected(null); setIsFormOpen(true); }}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Add Resource
            </button>
          </div>

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
              <Layers size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted">
                {filteredResources.length} records
              </span>
            </div>
          </div>

          {/* ── Error Banner ─────────────────────────────────────────── */}
          {error && (
            <div
              className="glass-card mb-8"
              style={{ border: '1px solid rgba(244,63,94,0.2)', background: 'rgba(244,63,94,0.05)' }}
            >
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase" style={{ color: '#f43f5e' }}>{error}</p>
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
          {loading && resources.length === 0 ? (
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
        </>
      ) : (
        <AdminUserList />
      )}
    </>
  );
};

export default AdminDashboard;
