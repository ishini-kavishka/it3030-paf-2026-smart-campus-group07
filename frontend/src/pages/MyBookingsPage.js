import React, { useState, useEffect } from 'react';
import { CalendarClock, Plus, X, Edit, Trash2 } from 'lucide-react';

const MyBookingsPage = ({ setTab }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8082/api/bookings/my', {
        headers: { 'x-user-id': 'user-123' }
      });
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



  const handleEdit = (booking) => {
    localStorage.setItem('editBooking', JSON.stringify(booking));
    if (setTab) setTab('booking');
  };

  const handleCancel = async (id) => {
    try {
      await fetch(`http://localhost:8082/api/bookings/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'x-user-id': 'user-123' }
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete permanently?')) return;
    try {
      await fetch(`http://localhost:8082/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'user-123' }
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="catalogue-page animate-in">
      {/* Header Area */}
      <div className="catalogue-hero" style={{ background: 'linear-gradient(135deg, #185FA5 0%, #111827 100%)', borderColor: '#185FA5' }}>
        <div className="hero-content">
          <div className="hero-badge" style={{ color: '#185FA5', borderColor: '#185FA5' }}>
            <CalendarClock size={14} /> My Bookings
          </div>
          <h1 className="hero-title" style={{ color: '#fff' }}>Manage Your Reservations</h1>
          <p className="hero-sub" style={{ color: '#9ca3af' }}>
            View, update, or create new bookings for lecture halls, labs, and equipment.
          </p>
          <button className="btn btn-primary" onClick={() => { if (setTab) setTab('booking'); }} style={{ background: '#534AB7', border: 'none' }}>
            <Plus size={16} />
            New Booking
          </button>
        </div>
      </div>



      {/* Bookings List Area */}
      {loading ? (
        <div className="loading-state"><div className="loader-ring"></div></div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <CalendarClock size={48} className="mb-4 text-dim" />
          <h3>No Bookings Found</h3>
          <p>You haven't made any bookings yet.</p>
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
                <span className="text-xs font-bold text-muted">{booking.date}</span>
              </div>

              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{booking.resourceName}</h3>
              <p className="text-sm text-dim">{booking.purpose}</p>

              <div className="flex justify-between mt-2 text-sm font-medium">
                <span>{booking.startTime} - {booking.endTime}</span>
                <span>👤 {booking.expectedAttendees}</span>
              </div>

              {booking.rejectionReason && (
                <div className="error-banner mt-2 mb-0" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem' }}>Reason: {booking.rejectionReason}</span>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {booking.status === 'PENDING' && (
                  <button onClick={() => handleEdit(booking)} className="btn btn-ghost flex-1 py-1 text-xs" style={{ padding: '0.4rem' }}>
                    <Edit size={14} /> Edit
                  </button>
                )}
                {['PENDING', 'APPROVED'].includes(booking.status) && (
                  <button onClick={() => handleCancel(booking.id)} className="btn btn-ghost flex-1 py-1 text-xs" style={{ padding: '0.4rem', color: '#A32D2D' }}>
                    <X size={14} /> Cancel
                  </button>
                )}
                {['CANCELLED', 'REJECTED'].includes(booking.status) && (
                  <button onClick={() => handleDelete(booking.id)} className="btn btn-ghost flex-1 py-1 text-xs" style={{ padding: '0.4rem', color: '#A32D2D' }}>
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
