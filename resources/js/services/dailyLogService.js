import api from './api';

export const dailyLogService = {
    // Get all logs with optional filters
    async fetchLogs(params = {}) {
        const response = await api.get('/daily-logs', { params });
        return response.data;
    },

    // Get a single log
    async getLog(id) {
        const response = await api.get(`/daily-logs/${id}`);
        return response.data;
    },

    // Create a new log
    async createLog(data) {
        const response = await api.post('/daily-logs', data);
        return response.data;
    },

    // Update an existing log
    async updateLog(id, data) {
        const response = await api.put(`/daily-logs/${id}`, data);
        return response.data;
    },

    // Delete a log
    async deleteLog(id) {
        const response = await api.delete(`/daily-logs/${id}`);
        return response.data;
    },

    // Get statistics
    async getStats() {
        const response = await api.get('/daily-logs/stats');
        return response.data;
    },
};
