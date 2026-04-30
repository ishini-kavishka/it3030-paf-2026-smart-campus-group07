import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, CheckSquare, XSquare, Search, Filter, Download, CalendarClock, Clock, CheckCircle, XCircle } from 'lucide-react';
import { bookingService } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
      const data = await bookingService.getAllBookings();
      setBookings(data);
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
      reason = window.prompt(`Enter reason for rejection:`);
      if (reason === null) return; // cancelled prompt
    }

    try {
      await bookingService.updateBookingStatus(id, status, reason);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking?")) return;
    try {
      await bookingService.deleteBooking(id);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filterDate && booking.date !== filterDate) return false;
    if (filterStatus !== 'ALL' && booking.status !== filterStatus) return false;
    if (filterResource && booking.resourceName && !booking.resourceName.toLowerCase().includes(filterResource.toLowerCase())) return false;
    return true;
  });

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'PENDING').length;
    const approved = bookings.filter(b => b.status === 'APPROVED').length;
    const rejected = bookings.filter(b => b.status === 'REJECTED' || b.status === 'CANCELLED').length;
    return { total, pending, approved, rejected };
  }, [bookings]);

  const statCards = [
    { label: 'Total Bookings', value: stats.total, icon: <CalendarClock size={20} />, color: '#6366f1', bg: '#eef2ff' },
    { label: 'Pending', value: stats.pending, icon: <Clock size={20} />, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Approved', value: stats.approved, icon: <CheckCircle size={20} />, color: '#10b981', bg: '#d1fae5' },
    { label: 'Rejected / Canceled', value: stats.rejected, icon: <XCircle size={20} />, color: '#f43f5e', bg: '#ffe4e6' },
  ];

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header Background
    doc.setFillColor(83, 74, 183);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text('SMART CAMPUS HUB', 14, 20);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text('Admin Bookings Report', 14, 30);

    // Generation Details & Summary
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 50);

    const totalBookings = filteredBookings.length;
    const pendingBookings = filteredBookings.filter(b => b.status === 'PENDING').length;
    doc.setTextColor(50, 50, 50);
    doc.text(`Total Bookings: ${totalBookings}   |   Pending: ${pendingBookings}`, 14, 58);

    const tableColumn = ["Facility", "Requester", "Purpose", "Attendees", "Date", "Schedule", "Status"];
    const tableRows = [];

    filteredBookings.forEach(booking => {
      const bookingData = [
        booking.resourceName || 'N/A',
        booking.userId || 'N/A',
        booking.purpose || 'N/A',
        booking.expectedAttendees || 0,
        booking.date || 'N/A',
        `${booking.startTime || ''} - ${booking.endTime || ''}`,
        booking.status || 'N/A'
      ];
      tableRows.push(bookingData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: 'striped',
      styles: {
        fontSize: 8.5,
        font: 'helvetica',
        cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
      },
      headStyles: {
        fillColor: [83, 74, 183],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        textColor: [50, 50, 50],
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 25 },       // Facility
        1: { cellWidth: 22 },                          // Requester
        2: { cellWidth: 'auto' },                      // Purpose
        3: { halign: 'center', cellWidth: 20 },        // Attendees
        4: { cellWidth: 22 },                          // Date
        5: { cellWidth: 28 },                          // Schedule
        6: { fontStyle: 'bold', halign: 'center', cellWidth: 24 } // Status
      },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 6) {
          const status = data.cell.text[0];
          if (status === 'APPROVED') {
            data.cell.styles.textColor = [16, 185, 129];
          } else if (status === 'REJECTED' || status === 'CANCELLED') {
            data.cell.styles.textColor = [239, 68, 68];
          } else if (status === 'PENDING') {
            data.cell.styles.textColor = [245, 158, 11];
          }
        }
      }
    });

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
        align: 'center'
      });
    }

    doc.save('Admin_Bookings_Report.pdf');
  };

  return (
    <div className="catalogue-page animate-in">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={18} style={{ color: '#6366f1' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6366f1' }}>
              Booking Approvals
            </span>
          </div>
          <h1 style={{ color: '#111827', fontWeight: 800, fontSize: '2.25rem', letterSpacing: '-0.02em', margin: 0 }}>
            Admin Bookings
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem', fontSize: '1rem' }}>Review, approve, or reject booking requests across the campus</p>
        </div>
      </header>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {statCards.map(card => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
            padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center',
            gap: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '12px',
              background: card.bg, color: card.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                {card.value}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginTop: '0.3rem' }}>
                {card.label}
              </div>
            </div>
          </div>
        ))}
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

        <button
          onClick={generatePDF}
          className="btn"
          style={{
            marginLeft: 'auto',
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '0.6rem 1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
          }}
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>

      {loading ? (
        <div className="loading-state"><div className="loader-ring"></div></div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <ShieldCheck size={48} className="mb-4 text-dim" />
          <h3>No Bookings to Manage</h3>
        </div>
      ) : (() => {
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
                          ) : booking.status === 'APPROVED' ? (
                            <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button onClick={() => handleStatusChange(booking.id, 'CANCELLED')} className="btn" style={{ padding: '0.5rem 1rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6', fontSize: '0.8rem', borderRadius: '10px', fontWeight: 600, boxShadow: '0 2px 4px rgba(225,29,72,0.1)' }}>
                                <XSquare size={16} /> Cancel
                              </button>
                            </div>
                          ) : booking.status === 'CANCELLED' ? (
                            <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button onClick={() => handleDelete(booking.id)} className="btn" style={{ padding: '0.5rem 1rem', background: '#f8fafc', color: '#64748b', border: '1px solid #cbd5e1', fontSize: '0.8rem', borderRadius: '10px', fontWeight: 600 }}>
                                <XSquare size={16} /> Delete
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
