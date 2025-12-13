import api from './api';

const resourceService = {
    // Resource Management (Admin)
    getResources: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.subject) params.append('subject', filters.subject);
        if (filters.week_number) params.append('week_number', filters.week_number);
        if (filters.year) params.append('year', filters.year);
        if (filters.resource_type) params.append('resource_type', filters.resource_type);
        if (filters.is_approved !== undefined) params.append('is_approved', filters.is_approved);
        if (filters.created_by) params.append('created_by', filters.created_by);

        return api.get(`/admin/study-resources?${params.toString()}`);
    },

    createResource: (formData) => {
        return api.post('/admin/study-resources', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    getResource: (id) => api.get(`/admin/study-resources/${id}`),

    updateResource: (id, formData) => {
        return api.put(`/admin/study-resources/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteResource: (id) => api.delete(`/admin/study-resources/${id}`),

    approveResource: (id) => api.post(`/admin/study-resources/${id}/approve`),

    disapproveResource: (id) => api.post(`/admin/study-resources/${id}/disapprove`),

    // Weekly Schedule Management (Admin)
    getSchedules: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.week_number) params.append('week_number', filters.week_number);
        if (filters.year) params.append('year', filters.year);
        if (filters.is_published !== undefined) params.append('is_published', filters.is_published);

        return api.get(`/admin/weekly-schedules?${params.toString()}`);
    },

    createSchedule: (data) => api.post('/admin/weekly-schedules', data),

    getSchedule: (id) => api.get(`/admin/weekly-schedules/${id}`),

    updateSchedule: (id, data) => api.put(`/admin/weekly-schedules/${id}`, data),

    deleteSchedule: (id) => api.delete(`/admin/weekly-schedules/${id}`),

    publishSchedule: (id) => api.post(`/admin/weekly-schedules/${id}/publish`),

    unpublishSchedule: (id) => api.post(`/admin/weekly-schedules/${id}/unpublish`),

    attachResourceToSchedule: (scheduleId, resourceId, order = 0) => {
        return api.post(`/admin/weekly-schedules/${scheduleId}/resources`, {
            resource_id: resourceId,
            order,
        });
    },

    detachResourceFromSchedule: (scheduleId, resourceId) => {
        return api.delete(`/admin/weekly-schedules/${scheduleId}/resources/${resourceId}`);
    },

    updateResourceOrder: (scheduleId, resourceId, order) => {
        return api.put(`/admin/weekly-schedules/${scheduleId}/resources/${resourceId}/order`, {
            order,
        });
    },
};

export default resourceService;
