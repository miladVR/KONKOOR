import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await api.get('/auth/user');
                setUser(response.data);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (credentials) => {
        console.log('[useAuth] Login attempt with:', credentials);
        const response = await api.post('/auth/login', credentials);
        console.log('[useAuth] Login response:', response.data);
        console.log('[useAuth] Token from response:', response.data.token);
        localStorage.setItem('token', response.data.token);
        console.log('[useAuth] Token saved to localStorage');
        setUser(response.data.user);
        return response.data;
    };

    const register = async (data) => {
        const response = await api.post('/auth/register', data);
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Helper to get auth header for usage outside react context (services)
export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useAuth = () => useContext(AuthContext);
