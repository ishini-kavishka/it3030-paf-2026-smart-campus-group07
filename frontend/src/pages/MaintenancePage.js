import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { incidentService } from '../services/api';
import { Wrench, Plus, Search, Filter, RefreshCw, Layers, Clock, CheckCircle2, AlertCircle, X, Paperclip, MessageSquare, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRIORITY_COLORS = {
  LOW: { bg: 'rgba(52, 211, 153, 0.1)', border: 'rgba(52, 211, 153, 0.2)', text: '#34d399' },
  MEDIUM: { bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.2)', text: '#60a5fa' },
  HIGH: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
  CRITICAL: { bg: 'rgba(248, 113, 113, 0.1)', border: 'rgba(248, 113, 113, 0.2)', text: '#f87171' }
};

const STATUS_COLORS = {
  OPEN: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
  IN_PROGRESS: { bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.2)', text: '#60a5fa' },
  RESOLVED: { bg: 'rgba(52, 211, 153, 0.1)', border: 'rgba(52, 211, 153, 0.2)', text: '#34d399' }
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0, y: 50, scale: 0.3 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.5 }} className={`fixed bottom-4 right-4 z-[9999] px-6 py-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] flex items-center gap-3 backdrop-blur-md border ${type === 'success' ? 'bg-emerald-500/90 border-emerald-400' : 'bg-red-500/90 border-red-400'} text-white font-bold tracking-wide`}>
      {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      {message}
    </motion.div>
  );
};

