import React from 'react';
import { Edit2, Trash2, MapPin, Users, Clock, CheckCircle2 } from 'lucide-react';

const ResourceCard = ({ resource, onEdit, onDelete, onStatusToggle }) => {
  const isAvailable = resource.status === 'ACTIVE';

  return (
    <div className="glass-card resource-item animate-in">
      <div className="flex justify-between items-center mb-4">
        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
          <CheckCircle2 size={24} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(resource)} className="btn-ghost" style={{ padding: '0.5rem' }}>
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(resource.id)} className="btn-ghost" style={{ padding: '0.5rem', color: '#f43f5e' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="text-white font-bold mb-1" style={{ fontSize: '1.25rem' }}>{resource.name}</h3>
      <p className="brand-sub mb-4">{resource.type}</p>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-2 text-muted text-sm">
          <MapPin size={16} />
          <span>{resource.location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted text-sm">
          <Users size={16} />
          <span>Capacity: {resource.capacity}</span>
        </div>
        <div className="flex items-center gap-2 text-muted text-sm">
          <Clock size={16} />
          <span>{resource.availableFrom || '08:00'} - {resource.availableTo || '20:00'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <div className={`badge ${isAvailable ? 'badge-active' : 'badge-oos'}`}>
            {isAvailable ? 'Active' : 'Offline'}
          </div>
        </div>
        <button
          onClick={() => onStatusToggle(resource.id, isAvailable ? 'OUT_OF_SERVICE' : 'ACTIVE')}
          className="btn"
          style={{
            fontSize: '0.75rem',
            padding: '0.4rem 0.8rem',
            background: isAvailable ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)',
            color: isAvailable ? '#f43f5e' : '#10b981',
            borderColor: isAvailable ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)'
          }}
        >
          {isAvailable ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
