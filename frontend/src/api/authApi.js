import axios from 'axios';

const API_URL = 'http://localhost:8082/api/auth';

const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const googleLogin = async (token) => {
    const response = await axios.post(`${API_URL}/google`, { token });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const sendOtp = async (email) => {
    const response = await axios.post(`${API_URL}/signup/send-otp`, { email });
    return response.data;
};

const verifyOtp = async (email, otp) => {
    const response = await axios.post(`${API_URL}/signup/verify-otp`, { email, otp });
    return response.data;
};

const signup = async (userData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const updateProfile = async (profileData, token) => {
    const response = await axios.put(`${API_URL}/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const changePassword = async (currentPassword, newPassword, token) => {
    const response = await axios.put(`${API_URL}/password`, { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const deleteProfile = async (token) => {
    const response = await axios.delete(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    localStorage.removeItem('user');
    return response.data;
};

const authApi = {
    login,
    googleLogin,
    sendOtp,
    verifyOtp,
    signup,
    logout,
    updateProfile,
    changePassword,
    deleteProfile
};

export default authApi;
