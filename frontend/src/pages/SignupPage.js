import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Lock, Upload, Check, Eye, EyeOff } from 'lucide-react';

const SignupPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    // Wizard Form State
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Step 1: Personal Info
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState('');
    
    // Step 2: Email verification
    const [otp, setOtp] = useState('');
    
    // Step 3: Address
    const [address, setAddress] = useState('');
    
    // Step 4: Security
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const validateStep1 = () => {
        if (!firstName || !lastName || !dob || !email || !phone) {
            setError("Please fill all required fields.");
            return false;
        }
        
        // DOB past check
        const selectedDate = new Date(dob);
        const today = new Date();
        if (selectedDate > today) {
            setError("Date of birth cannot be in the future.");
            return false;
        }
        
        // Phone 10 digits check
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            setError("Phone number must be exactly 10 digits.");
            return false;
        }
        
        return true;
    };
    
    const submitStep1 = async (e) => {
        e.preventDefault();
        setError('');
        if (validateStep1()) {
            setLoading(true);
            try {
                // Check email & send OTP
                await authApi.sendOtp(email);
                setStep(2);
            } catch (err) {
                let errorMsg = "Failed to send OTP. Please try again.";
                
                if (err.response?.data?.message) {
                    errorMsg = err.response.data.message;
                } else if (err.response?.data) {
                    errorMsg = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
                } else if (err.message) {
                    errorMsg = err.message;
                } else if (err.code === 'ERR_NETWORK') {
                    errorMsg = "Network error: Backend server is not responding. Please ensure the server is running on port 8082.";
                } else if (!err.response) {
                    errorMsg = "Network error: Cannot connect to the server. Please check your connection and ensure the backend is running.";
                }
                
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        }
    };
    
    const submitStep2 = async (e) => {
        e.preventDefault();
        setError('');
        if (!otp) {
            setError("Please enter the OTP sent to your email.");
            return;
        }
        setLoading(true);
        try {
            await authApi.verifyOtp(email, otp);
            setStep(3);
        } catch (err) {
            let errorMsg = "Invalid or expired OTP. Please try again.";
            
            if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            } else if (err.response?.data) {
                errorMsg = typeof err.response.data === 'string' ? err.response.data : "Invalid or expired OTP.";
            } else if (!err.response) {
                errorMsg = "Network error: Cannot connect to the server.";
            }
            
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };
    
    const submitStep3 = (e) => {
        e.preventDefault();
        setError('');
        if (!address) {
            setError("Please enter your address details.");
            return;
        }
        setStep(4);
    };
    
    const validatePassword = (pass) => {
        // lower, upper, symbol, number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
        return passwordRegex.test(pass);
    };
    
    const submitStep4 = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password || !confirmPassword) {
            setError("Please fill all fields.");
            return;
        }
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        
        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long and contain uppercase, lowercase, number, and symbol.");
            return;
        }
        
        setLoading(true);
        try {
            const formData = {
                username, password, firstName, lastName, dob, email, phoneNumber: phone, address, profileImage
            };
            
            await authApi.signup(formData); // calls /api/auth/signup
            // auto login
            await login(username, password);
            navigate('/dashboard', { state: { isNewSignup: true } });
        } catch (err) {
            let errorMsg = "Failed to complete registration.";
            
            if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            } else if (typeof err.response?.data === 'string') {
                errorMsg = err.response.data;
            } else if (err.response?.data?.error) {
                errorMsg = err.response.data.error;
            } else if (err.message) {
                errorMsg = err.message;
            } else if (!err.response) {
                errorMsg = "Network error: Cannot connect to the server.";
            }
            
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };
    
    const renderStepIndicators = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((num) => (
                <React.Fragment key={num}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                        step === num ? 'bg-[#534AB7] text-white ring-4 ring-[#EEEDFE]' :
                        step > num ? 'bg-[#3B6D11] text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                        {step > num ? <Check size={16} /> : num}
                    </div>
                    {num < 4 && (
                        <div className={`w-12 h-1 ${step > num ? 'bg-[#3B6D11]' : 'bg-gray-200'} mx-2 transition-colors`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 from-[#534AB7]/10 to-transparent bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex flex-col items-center justify-center text-center">
                    <div 
                        className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate('/')}
                        title="Return to Home"
                    >
                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-100 p-1">
                            <img src="/logo.png" alt="Smart Campus Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-2xl font-bold text-[#534AB7] font-['Outfit'] tracking-tight">SmartCampus</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 font-['Outfit']">
                        Join SmartCampus
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create your account to access the portal
                    </p>
                </div>

                {renderStepIndicators()}

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm text-center font-medium border border-red-200">
                        <p className="break-words">{error}</p>
                    </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                    <form onSubmit={submitStep1} className="space-y-5 animate-in">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-[#534AB7] text-white p-1.5 rounded-full cursor-pointer hover:bg-[#3C3489] transition-colors shadow-md">
                                    <Upload size={14} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" required value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split("T")[0]}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (10 digits)</label>
                            <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="0701234567"
                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        
                        <button type="submit" disabled={loading} className="w-full bg-[#534AB7] text-white py-3 rounded-xl font-medium hover:bg-[#3C3489] transition-colors flex justify-center items-center gap-2">
                            {loading ? 'Sending OTP...' : 'Continue'}
                        </button>
                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <form onSubmit={submitStep2} className="space-y-6 animate-in">
                        <div className="text-center">
                            <Mail className="mx-auto h-12 w-12 text-[#534AB7] mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Verify your email</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                We've sent a 6-digit code to <strong>{email}</strong>
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Verification Code</label>
                            <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" maxLength={6}
                                className="w-full rounded-xl text-center tracking-widest text-2xl border border-gray-300 px-4 py-3 focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                                Back
                            </button>
                            <button type="submit" disabled={loading} className="flex-[2] bg-[#534AB7] text-white py-3 rounded-xl font-medium hover:bg-[#3C3489] transition-colors">
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </div>
                    </form>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <form onSubmit={submitStep3} className="space-y-5 animate-in">
                        <div className="text-center">
                            <MapPin className="mx-auto h-12 w-12 text-[#534AB7] mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Location Details</h3>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                            <textarea required value={address} onChange={e => setAddress(e.target.value)} rows="3" placeholder="Enter your full residential address"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors"></textarea>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button type="submit" disabled={loading} className="w-full bg-[#534AB7] text-white py-3 rounded-xl font-medium hover:bg-[#3C3489] transition-colors flex justify-center items-center gap-2">
                                Continue
                            </button>
                        </div>
                    </form>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                    <form onSubmit={submitStep4} className="space-y-5 animate-in">
                        <div className="text-center">
                            <Lock className="mx-auto h-12 w-12 text-[#534AB7] mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Secure your Account</h3>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Must contain Upper, Lower, Number & Symbol</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-[#534AB7] focus:border-[#534AB7] bg-gray-50 focus:bg-white transition-colors" />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button type="submit" disabled={loading} className="w-full bg-[#534AB7] text-white py-3 rounded-xl font-medium hover:bg-[#3C3489] transition-colors flex justify-center items-center gap-2">
                                {loading ? 'Creating Account...' : 'Complete Registration'}
                            </button>
                        </div>
                    </form>
                )}
                
                <div className="text-center mt-6">
                    <span className="text-sm text-gray-600">Already have an account? </span>
                    <button onClick={() => navigate('/login')} className="text-sm font-medium text-[#534AB7] hover:text-[#3C3489]">Sign in</button>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
