import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const data = await authApi.login(username, password);
        setUser(data);
        return data;
    };

    const googleLogin = async (token) => {
        const data = await authApi.googleLogin(token);
        setUser(data);
        return data;
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        if (!user || !user.token) return;
        const data = await authApi.updateProfile(profileData, user.token);
        setUser(data);
        return data;
    };

    const changePassword = async (currentPassword, newPassword) => {
        if (!user || !user.token) return;
        return await authApi.changePassword(currentPassword, newPassword, user.token);
    };

    const deleteProfile = async () => {
        if (!user || !user.token) return;
        await authApi.deleteProfile(user.token);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token: user?.token,
            login,
            googleLogin,
            logout,
            updateProfile,
            changePassword,
            deleteProfile,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
