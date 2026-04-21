import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, ArrowLeft } from 'lucide-react';
import { bookingService } from '../services/api';

const BookingPage = () => {
  const navigate = useNavigate();
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

    try {
      if (editingId) {
        await bookingService.updateBooking(editingId, formData);
      } else {
        await bookingService.createBooking(formData);
      }
      setSuccessMsg('Booking saved successfully!');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
    } catch (err) {
      let msg = err.response?.data?.message || err.message || 'Failed to save booking';
      msg = msg.replace(/^\d{3} [A-Z\s_]+ "(.*?)"$/, '$1');
      setErrorMsg(msg);
    }
  };

  return (
    <div className="catalogue-page animate-in">
      <div className="catalogue-hero" style={{ background: 'linear-gradient(135deg, #185FA5 0%, #111827 100%)', borderColor: '#185FA5', marginBottom: '2rem' }}>
        <div className="hero-content">
          <button 
            onClick={() => { navigate('/catalogue'); }}
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '999px',
              padding: '0.5rem 1.25rem',
              color: '#ffffff',
              marginBottom: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            onMouseOver={(e) => { 
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateX(-3px)';
            }}
            onMouseOut={(e) => { 
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="hero-badge" style={{ color: '#185FA5', borderColor: '#185FA5' }}>
            <CalendarPlus size={14} /> Bookings
          </div>
          <h1 className="hero-title" style={{ color: '#fff' }}>{editingId ? 'Update Booking' : 'Request New Booking'}</h1>
          <p className="hero-sub" style={{ color: '#9ca3af' }}>
            Fill out the form below to reserve a facility or equipment.
          </p>
        </div>
      </div>

      <div className="glass-card mx-auto max-w-4xl" style={{ borderColor: 'rgba(83, 74, 183, 0.2)', borderTopWidth: '4px', borderTopColor: '#534AB7', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '2.5rem' }}>
        {errorMsg && <div className="error-banner mb-6 grow-animation"><span>{errorMsg}</span></div>}
        {successMsg && <div className="success-banner mb-6 grow-animation" style={{ padding: '1.25rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}><span>{successMsg}</span></div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resource ID</label>
            <input type="text" name="resourceId" value={formData.resourceId} onChange={handleChange} required 
                   style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.8rem 1rem', borderRadius: '10px', color: '#1e293b', fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none' }} 
                   onFocus={(e) => { e.target.style.borderColor = '#534AB7'; e.target.style.boxShadow = '0 0 0 3px rgba(83, 74, 183, 0.1)'; }}
                   onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                   placeholder="e.g. RES-001" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Purpose of Booking</label>
            <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} required 
                   style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.8rem 1rem', borderRadius: '10px', color: '#1e293b', fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none' }} 
                   onFocus={(e) => { e.target.style.borderColor = '#534AB7'; e.target.style.boxShadow = '0 0 0 3px rgba(83, 74, 183, 0.1)'; }}
                   onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                   placeholder="e.g. Weekly Meeting" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required 
                   style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.8rem 1rem', borderRadius: '10px', color: '#1e293b', fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none' }} 
                   onFocus={(e) => { e.target.style.borderColor = '#534AB7'; e.target.style.boxShadow = '0 0 0 3px rgba(83, 74, 183, 0.1)'; }}
                   onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expected Attendees</label>
            <input type="number" name="expectedAttendees" value={formData.expectedAttendees} onChange={handleChange} required min="1" 
                   style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.8rem 1rem', borderRadius: '10px', color: '#1e293b', fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none' }} 
                   onFocus={(e) => { e.target.style.borderColor = '#534AB7'; e.target.style.boxShadow = '0 0 0 3px rgba(83, 74, 183, 0.1)'; }}
                   onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Time</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required 
                   style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.8rem 1rem', borderRadius: '10px', color: '#1e293b', fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none' }} 
                   onFocus={(e) => { e.target.style.borderColor = '#534AB7'; e.target.style.boxShadow = '0 0 0 3px rgba(83, 74, 183, 0.1)'; }}
                   onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Time</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required 
                   style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.8rem 1rem', borderRadius: '10px', color: '#1e293b', fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none' }} 
                   onFocus={(e) => { e.target.style.borderColor = '#534AB7'; e.target.style.boxShadow = '0 0 0 3px rgba(83, 74, 183, 0.1)'; }}
                   onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }} />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-ghost" onClick={() => { navigate('/my-bookings'); }} style={{ padding: '0.8rem 1.5rem', fontSize: '0.95rem' }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(83, 74, 183, 0.3)' }}>{editingId ? 'Update Booking' : 'Submit Request'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
