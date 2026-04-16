import React, { useState, useEffect, useMemo } from 'react';
import { resourceService } from '../services/api';
import {
  Search, Filter, MapPin, Users, Clock, Layers,
  Monitor, FlaskConical, Mic2, Building2, DoorOpen,
  CheckCircle2, AlertCircle, RefreshCw, BookOpen, ChevronDown, X
} from 'lucide-react';

// ─── Type icon & colour map ───────────────────────────────────────────────────
const TYPE_META = {
  CLASSROOM: { icon: Monitor, color: '#6366f1', label: 'Classroom' },
  LAB: { icon: FlaskConical, color: '#0ea5e9', label: 'Laboratory' },
  AUDITORIUM: { icon: Mic2, color: '#a855f7', label: 'Auditorium' },
  OFFICE: { icon: Building2, color: '#f59e0b', label: 'Office' },
  MEETING_ROOM: { icon: DoorOpen, color: '#10b981', label: 'Meeting Room' },
  DEFAULT: { icon: BookOpen, color: '#94a3b8', label: 'Facility' },
};

function getTypeMeta(type) {
  const key = (type || '').toUpperCase().replace(/\s+/g, '_');
  return TYPE_META[key] || { ...TYPE_META.DEFAULT, label: type || 'Facility' };
}

