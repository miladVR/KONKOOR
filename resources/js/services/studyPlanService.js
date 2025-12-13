import api from './api';

export const studyPlanService = {
    // Get all plans
    async fetchPlans(params = {}) {
        const response = await api.get('/study-plans', { params });
        return response.data;
    },

    // Get a single plan
    async getPlan(id) {
        const response = await api.get(`/study-plans/${id}`);
        return response.data;
    },

    // Get current week's plan
    async getCurrentPlan() {
        const response = await api.get('/study-plans/current');
        return response.data;
    },

    // Create a new plan
    async createPlan(data) {
        const response = await api.post('/study-plans', data);
        return response.data;
    },

    // Update an existing plan
    async updatePlan(id, data) {
        const response = await api.put(`/study-plans/${id}`, data);
        return response.data;
    },

    // Delete a plan
    async deletePlan(id) {
        const response = await api.delete(`/study-plans/${id}`);
        return response.data;
    },
};
