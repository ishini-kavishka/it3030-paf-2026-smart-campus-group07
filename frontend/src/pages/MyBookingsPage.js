import React, { useState, useEffect } from 'react';
import { CalendarClock, Plus, X, Edit, Trash2, Clock, Users, ArrowRight, CheckCircle2, AlertCircle, XCircle, Filter, Search } from 'lucide-react';

const MyBookingsPage = ({ setTab }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterResource, setFilterResource] = useState('');

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
    if (!window.confirm('Are you sure you want to delete this booking permanently?')) return;
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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'APPROVED':
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle2 size={16} /> };
      case 'PENDING':
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: <Clock size={16} /> };
      case 'CANCELLED':
        return { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', icon: <XCircle size={16} /> };
      case 'REJECTED':
      default:
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <AlertCircle size={16} /> };
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filterDate && booking.date !== filterDate) return false;
    if (filterStatus !== 'ALL' && booking.status !== filterStatus) return false;
    if (filterResource && booking.resourceName && !booking.resourceName.toLowerCase().includes(filterResource.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="catalogue-page animate-in">
      {/* Premium Hero Area */}
      <div className="catalogue-hero" style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
        borderColor: 'rgba(83, 74, 183, 0.3)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div className="hero-content">
          <div className="hero-badge" style={{ 
            color: '#a5b4fc', 
            background: 'rgba(83, 74, 183, 0.2)', 
            borderColor: 'rgba(165, 180, 252, 0.3)' 
          }}>
            <CalendarClock size={14} /> My Bookings
          </div>
          <h1 className="hero-title" style={{ color: '#ffffff', letterSpacing: '-0.02em', fontSize: '2.75rem' }}>
            Manage Your Reservations
          </h1>
          <p className="hero-sub" style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px' }}>
            Keep track of your upcoming schedules. View details, modify configurations, or cancel reservations directly from your dashboard.
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => { if (setTab) setTab('booking'); }} 
            style={{ 
              background: '#534AB7', 
              border: 'none',
              padding: '0.85rem 1.75rem',
              fontSize: '1rem',
              boxShadow: '0 10px 20px rgba(83, 74, 183, 0.3)'
            }}
          >
            <Plus size={18} />
            Create New Booking
          </button>
        </div>
        
        {/* Decorative elements for premium feel */}
        <div style={{
          position: 'absolute', right: '-5%', top: '-20%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(83, 74, 183, 0.4) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
      </div>

      <div className="toolbar" style={{ margin: '1.5rem 0 2.5rem 0', background: '#f8fafc', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
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

      {/* Bookings List Area */}
      {loading ? (
        <div className="loading-state"><div className="loader-ring"></div></div>
      ) : bookings.length === 0 ? (
        <div className="empty-state" style={{ background: '#ffffff', borderRadius: '1.5rem', border: '1px dashed #cbd5e1' }}>
          <div style={{ background: 'rgba(83, 74, 183, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <CalendarClock size={48} style={{ color: '#534AB7' }} />
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.5rem' }}>No Bookings Yet</h3>
          <p style={{ color: '#64748b', maxWidth: '400px', marginBottom: '2rem' }}>
            You haven't made any reservations. Explore our catalogue to find the perfect space for your next activity.
          </p>
          <button className="btn btn-primary" onClick={() => { if (setTab) setTab('booking'); }}>
            Book a Resource <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="catalogue-grid">
          {filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            
            return (
              <div 
                key={booking.id} 
                className="catalogue-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: '1.75rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
              >
                {/* Accent Top Bar */}
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', 
                  background: statusConfig.color 
                }} />

                {/* Status & Date */}
                <div className="flex justify-between items-center mb-4">
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: statusConfig.bg, color: statusConfig.color,
                    padding: '0.35rem 0.85rem', borderRadius: '50px',
                    fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    {statusConfig.icon}
                    {booking.status}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>
                    {booking.date}
                  </span>
                </div>

                {/* Main Info */}
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.25rem', fontWeight: '700' }}>
                  {booking.resourceName}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.25rem', minHeight: '40px' }}>
                  {booking.purpose}
                </p>

                {/* Metadatas */}
                <div style={{ 
                  display: 'flex', flexDirection: 'column', gap: '0.75rem', 
                  background: '#f8fafc', padding: '1rem', borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2" style={{ color: '#475569', fontWeight: '500' }}>
                      <Clock size={16} style={{ color: '#94a3b8' }} /> Time
                    </span>
                    <span style={{ color: '#0f172a', fontWeight: '600' }}>
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2" style={{ color: '#475569', fontWeight: '500' }}>
                      <Users size={16} style={{ color: '#94a3b8' }} /> Expected
                    </span>
                    <span style={{ color: '#0f172a', fontWeight: '600' }}>
                      {booking.expectedAttendees} Attendees
                    </span>
                  </div>
                </div>

                {/* Rejection Banner */}
                {booking.rejectionReason && (
                  <div className="error-banner" style={{ padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                    <AlertCircle size={16} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                      <strong>Declined:</strong> {booking.rejectionReason}
                    </span>
                  </div>
                )}

                <div style={{ flexGrow: 1 }} />

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto pt-4" style={{ borderTop: '1px solid #f1f5f9' }}>
                  {booking.status === 'PENDING' && (
                    <button 
                      onClick={() => handleEdit(booking)} 
                      className="btn btn-ghost flex-1 py-2 text-sm justify-center" 
                      style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#334155' }}
                    >
                      <Edit size={16} /> Edit
                    </button>
                  )}
                  {['PENDING', 'APPROVED'].includes(booking.status) && (
                    <button 
                      onClick={() => handleCancel(booking.id)} 
                      className="btn btn-ghost flex-1 py-2 text-sm justify-center" 
                      style={{ background: '#fff1f2', borderColor: '#ffe4e6', color: '#e11d48' }}
                    >
                      <X size={16} /> Cancel
                    </button>
                  )}
                  {['CANCELLED', 'REJECTED'].includes(booking.status) && (
                    <button 
                      onClick={() => handleDelete(booking.id)} 
                      className="btn btn-ghost flex-1 py-2 text-sm justify-center" 
                      style={{ background: '#fff1f2', borderColor: '#ffe4e6', color: '#e11d48' }}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;

