import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckSquare, XSquare, Search, Filter } from 'lucide-react';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterResource, setFilterResource] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8082/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    let reason = '';
    if (status === 'REJECTED') {
      reason = window.prompt("Enter reason for rejection:");
      if (reason === null) return; // cancelled prompt
    }

    try {
      await fetch(`http://localhost:8082/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason })
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="catalogue-page animate-in">
      <div className="catalogue-hero" style={{ background: 'linear-gradient(135deg, #111827 0%, #26215C 100%)', borderColor: '#26215C' }}>
        <div className="hero-content">
          <div className="hero-badge" style={{ color: '#26215C', borderColor: '#26215C' }}>
            <ShieldCheck size={14} /> Admin Tools
          </div>
          <h1 className="hero-title" style={{ color: '#fff' }}>Booking Approvals</h1>
          <p className="hero-sub" style={{ color: '#9ca3af' }}>
            Review, approve, or reject booking requests across the campus.
          </p>
        </div>
      </div>

      <div className="toolbar" style={{ margin: '1.5rem 0', background: '#f8fafc', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.8rem 1.25rem', background: '#f1f5f9', borderRadius: '10px', color: '#64748b' }}>
          <Filter size={16} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <input 
          type="date" 
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="filter-select"
        />
        
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by Resource..."
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
          />
        </div>

        {(filterDate || filterStatus !== 'ALL' || filterResource) && (
          <button 
            onClick={() => { setFilterDate(''); setFilterStatus('ALL'); setFilterResource(''); }}
            className="btn btn-ghost"
            style={{ color: '#e11d48', borderColor: '#ffe4e6', background: '#fff1f2' }}
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-state"><div className="loader-ring"></div></div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <ShieldCheck size={48} className="mb-4 text-dim" />
          <h3>No Bookings to Manage</h3>
        </div>
      ) : (() => {
        const filteredBookings = bookings.filter(booking => {
          if (filterDate && booking.date !== filterDate) return false;
          if (filterStatus !== 'ALL' && booking.status !== filterStatus) return false;
          if (filterResource && booking.resourceName && !booking.resourceName.toLowerCase().includes(filterResource.toLowerCase())) return false;
          return true;
        });

        if (filteredBookings.length === 0) {
          return (
            <div className="empty-state">
              <Filter size={48} className="mb-4 text-dim" />
              <h3>No match found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          );
        }

        return (
          <div className="catalogue-grid">
            {filteredBookings.map(booking => (
            <div key={booking.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: booking.status === 'APPROVED' ? '#10b981' : booking.status === 'PENDING' ? '#f59e0b' : '#ef4444' }} />

              <div className="flex justify-between items-center mt-2">
                <span className={`badge ${booking.status === 'APPROVED' ? 'badge-active' : booking.status === 'REJECTED' || booking.status === 'CANCELLED' ? 'badge-oos' : ''}`}>
                  {booking.status}
                </span>
                <span className="text-xs font-bold text-muted">{booking.date} | {booking.startTime} - {booking.endTime}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{booking.resourceName}</h3>
              <p className="text-sm text-dim">By User: {booking.userId}</p>
              <p className="text-sm font-medium mt-1">Purpose: {booking.purpose}</p>

              {booking.status === 'PENDING' && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleStatusChange(booking.id, 'APPROVED')} className="btn flex-1 py-1 text-xs" style={{ background: '#10b981', color: '#fff', border: 'none' }}>
                    <CheckSquare size={14} /> Approve
                  </button>
                  <button onClick={() => handleStatusChange(booking.id, 'REJECTED')} className="btn flex-1 py-1 text-xs" style={{ background: '#ef4444', color: '#fff', border: 'none' }}>
                    <XSquare size={14} /> Reject
                  </button>
                </div>
              )}

              {booking.rejectionReason && (
                <div className="error-banner mt-4 mb-0" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem' }}>Rejected: {booking.rejectionReason}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        );
      })()}
    </div>
  );
};

export default AdminBookingsPage;
