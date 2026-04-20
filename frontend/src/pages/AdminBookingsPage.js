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
      <div className="catalogue-hero" style={{ background: 'linear-gradient(135deg, rgba(83,74,183,1) 0%, rgba(38,33,92,1) 100%)', border: 'none', borderRadius: '24px', position: 'relative', overflow: 'hidden', padding: '3.5rem 3rem' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '0.4rem 1rem' }}>
            <ShieldCheck size={14} /> Admin Tools
          </div>
          <h1 className="hero-title" style={{ color: '#fff', fontSize: '2.75rem', marginBottom: '0.75rem', fontWeight: 800 }}>Booking Approvals</h1>
          <p className="hero-sub" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: '600px' }}>
            Review, approve, or reject booking requests across the campus seamlessly.
          </p>
        </div>
      </div>

      <div className="toolbar" style={{ margin: '2rem 0', background: 'rgba(255,255,255,0.85)', padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.8rem 1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#64748b' }}>
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
            style={{ color: '#ef4444', borderColor: '#fecaca', background: '#fff5f5', borderRadius: '12px' }}
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
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '20px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Facility</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requester</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Purpose</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attendees</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Schedule</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '1.2rem 1.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, idx) => {
                    const isLast = idx === filteredBookings.length - 1;
                    return (
                      <tr
                        key={booking.id}
                        style={{
                          borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                          transition: 'background 0.2s ease',
                          background: '#fff'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        <td style={{ padding: '1.2rem 1.5rem', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                              width: '4px',
                              height: '32px',
                              borderRadius: '4px',
                              background: booking.status === 'APPROVED' ? '#10b981' : booking.status === 'PENDING' ? '#f59e0b' : '#ef4444'
                            }} />
                            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b', letterSpacing: '-0.01em' }}>{booking.resourceName}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', verticalAlign: 'middle' }}>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: '#475569' }}>{booking.userId}</p>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', verticalAlign: 'middle' }}>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>{booking.purpose}</p>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', verticalAlign: 'middle' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                            {booking.expectedAttendees || 0}
                          </span>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{booking.date}</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{booking.startTime} - {booking.endTime}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', verticalAlign: 'middle' }}>
                          <span className={`badge ${booking.status === 'APPROVED' ? 'badge-active' : booking.status === 'REJECTED' || booking.status === 'CANCELLED' ? 'badge-oos' : ''}`} style={{ display: 'inline-block' }}>
                            {booking.status}
                          </span>
                          {booking.rejectionReason && (
                            <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.4rem', maxWidth: '120px' }}>
                              Reason: {booking.rejectionReason}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1.2rem 1.5rem', verticalAlign: 'middle', textAlign: 'right' }}>
                          {booking.status === 'PENDING' ? (
                            <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button onClick={() => handleStatusChange(booking.id, 'APPROVED')} className="btn" style={{ padding: '0.5rem 1rem', background: '#ecfdf5', color: '#059669', border: '1px solid #34d399', fontSize: '0.8rem', borderRadius: '10px', fontWeight: 600, boxShadow: '0 2px 4px rgba(16,185,129,0.1)' }}>
                                <CheckSquare size={16} /> Approve
                              </button>
                              <button onClick={() => handleStatusChange(booking.id, 'REJECTED')} className="btn" style={{ padding: '0.5rem 1rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171', fontSize: '0.8rem', borderRadius: '10px', fontWeight: 600, boxShadow: '0 2px 4px rgba(239,68,68,0.1)' }}>
                                <XSquare size={16} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>No actions</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AdminBookingsPage;
