import React, { useState, useEffect } from 'react';
import { CalendarClock, Plus, X, Edit, Trash2 } from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: 1
  });
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const url = editingId 
      ? `http://localhost:8082/api/bookings/${editingId}`
      : 'http://localhost:8082/api/bookings';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'user-123'
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save booking');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ resourceId: '', date: '', startTime: '', endTime: '', purpose: '', expectedAttendees: 1 });
      fetchBookings();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleEdit = (booking) => {
    setFormData({
      resourceId: booking.resourceId,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      purpose: booking.purpose,
      expectedAttendees: booking.expectedAttendees
    });
    setEditingId(booking.id);
    setShowForm(true);
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
    if(!window.confirm('Delete permanently?')) return;
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
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ background: '#534AB7', border: 'none' }}>
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Close Form' : 'New Booking'}
          </button>
        </div>
      </div>

      {/* Form Area */}
      {showForm && (
        <div className="glass-card mb-6 animate-in" style={{ borderColor: '#534AB7', borderLeftWidth: '4px' }}>
          <h3 className="mb-4">{editingId ? 'Update Booking' : 'Request New Booking'}</h3>
          {errorMsg && <div className="error-banner"><span>{errorMsg}</span></div>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="flex-col">
              <label className="text-xs font-bold text-muted uppercase">Resource ID</label>
              <input type="text" name="resourceId" value={formData.resourceId} onChange={handleChange} required className="search-box input" style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
            </div>
            <div className="flex-col">
              <label className="text-xs font-bold text-muted uppercase">Purpose</label>
              <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} required className="search-box input" style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
            </div>
            <div className="flex-col">
              <label className="text-xs font-bold text-muted uppercase">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="search-box input" style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
            </div>
            <div className="flex-col">
              <label className="text-xs font-bold text-muted uppercase">Expected Attendees</label>
              <input type="number" name="expectedAttendees" value={formData.expectedAttendees} onChange={handleChange} required min="1" className="search-box input" style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
            </div>
            <div className="flex-col">
              <label className="text-xs font-bold text-muted uppercase">Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="search-box input" style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
            </div>
            <div className="flex-col">
              <label className="text-xs font-bold text-muted uppercase">End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="search-box input" style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Submit Request'}</button>
            </div>
          </form>
        </div>
      )}

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