// ─── Public Resource Card ─────────────────────────────────────────────────────
const PublicResourceCard = ({ resource, onViewDetails }) => {
  const meta = getTypeMeta(resource.type);
  const Icon = meta.icon;
  const isActive = resource.status === 'ACTIVE';

  return (
    <div
      className="catalogue-card animate-in"
      style={{ '--accent-color': meta.color }}
    >
      {/* Top accent bar */}
      <div className="card-accent-bar" style={{ background: meta.color }} />

      <div style={{ padding: '1.5rem' }}>
        {/* Header row */}
        <div className="flex justify-between items-center mb-4">
          <div
            className="type-icon-wrap"
            style={{ background: `${meta.color}18`, color: meta.color }}
          >
            <Icon size={22} />
          </div>
          <span className={`badge ${isActive ? 'badge-active' : 'badge-oos'}`}>
            {isActive ? '● Available' : '● Unavailable'}
          </span>
        </div>

        {/* Name & type */}
        <h3 className="text-white font-bold mb-1" style={{ fontSize: '1.1rem', lineHeight: 1.3 }}>
          {resource.name}
        </h3>
        <p className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: meta.color, letterSpacing: '0.12em' }}>
          {meta.label}
        </p>

        {/* Details */}
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex items-center gap-2 text-muted text-sm">
            <MapPin size={14} />
            <span>{resource.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted text-sm">
            <Users size={14} />
            <span>Capacity: <strong style={{ color: '#f8fafc' }}>{resource.capacity}</strong> people</span>
          </div>
          <div className="flex items-center gap-2 text-muted text-sm">
            <Clock size={14} />
            <span>
              {resource.availableFrom
                ? String(resource.availableFrom).slice(0, 5)
                : '08:00'}
              {' – '}
              {resource.availableTo
                ? String(resource.availableTo).slice(0, 5)
                : '20:00'}
            </span>
          </div>
        </div>

        {/* View details button */}
        <button
          onClick={() => onViewDetails(resource)}
          disabled={!isActive}
          className="catalogue-view-btn w-full"
          style={{
            background: isActive ? `${meta.color}22` : 'rgba(255,255,255,0.03)',
            color: isActive ? meta.color : 'var(--text-dim)',
            borderColor: isActive ? `${meta.color}44` : 'var(--glass-border)',
            cursor: isActive ? 'pointer' : 'not-allowed',
          }}
        >
          {isActive ? 'View Details' : 'Out of Service'}
        </button>
      </div>
    </div>
  );
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const ResourceDetailModal = ({ resource, onClose, setTab }) => {
  if (!resource) return null;
  const meta = getTypeMeta(resource.type);
  const Icon = meta.icon;
  const isActive = resource.status === 'ACTIVE';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(15, 23, 42, 0.1)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="detail-modal animate-in"
        onClick={e => e.stopPropagation()}
        style={{ '--accent-color': meta.color }}
      >
        {/* Gradient header */}
        <div
          className="modal-hero"
          style={{ background: `linear-gradient(135deg, ${meta.color}28, transparent)` }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="type-icon-wrap-lg" style={{ background: `${meta.color}22`, color: meta.color }}>
                <Icon size={32} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: meta.color }}>
                  {meta.label}
                </p>
                <h2 className="text-white font-bold" style={{ fontSize: '1.6rem', lineHeight: 1.2 }}>
                  {resource.name}
                </h2>
              </div>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '0.75rem' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Status badge */}
          <div className="flex items-center gap-3 mb-6">
            {isActive
              ? <><CheckCircle2 size={18} color="#10b981" /><span style={{ color: '#10b981', fontWeight: 700 }}>This facility is currently available</span></>
              : <><AlertCircle size={18} color="#f43f5e" /><span style={{ color: '#f43f5e', fontWeight: 700 }}>This facility is currently out of service</span></>
            }
          </div>

          {/* Info grid */}
          <div className="detail-grid">
            <div className="detail-item">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Location</p>
              <div className="flex items-center gap-2">
                <MapPin size={16} style={{ color: meta.color }} />
                <p className="text-white font-bold">{resource.location}</p>
              </div>
            </div>
            <div className="detail-item">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Capacity</p>
              <div className="flex items-center gap-2">
                <Users size={16} style={{ color: meta.color }} />
                <p className="text-white font-bold">{resource.capacity} people</p>
              </div>
            </div>
            <div className="detail-item">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Available From</p>
              <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: meta.color }} />
                <p className="text-white font-bold">
                  {resource.availableFrom ? String(resource.availableFrom).slice(0, 5) : '08:00'}
                </p>
              </div>
            </div>
            <div className="detail-item">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Available To</p>
              <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: meta.color }} />
                <p className="text-white font-bold">
                  {resource.availableTo ? String(resource.availableTo).slice(0, 5) : '20:00'}
                </p>
              </div>
            </div>
            <div className="detail-item" style={{ gridColumn: 'span 2' }}>
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Resource ID</p>
              <p className="text-white font-bold" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {resource.id}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button onClick={onClose} className="btn btn-ghost flex-1">
              Close
            </button>
            {isActive && (
              <button
                onClick={() => {
                  onClose();
                  localStorage.setItem('bookingResource', resource.id);
                  if (setTab) setTab('booking');
                }}
                className="btn btn-primary flex-1"
                style={{ background: meta.color, borderColor: meta.color, color: '#fff' }}
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Catalogue Page ──────────────────────────────────────────────────────
const CataloguePage = ({ setTab }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ACTIVE');
  const [minCapacity, setMinCapacity] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourceService.getAllResources();
      setResources(data);
    } catch (err) {
      setError('Unable to load facilities. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const filtered = useMemo(() => {
    return resources.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        r.name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.type || '').toLowerCase().includes(q);
      const matchType = filterType === 'ALL' || (r.type || '').toUpperCase().replace(/\s+/g, '_') === filterType;
      const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
      const matchCap = !minCapacity || r.capacity >= parseInt(minCapacity, 10);
      return matchSearch && matchType && matchStatus && matchCap;
    });
  }, [resources, searchQuery, filterType, filterStatus, minCapacity]);

  const activeCount = resources.filter(r => r.status === 'ACTIVE').length;

  return (
    <div className="catalogue-page">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <div className="catalogue-hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">
            <Layers size={14} />
            <span>Facilities Catalogue</span>
          </div>
          <h1 className="hero-title">Campus Resource Hub</h1>
          <p className="hero-sub">
            Browse and explore all bookable facilities on campus — lecture halls,
            labs, meeting rooms, and more.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-val">{resources.length}</span>
              <span className="hero-stat-label">Total Facilities</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val" style={{ color: '#10b981' }}>{activeCount}</span>
              <span className="hero-stat-label">Available Now</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val" style={{ color: '#f43f5e' }}>{resources.length - activeCount}</span>
              <span className="hero-stat-label">Out of Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ──────────────────────────────────────── */}
      <div className="catalogue-toolbar">
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, location, or type…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(p => !p)}
          className="btn btn-ghost"
          style={{ gap: '0.5rem' }}
        >
          <Filter size={16} />
          Filters
          <ChevronDown size={14} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>

        <button onClick={fetchResources} className="btn btn-ghost" title="Refresh">
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {/* ── Expandable Filter Panel ──────────────────────────────────── */}
      {showFilters && (
        <div className="filter-panel animate-in">
          <div className="filter-panel-grid">
            <div className="filter-group">
              <label className="filter-label">Facility Type</label>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Types</option>
                <option value="CLASSROOM">Classroom</option>
                <option value="LAB">Laboratory</option>
                <option value="AUDITORIUM">Auditorium</option>
                <option value="OFFICE">Office</option>
                <option value="MEETING_ROOM">Meeting Room</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Availability</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All</option>
                <option value="ACTIVE">Available Only</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Min. Capacity</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 30"
                value={minCapacity}
                onChange={e => setMinCapacity(e.target.value)}
                className="filter-select"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div className="filter-group" style={{ justifyContent: 'flex-end', display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => { setFilterType('ALL'); setFilterStatus('ACTIVE'); setMinCapacity(''); setSearchQuery(''); }}
                className="btn btn-ghost"
                style={{ fontSize: '0.8rem' }}
              >
                <X size={14} /> Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Error Banner ─────────────────────────────────────────────── */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={fetchResources} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Retry</button>
        </div>
      )}

      {/* ── Result count ─────────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="result-meta">
          <Layers size={14} />
          <span>Showing <strong>{filtered.length}</strong> of <strong>{resources.length}</strong> facilities</span>
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      {loading && resources.length === 0 ? (
        <div className="loading-state">
          <div className="loader-ring" />
          <p className="text-muted text-sm mt-4">Loading campus facilities…</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="catalogue-grid">
          {filtered.map(resource => (
            <PublicResourceCard
              key={resource.id}
              resource={resource}
              onViewDetails={setSelectedResource}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={48} />
          <h3 className="text-white font-bold mt-4">No facilities found</h3>
          <p className="text-muted text-sm mt-2">
            Try adjusting your search terms or filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setFilterType('ALL'); setFilterStatus('ACTIVE'); setMinCapacity(''); }}
            className="btn btn-ghost mt-4"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────────────────────────── */}
      {selectedResource && (
        <ResourceDetailModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          setTab={setTab}
        />
      )}
    </div>
  );
};

export default CataloguePage;
