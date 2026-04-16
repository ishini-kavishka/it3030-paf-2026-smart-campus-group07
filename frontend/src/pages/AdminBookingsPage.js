import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckSquare, XSquare } from 'lucide-react';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {loading ? (
        <div className="loading-state"><div className="loader-ring"></div></div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <ShieldCheck size={48} className="mb-4 text-dim" />
          <h3>No Bookings to Manage</h3>
        </div>
      ) : (
        <div className="catalogue-grid">
          {bookings.map(booking => (
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
      )}
    </div>
  );
};

export default AdminBookingsPage;
