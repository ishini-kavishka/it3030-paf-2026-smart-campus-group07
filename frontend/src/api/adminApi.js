import axios from 'axios';

const API_URL = 'http://localhost:8082/api/admin';

const getAllUsers = async (token) => {
    const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const suspendUser = async (id, token) => {
    const response = await axios.put(`${API_URL}/users/${id}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const activateUser = async (id, token) => {
    const response = await axios.put(`${API_URL}/users/${id}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const adminApi = {
    getAllUsers,
    suspendUser,
    activateUser
};

export default adminApi;
