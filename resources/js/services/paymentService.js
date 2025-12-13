import axios from 'axios';
import { getAuthHeader } from '../hooks/useAuth';

const API_URL = '/api';

export const paymentService = {
    getPackages: async () => {
        const response = await axios.get(`${API_URL}/packages`, { headers: getAuthHeader() });
        return response.data;
    },

    purchase: async (package_id) => {
        const response = await axios.post(`${API_URL}/payment/purchase`, { package_id }, { headers: getAuthHeader() });
        return response.data;
    },

    verify: async (data) => {
        const response = await axios.post(`${API_URL}/payment/verify`, data, { headers: getAuthHeader() });
        return response.data;
    }
};
