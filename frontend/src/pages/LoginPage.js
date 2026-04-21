import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Database, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            const userData = await googleLogin(credentialResponse.credential);
            if (userData?.role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Google Sign-In failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Sign-In was unsuccessful.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const userData = await login(username, password);
            if (userData?.role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 from-[#534AB7]/10 to-transparent bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex flex-col items-center justify-center text-center">
                    <div 
                        className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate('/')}
                        title="Return to Home"
                    >
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-100 p-1">
                            <img src="/logo.png" alt="Smart Campus Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-2xl font-bold text-[#534AB7] font-['Outfit'] tracking-tight">SmartCampus</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 font-['Outfit']">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access your SmartCampus portal
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center font-medium border border-red-200">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] focus:z-10 sm:text-sm bg-gray-50 focus:bg-white transition-colors"
                                    placeholder="Enter your username or email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="appearance-none rounded-xl relative block w-full pl-10 pr-10 px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#534AB7] focus:border-[#534AB7] focus:z-10 sm:text-sm bg-gray-50 focus:bg-white transition-colors"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-[#534AB7] focus:ring-[#534AB7] border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-[#534AB7] hover:text-[#3C3489] transition-colors">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#534AB7] hover:bg-[#3C3489] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#534AB7] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                            theme="outline"
                            size="large"
                            text="signin_with"
                            shape="rectangular"
                        />
                    </div>
                </div>
                
                <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">Don't have an account? </span>
                    <button className="text-sm font-medium text-[#534AB7] hover:text-[#3C3489]">Sign up</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
