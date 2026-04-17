import React, { useState, useEffect } from 'react';
import { CalendarPlus } from 'lucide-react';

const BookingPage = ({ setTab }) => {
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
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Check for resource ID from 'Book Now'
    const resourceId = localStorage.getItem('bookingResource');
    if (resourceId) {
      setFormData(prev => ({ ...prev, resourceId }));
      localStorage.removeItem('bookingResource');
    }

    // Check for edit booking
    const editBookingStr = localStorage.getItem('editBooking');
    if (editBookingStr) {
      try {
        const booking = JSON.parse(editBookingStr);
        setFormData({
          resourceId: booking.resourceId,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          purpose: booking.purpose,
          expectedAttendees: booking.expectedAttendees
        });
        setEditingId(booking.id);
      } catch (e) {
        console.error(e);
      }
      localStorage.removeItem('editBooking');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Additional validation for past dates
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Adding time zone offset to ensure local date comparison is accurate
    selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());
    
    if (selectedDate < today) {
      setErrorMsg('You cannot select a past date for a booking.');
      return;
    }

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
        let msg = errData.message || 'Failed to save booking';
        // Strip Spring Boot status code prefix like '409 CONFLICT "message"'
        msg = msg.replace(/^\d{3} [A-Z\s]+ "(.*?)"$/, '$1');
        throw new Error(msg);
      }
      setSuccessMsg('Booking saved successfully!');
      setTimeout(() => {
        if (setTab) setTab('my-bookings');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="catalogue-page animate-in">
      <div className="catalogue-hero" style={{ background: 'linear-gradient(135deg, #185FA5 0%, #111827 100%)', borderColor: '#185FA5', marginBottom: '2rem' }}>
        <div className="hero-content">
          <div className="hero-badge" style={{ color: '#185FA5', borderColor: '#185FA5' }}>
            <CalendarPlus size={14} /> Bookings
          </div>
          <h1 className="hero-title" style={{ color: '#fff' }}>{editingId ? 'Update Booking' : 'Request New Booking'}</h1>
          <p className="hero-sub" style={{ color: '#9ca3af' }}>
            Fill out the form below to reserve a facility or equipment.
          </p>
        </div>
      </div>

      <div className="glass-card mx-auto max-w-4xl" style={{ borderColor: '#534AB7', borderLeftWidth: '4px' }}>
        {errorMsg && <div className="error-banner mb-4"><span>{errorMsg}</span></div>}
        {successMsg && <div className="success-banner mb-4" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981', borderRadius: '8px' }}><span>{successMsg}</span></div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="flex-col">
            <label className="text-xs font-bold text-muted uppercase mb-1">Resource ID</label>
            <input type="text" name="resourceId" value={formData.resourceId} onChange={handleChange} required className="search-box input" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          </div>
          <div className="flex-col">
            <label className="text-xs font-bold text-muted uppercase mb-1">Purpose</label>
            <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} required className="search-box input" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          </div>
          <div className="flex-col">
            <label className="text-xs font-bold text-muted uppercase mb-1">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required className="search-box input" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          </div>
          <div className="flex-col">
            <label className="text-xs font-bold text-muted uppercase mb-1">Expected Attendees</label>
            <input type="number" name="expectedAttendees" value={formData.expectedAttendees} onChange={handleChange} required min="1" className="search-box input" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          </div>
          <div className="flex-col">
            <label className="text-xs font-bold text-muted uppercase mb-1">Start Time</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="search-box input" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          </div>
          <div className="flex-col">
            <label className="text-xs font-bold text-muted uppercase mb-1">End Time</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="search-box input" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => { if (setTab) setTab('my-bookings'); }}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Update Booking' : 'Submit Request'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
