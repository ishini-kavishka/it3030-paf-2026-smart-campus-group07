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

      <div className="filters-section mt-6 mb-6 px-6" style={{maxWidth: '1200px', margin: '1.5rem auto 1.5rem auto', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}>
          <Filter size={16} className="text-dim" />
          <span className="text-sm font-medium text-dim">Filters:</span>
        </div>
        
        <input 
          type="date" 
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}
        />
        
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}
        >
          <option value="ALL" style={{color: '#000'}}>All Statuses</option>
          <option value="PENDING" style={{color: '#000'}}>Pending</option>
          <option value="APPROVED" style={{color: '#000'}}>Approved</option>
          <option value="REJECTED" style={{color: '#000'}}>Rejected</option>
          <option value="CANCELLED" style={{color: '#000'}}>Cancelled</option>
        </select>
        
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px'}}>
          <Search size={16} style={{position: 'absolute', left: '1rem', color: '#9ca3af'}} />
          <input 
            type="text" 
            placeholder="Search by Resource..."
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '8px', fontSize: '0.9rem' }}
          />
        </div>

        {(filterDate || filterStatus !== 'ALL' || filterResource) && (
          <button 
            onClick={() => { setFilterDate(''); setFilterStatus('ALL'); setFilterResource(''); }}
            style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' }}
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
