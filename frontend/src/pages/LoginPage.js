import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, LogIn, ArrowRight, Activity, User } from 'lucide-react';
import axios from 'axios';
import './Auth.css';

const LoginPage = ({ onNavigate, onLogin }) => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!identifier) {
      setError('Email or Username is required.');
      return;
    }

    if (isForgotPassword) {
      // Simulate forgot password API call
      setIsLoading(true);
      setTimeout(() => {
        setMessage('If an account exists, a reset link has been sent to your email.');
        setIsLoading(false);
      }, 1000);
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8082/api/auth/login', { email: identifier, password });
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data || 'Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-split-visual">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <Activity size={28} />
          </div>
          <div className="auth-brand-text">Smart Campus</div>
        </div>
        <h1 className="auth-quote-title">Welcome back to your campus life.</h1>
        <p className="auth-quote-desc">Sign in to access your personalized dashboard, manage event bookings, and stay connected with the smart campus ecosystem.</p>
      </div>

      <div className="auth-form-wrapper">
        <button className="auth-back-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="auth-card">
          <div className="auth-header text-center">
            <div className="flex justify-center mb-4">
              <div style={{ width: '64px', height: '64px', background: 'rgba(83,74,183,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#534AB7' }}>
                {isForgotPassword ? <Mail size={32} /> : <LogIn size={32} />}
              </div>
            </div>
            <h2>{isForgotPassword ? 'Reset Password' : 'Sign In'}</h2>
            <p>
              {isForgotPassword 
                ? 'Enter your email to receive a password reset link.' 
                : 'Welcome back! Please enter your details.'}
            </p>
          </div>

          {error && <div className="auth-alert auth-alert-error">{error}</div>}
          {message && <div className="auth-alert auth-alert-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-input-label">{isForgotPassword ? 'Email Address' : 'Email or Username'}</label>
              <div className="auth-input-wrapper">
                {isForgotPassword ? <Mail className="auth-input-icon" size={18} /> : <User className="auth-input-icon" size={18} />}
                <input 
                  type={isForgotPassword ? "email" : "text"} 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="auth-input has-icon"
                  placeholder={isForgotPassword ? "name@campus.edu" : "Email or Username"}
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div className="auth-input-group">
                <div className="auth-input-label">
                  <span>Password</span>
                  <button 
                    type="button" 
                    onClick={() => { setIsForgotPassword(true); setError(''); setMessage(''); setIdentifier(''); }} 
                    className="auth-link" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="auth-input-wrapper">
                  <Lock className="auth-input-icon" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input has-icon"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="auth-btn-primary mt-6"
            >
              {isLoading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : 'Sign In')}
              {!isLoading && !isForgotPassword && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            {isForgotPassword ? (
              <button 
                type="button" 
                onClick={() => { setIsForgotPassword(false); setError(''); setMessage(''); setIdentifier(''); }} 
                className="auth-link font-semibold"
              >
                <ArrowLeft size={16} className="inline mr-1" style={{ verticalAlign: 'text-bottom' }} /> Back to Login
              </button>
            ) : (
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Don't have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => onNavigate('signup')} 
                  className="auth-link"
                >
                  Sign up here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
