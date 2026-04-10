import React, { useState, useEffect } from 'react';
import { X, Save, Box, Layers, Users, MapPin, Clock, AlertCircle } from 'lucide-react';
import './ResourceForm.css';

const ResourceForm = ({ resource, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: 1,
    location: '',
    availableFrom: '08:00',
    availableTo: '20:00',
    status: 'ACTIVE'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (resource) {
      setFormData(resource);
    } else {
      setFormData({
        name: '',
        type: '',
        capacity: 1,
        location: '',
        availableFrom: '08:00',
        availableTo: '20:00',
        status: 'ACTIVE'
      });
    }
  }, [resource, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Resource name is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.location) newErrors.location = 'Location is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Ensure time format matches LocalTime (HH:mm:ss)
    const processedData = {
      ...formData,
      availableFrom: formData.availableFrom.length === 5 ? `${formData.availableFrom}:00` : formData.availableFrom,
      availableTo: formData.availableTo.length === 5 ? `${formData.availableTo}:00` : formData.availableTo
    };

    onSubmit(processedData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2>{resource ? 'Update Facility' : 'New Resource'}</h2>
            <p>{resource ? 'Modify existing campus asset details.' : 'Add a new asset to the campus catalogue.'}</p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            
            {/* Resource Name */}
            <div className="premium-input-group col-span-2">
              <label className="premium-label">
                Resource Name
              </label>
              <div className="premium-input-wrap">
                <Box size={18} className="input-icon" />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className={`premium-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Auditorium A, Lab 304..."
                />
              </div>
              {errors.name && <span className="error-text"><AlertCircle size={14}/> {errors.name}</span>}
            </div>

            {/* Type */}
            <div className="premium-input-group">
              <label className="premium-label">Type</label>
              <div className="premium-input-wrap">
                <Layers size={18} className="input-icon" />
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  className={`premium-input ${errors.type ? 'input-error' : ''}`}
                >
                  <option value="" disabled>Select type</option>
                  <option value="CLASSROOM">Classroom</option>
                  <option value="LAB">Laboratory</option>
                  <option value="AUDITORIUM">Auditorium</option>
                  <option value="OFFICE">Office</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
                </select>
              </div>
              {errors.type && <span className="error-text"><AlertCircle size={14}/> {errors.type}</span>}
            </div>

            {/* Capacity */}
            <div className="premium-input-group">
              <label className="premium-label">Capacity (Persons)</label>
              <div className="premium-input-wrap">
                <Users size={18} className="input-icon" />
                <input 
                  type="number" 
                  min="1"
                  name="capacity" 
                  value={formData.capacity} 
                  onChange={handleChange} 
                  className="premium-input" 
                />
              </div>
            </div>

            {/* Location */}
            <div className="premium-input-group col-span-2">
              <label className="premium-label">Location</label>
              <div className="premium-input-wrap">
                <MapPin size={18} className="input-icon" />
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  className={`premium-input ${errors.location ? 'input-error' : ''}`}
                  placeholder="e.g. Main Building, Floor 2"
                />
              </div>
              {errors.location && <span className="error-text"><AlertCircle size={14}/> {errors.location}</span>}
            </div>

            {/* Available From */}
            <div className="premium-input-group">
              <label className="premium-label">Available From</label>
              <div className="premium-input-wrap">
                <Clock size={18} className="input-icon" />
                <input 
                  type="time" 
                  name="availableFrom" 
                  value={formData.availableFrom} 
                  onChange={handleChange} 
                  className="premium-input" 
                />
              </div>
            </div>

            {/* Available To */}
            <div className="premium-input-group">
              <label className="premium-label">Available To</label>
              <div className="premium-input-wrap">
                <Clock size={18} className="input-icon" />
                <input 
                  type="time" 
                  name="availableTo" 
                  value={formData.availableTo} 
                  onChange={handleChange} 
                  className="premium-input" 
                />
              </div>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save">
              <Save size={20} />
              {resource ? 'Save Changes' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;
