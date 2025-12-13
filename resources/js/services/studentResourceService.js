import api from './api';

const studentResourceService = {
    // Get current week's schedule with resources
    getCurrentWeekSchedule: () => api.get('/resources/weekly-schedule/current'),

    // Get all assigned resources
    getMyResources: (completed = null) => {
        const params = new URLSearchParams();
        if (completed !== null) params.append('completed', completed);

        return api.get(`/resources/my-resources?${params.toString()}`);
    },

    // Mark resource as completed
    markAsCompleted: (resourceId) => api.post(`/resources/${resourceId}/complete`),

    // Mark resource as incomplete
    markAsIncomplete: (resourceId) => api.post(`/resources/${resourceId}/incomplete`),

    // Add notes to a resource
    addNotes: (resourceId, notes) => {
        return api.post(`/resources/${resourceId}/notes`, { notes });
    },
};

export default studentResourceService;
