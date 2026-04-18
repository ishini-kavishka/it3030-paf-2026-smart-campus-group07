import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Upload, Mail, CheckCircle, Shield, Check, X as XIcon, Activity } from 'lucide-react';
import axios from 'axios';
import './Auth.css';

const SignUpPage = ({ onNavigate, onLogin }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', email: '', phone: '',
    address: '', username: '', password: '', confirmPassword: '', imageUrl: ''
  });
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'phone') {
      const value = e.target.value.replace(/\D/g, '');
      if (value.length <= 10) {
        setFormData({ ...formData, [e.target.name]: value });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Validators
  const passwordStrength = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password)
  };
  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  const requestOtp = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.dob || !formData.phone) {
      setError('Please fill in all basic information fields.');
      return;
    }
    if (formData.phone.length !== 10) {
      setError('Telephone number must have exactly 10 digits.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:8082/api/auth/send-otp', { email: formData.email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Enter the 6-digit OTP.');
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:8082/api/auth/verify-otp', { email: formData.email, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const submitAddress = (e) => {
    e.preventDefault();
    if (!formData.address) return setError('Address is required.');
    setError('');
    setStep(4);
  };

  const finalizeRegistration = async (e) => {
    e.preventDefault();
    if (!formData.username) return setError('Username is required.');
    if (!isPasswordStrong) return setError('Please make sure your password meets all requirements.');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');
    
    setError('');
    setLoading(true);
    try {
      const payload = { ...formData };
      delete payload.confirmPassword;
      const response = await axios.post('http://localhost:8082/api/auth/register', payload);
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicators = () => (
    <div className="auth-step-indicator">
      <div className="auth-step-line" />
      <div 
        className="auth-step-progress" 
        style={{ width: `${((step - 1) / 3) * 100}%` }} 
      />
      {[1, 2, 3, 4].map(num => (
        <div 
          key={num} 
          className={`auth-step ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
        >
          {step > num ? <Check size={16} strokeWidth={3} /> : num}
        </div>
      ))}
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-split-visual">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <Activity size={28} />
          </div>
          <div className="auth-brand-text">Smart Campus</div>
        </div>
        <h1 className="auth-quote-title">Join our vibrant community.</h1>
        <p className="auth-quote-desc">Sign up to explore exclusive events, discover campus resources, and connect closely with what matters.</p>
      </div>

      <div className="auth-form-wrapper">
        <button className="auth-back-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={18} /> Cancel
        </button>

        <div className="auth-card">
          <div className="auth-header text-center">
            <h2>Create Account</h2>
            <p>Fill out the steps below to join the campus</p>
          </div>
          
          {renderStepIndicators()}

          {error && <div className="auth-alert auth-alert-error">{error}</div>}

          {step === 1 && (
            <form onSubmit={requestOtp}>
              <div className="auth-avatar-upload">
                <label className="auth-avatar-label">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Profile" className="auth-avatar-img" />
                  ) : (
                    <>
                      <Upload size={24} className="text-primary mb-1" style={{ color: '#534AB7' }} />
                      <span className="auth-avatar-text">PHOTO</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" style={{ display: 'none' }} onChange={handleImageUpload} />
                </label>
              </div>

              <div className="auth-input-row">
                <div className="auth-input-col">
                  <label className="auth-input-label">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="auth-input" required />
                </div>
                <div className="auth-input-col">
                  <label className="auth-input-label">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="auth-input" required />
                </div>
              </div>

              <div className="auth-input-row">
                <div className="auth-input-col">
                  <label className="auth-input-label">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="auth-input" max={new Date().toISOString().split("T")[0]} required />
                </div>
                <div className="auth-input-col">
                  <label className="auth-input-label">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="auth-input" placeholder="0123456789" required />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail className="auth-input-icon" size={18} />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="auth-input has-icon" required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-btn-primary mt-6">
                {loading ? 'Sending OTP...' : 'Continue'} <ArrowRight size={18} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={verifyOtp} className="text-center">
              <div className="flex justify-center mb-4">
                <div style={{ width: '64px', height: '64px', background: 'rgba(83,74,183,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#534AB7' }}>
                  <Mail size={32} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Email Verification</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' }}>
                We've sent a 6-digit code to <strong>{formData.email}</strong>.
              </p>
              
              <div className="auth-input-group" style={{ display: 'flex', justifyContent: 'center' }}>
                <input 
                  type="text" 
                  maxLength="6" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                  className="auth-input auth-font-mono" 
                  placeholder="000000"
                  required 
                />
              </div>
              
              <button type="submit" disabled={loading} className="auth-btn-primary mt-6">
                {loading ? 'Verifying...' : 'Verify Email'} <CheckCircle size={18} />
              </button>
              <button type="button" onClick={() => setStep(1)} className="auth-link mt-4">Change Email Address</button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={submitAddress}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', marginBottom: '1.5rem' }}>Residential Details</h3>
              <div className="auth-input-group">
                <label className="auth-input-label">Full Address</label>
                <textarea 
                  name="address" 
                  rows="4" 
                  value={formData.address} 
                  onChange={handleChange} 
                  className="auth-input" 
                  placeholder="123 Campus Drive, Apt 4B..."
                  required 
                />
              </div>
              <button type="submit" className="auth-btn-primary mt-6">
                Continue to Security <ArrowRight size={18} />
              </button>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={finalizeRegistration}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', marginBottom: '1.5rem' }}>Account Security</h3>
              
              <div className="auth-input-group">
                <label className="auth-input-label">Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="auth-input" required />
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="auth-input" required />
                
                <div className="req-grid mt-4">
                  <div className={`req-item ${passwordStrength.length ? 'req-met' : 'req-unmet'}`}>
                    {passwordStrength.length ? <Check size={14}/> : <XIcon size={14}/>} 8+ Characters
                  </div>
                  <div className={`req-item ${passwordStrength.upper ? 'req-met' : 'req-unmet'}`}>
                    {passwordStrength.upper ? <Check size={14}/> : <XIcon size={14}/>} Uppercase
                  </div>
                  <div className={`req-item ${passwordStrength.lower ? 'req-met' : 'req-unmet'}`}>
                    {passwordStrength.lower ? <Check size={14}/> : <XIcon size={14}/>} Lowercase
                  </div>
                  <div className={`req-item ${passwordStrength.number ? 'req-met' : 'req-unmet'}`}>
                    {passwordStrength.number ? <Check size={14}/> : <XIcon size={14}/>} Number
                  </div>
                  <div className={`req-item ${passwordStrength.special ? 'req-met' : 'req-unmet'}`}>
                    {passwordStrength.special ? <Check size={14}/> : <XIcon size={14}/>} Symbol
                  </div>
                </div>
              </div>

              <div className="auth-input-group mt-4">
                <label className="auth-input-label">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  className={`auth-input ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''}`} 
                  required 
                />
              </div>

              <button type="submit" disabled={loading} className={`auth-btn-primary mt-6 ${(!isPasswordStrong || formData.password !== formData.confirmPassword) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {loading ? 'Creating Account...' : 'Finish Registration'} <CheckCircle size={18} />
              </button>
            </form>
          )}

          {step === 1 && (
            <div className="mt-6 pt-6 border-t text-center">
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Already have an account?{' '}
                <button type="button" onClick={() => onNavigate('login')} className="auth-link">
                  Log in here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