const MaintenancePage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'LOW', attachments: '' });
  const [updateMsg, setUpdateMsg] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [technicianName, setTechnicianName] = useState('');

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await incidentService.getAllTickets();
      setTickets(data);
    } catch (err) {
      showToast('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const q = searchQuery.toLowerCase();
      const matchSearch = String(t.title).toLowerCase().includes(q) || String(t.description).toLowerCase().includes(q);
      const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [tickets, searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    critical: tickets.filter(t => t.priority === 'CRITICAL' && t.status !== 'RESOLVED').length
  }), [tickets]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        attachments: formData.attachments ? formData.attachments.split(',').map(a => a.trim()) : []
      };
      await incidentService.createTicket(payload);
      setFormData({ title: '', description: '', priority: 'LOW', attachments: '' });
      setIsFormOpen(false);
      showToast('Incident reported successfully!');
      fetchTickets();
    } catch (err) {
      showToast('Failed to report incident.', 'error');
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      let finalMessage = updateMsg;
      if (technicianName && !finalMessage.includes("Assigned to")) {
          finalMessage = updateMsg ? `[Assigned to ${technicianName}] ${updateMsg}` : `[Assigned to ${technicianName}] Status updated`;
      }
      
      const payload = {
        status: updateStatus || selectedTicket.status,
        updateMessage: finalMessage
      };
      await incidentService.updateTicket(selectedTicket.id, payload);
      setUpdateMsg('');
      setUpdateStatus('');
      setTechnicianName('');
      showToast('Ticket updated successfully!');
      
      const updated = await incidentService.getAllTickets().then(datas => datas.find(d => d.id === selectedTicket.id));
      setSelectedTicket(updated);
      fetchTickets();
    } catch (err) {
      showToast('Failed to execute ticket update.', 'error');
    }
  };

  const getAssignedTech = (ticket) => {
     if (!ticket || !ticket.technicianUpdates) return null;
     const updates = ticket.technicianUpdates.filter(u => u.updateMessage && u.updateMessage.includes("[Assigned to "));
     if (updates.length > 0) {
         const lastMsg = updates[updates.length - 1].updateMessage;
         const match = lastMsg.match(/\[Assigned to (.*?)\]/);
         return match ? match[1] : null;
     }
     return null;
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this ticket? This cannot be undone.')) return;
    try {
      await incidentService.deleteTicket(id);
      setTickets(prev => prev.filter(t => t.id !== id));
      if (selectedTicket?.id === id) setSelectedTicket(null);
      showToast('Ticket deleted successfully!');
    } catch {
      showToast('Ticket delete failed.', 'error');
    }
  };

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wrench size={18} style={{ color: '#6366f1' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6366f1' }}>
              Incidents & Maintenance
            </span>
          </div>
          <h1 className="text-white font-bold" style={{ fontSize: '2.25rem', letterSpacing: '-0.02em' }}>
            Ticket Management
          </h1>
          <p className="text-muted">Track and resolve campus incidents.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tickets', val: stats.total, icon: Layers, color: '#6366f1' },
          { label: 'Open', val: stats.open, icon: Clock, color: '#fbbf24' },
          { label: 'In Progress', val: stats.inProgress, icon: Briefcase, color: '#60a5fa' },
          { label: 'Critical Alert', val: stats.critical, icon: AlertCircle, color: '#f87171' },
        ].map((s, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="glass-card" style={{ padding: '1.25rem', border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ background: `${s.color}15`, padding: '0.75rem', borderRadius: '1rem' }}><s.icon size={24} color={s.color} /></div>
             <div>
               <p className="text-muted text-xs font-bold uppercase">{s.label}</p>
               <h3 className="text-white text-2xl font-bold">{s.val}</h3>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="toolbar glass-card" style={{ padding: '1rem', borderStyle: 'dashed', marginBottom: '1.5rem' }}>
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Search tickets..." value={searchQuery} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-muted" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
            <option value="ALL">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
        <div className="flex gap-3 ml-auto">
          <button onClick={fetchTickets} className="btn btn-ghost" title="Reload Data"><RefreshCw size={20} className={loading ? 'spin' : ''} /></button>
          <button onClick={() => setIsFormOpen(true)} className="btn btn-primary"><Plus size={20} /> Report Incident</button>
        </div>
      </div>

      {loading && tickets.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20">
           <RefreshCw className="spin text-primary" size={40} />
         </div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTickets.map((ticket, i) => (
              <motion.div
                 layout
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 key={ticket.id}
                 className="glass-card hover-lift cursor-pointer relative group"
                 style={{ borderLeft: `4px solid ${PRIORITY_COLORS[ticket.priority]?.text || '#fff'}` }}
                 onClick={() => { 
                   setSelectedTicket(ticket); 
                   setUpdateStatus(ticket.status);
                   setTechnicianName(getAssignedTech(ticket) || '');
                 }}
              >
                  <button 
                     onClick={(e) => handleDelete(ticket.id, e)} 
                     className="absolute -top-3 -right-3 bg-red-500/10 text-red-500 border border-red-500/30 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                     title="Delete Ticket"
                  >
                     <X size={14} />
                  </button>
                  <div className="flex justify-between items-start mb-3 mt-2 text-white">
                    <h3 className="font-bold text-lg truncate mr-3 flex-1">{ticket.title}</h3>
                    <div className="flex flex-col items-end gap-1">
                      <div style={{ ...STATUS_COLORS[ticket.status], padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 800 }}>
                        {ticket.status === 'RESOLVED' ? 'RESOLVED' : (getAssignedTech(ticket) ? `ASSIGNED: ${getAssignedTech(ticket).toUpperCase()}` : ticket.status.replace('_', ' '))}
                      </div>
                      {ticket.createdByRole === 'ROLE_ADMIN' ? (
                         <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[0.55rem] font-bold">ADMIN</span>
                      ) : ticket.createdByRole ? (
                         <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[0.55rem] font-bold">CLIENT</span>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-muted text-sm line-clamp-2 mb-4">{ticket.description}</p>
                  
                  <div className="flex justify-between items-center text-xs mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1 text-muted"><Clock size={14} /> {new Date(ticket.createdAt).toLocaleDateString()}</div>
                    <div className="flex gap-2">
                       {ticket.technicianUpdates?.length > 0 && <span className="flex items-center gap-1 text-[#6366f1]"><MessageSquare size={14} /> {ticket.technicianUpdates.length}</span>}
                       {ticket.attachments?.length > 0 && <span className="flex items-center gap-1 text-[#60a5fa]"><Paperclip size={14} /> {ticket.attachments.length}</span>}
                    </div>
                  </div>
                  
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
         <div className="glass-card flex flex-col items-center justify-center py-20 border-dashed">
            <CheckCircle2 size={48} className="text-dim mb-4" />
            <h3 className="text-white font-bold">No issues found</h3>
            <p className="text-muted text-sm">Everything is running smoothly.</p>
         </div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card w-full max-w-lg p-6 relative overflow-hidden">
               <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-muted hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"><X size={18} /></button>
               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Plus className="text-primary"/> Report Incident</h2>
               <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-muted uppercase">Title</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="form-input" placeholder="E.g., A/C not working in Lab 01" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted uppercase">Description</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="form-input" placeholder="Provide detailed information..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-muted uppercase">Priority</label>
                      <select required value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="form-input">
                        <option value="LOW">Low - Minimal Impact</option>
                        <option value="MEDIUM">Medium - Noticeable Impairment</option>
                        <option value="HIGH">High - Significant Impact</option>
                        <option value="CRITICAL">Critical - Facility Down</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted uppercase">Attachments (comma separated links)</label>
                    <input type="text" value={formData.attachments} onChange={e => setFormData({...formData, attachments: e.target.value})} className="form-input" placeholder="https://image-link.com/img1, ..." />
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="btn btn-ghost flex-1">Cancel</button>
                    <button type="submit" className="btn btn-primary flex-1">Submit</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-white">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-start">
                   <div>
                     <div className="flex items-center gap-3 mb-2">
                       <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{selectedTicket.title}</h2>
                     </div>
                     <p className="text-muted text-sm mb-4">
                       Reported on {new Date(selectedTicket.createdAt).toLocaleString()} by {selectedTicket.createdByUsername}
                       {selectedTicket.createdByRole === 'ROLE_ADMIN' ? (
                          <span className="px-2 py-0.5 ml-2 bg-red-500/20 text-red-400 rounded text-[0.65rem] font-bold">ADMIN</span>
                       ) : selectedTicket.createdByRole ? (
                          <span className="px-2 py-0.5 ml-2 bg-emerald-500/20 text-emerald-400 rounded text-[0.65rem] font-bold">CLIENT</span>
                       ) : null}
                     </p>
                     <div className="flex gap-2">
                        <span style={{ ...STATUS_COLORS[selectedTicket.status], padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800 }}>
                           {selectedTicket.status === 'RESOLVED' ? 'RESOLVED' : (getAssignedTech(selectedTicket) ? `ASSIGNED TO: ${getAssignedTech(selectedTicket).toUpperCase()}` : selectedTicket.status.replace('_', ' '))}
                        </span>
                        <span style={{ ...PRIORITY_COLORS[selectedTicket.priority], padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800 }}>{selectedTicket.priority} PRIORITY</span>
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <button className="btn btn-secondary text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/40" onClick={(e) => handleDelete(selectedTicket.id, e)}>Delete Incident</button>
                     <button onClick={() => setSelectedTicket(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition"><X size={20} /></button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                   <div className="col-span-2 space-y-6">
                      <section className="bg-white/5 p-4 rounded-xl border border-white/10">
                       <h4 className="text-xs font-bold text-muted uppercase mb-4 flex items-center gap-2"><AlertCircle size={14} /> Issue Description & Layout</h4>
                       {(selectedTicket.category || selectedTicket.contact) && (
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-dim bg-black/20 p-3 rounded-lg border border-white/5">
                              <div><span className="text-muted block text-[0.65rem] uppercase mb-1">Category</span>{selectedTicket.category || 'N/A'}</div>
                              <div><span className="text-muted block text-[0.65rem] uppercase mb-1">Contact Details</span>{selectedTicket.contact || 'N/A'}</div>
                          </div>
                       )}
                       <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
                     </section>

                      {selectedTicket.attachments?.length > 0 && (
                        <section className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <h4 className="text-xs font-bold text-muted uppercase mb-3 flex items-center gap-2"><Paperclip size={14} /> Attachments</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedTicket.attachments.map((lnk, i) => (
                               <a key={i} href={lnk} target="_blank" rel="noreferrer" className="flex justify-center items-center p-2 bg-white/5 hover:bg-primary/20 hover:text-primary transition rounded-lg border border-white/10 text-xs truncate max-w-[200px]">
                                 Attachment {i + 1}
                               </a>
                            ))}
                          </div>
                        </section>
                      )}

                      <section className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="text-xs font-bold text-muted uppercase mb-4 flex items-center gap-2"><MessageSquare size={14} /> Technician Timeline</h4>
                        <div className="space-y-4 border-l border-white/10 pl-4 ml-2">
                           {selectedTicket.technicianUpdates?.length === 0 && <p className="text-sm text-dim">No updates provided yet.</p>}
                           {selectedTicket.technicianUpdates?.map((up, i) => (
                              <div key={i} className="relative">
                                 <div className="absolute -left-[23px] top-1 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#6366f1]" />
                                 <p className="text-sm bg-white/5 p-3 rounded-xl border border-white/10">{up.updateMessage}</p>
                                 <p className="text-xs text-muted mt-2">By <span className="text-primary font-bold">{up.technicianName}</span> at {new Date(up.updateDate).toLocaleString()}</p>
                              </div>
                           ))}
                        </div>
                      </section>
                   </div>

                   <div className="col-span-1 border-l border-white/10 pl-6 space-y-6">
                      <div>
                         <h4 className="font-bold mb-4 flex items-center gap-2"><Wrench size={18} className="text-primary" /> Take Action</h4>
                         <form onSubmit={handleUpdateTicket} className="space-y-4">
                           <div>
                              <label className="text-xs font-bold text-muted uppercase">Assign Technician</label>
                              <select value={technicianName} onChange={(e) => setTechnicianName(e.target.value)} className="form-input mt-2">
                                <option value="">Select Technician...</option>
                                <option value="Mike R.">Mike R.</option>
                                <option value="Sarah V.">Sarah V.</option>
                                <option value="John D.">John D.</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-xs font-bold text-muted uppercase">Change Status</label>
                              <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)} className="form-input mt-2">
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-xs font-bold text-muted uppercase">Technician Note</label>
                              <textarea rows={3} value={updateMsg} onChange={(e) => setUpdateMsg(e.target.value)} className="form-input mt-2" placeholder="Add diagnosis, resolution, or updates..." />
                           </div>
                           <button type="submit" className="btn btn-primary w-full justify-center">Add Update</button>
                         </form>
                      </div>
                   </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </>
  );
};

export default MaintenancePage;
