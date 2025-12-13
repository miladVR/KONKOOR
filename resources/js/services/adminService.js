const adminService = {
    getAuditLogs: (page = 1, filters = {}) => {
        const query = new URLSearchParams({ page, ...filters }).toString();
        return axios.get(`${API_URL}/admin/audit-logs?${query}`, { headers: getAuthHeader() });
    },
    getTransactions: (page = 1) => {
        return axios.get(`${API_URL}/admin/transactions?page=${page}`, { headers: getAuthHeader() });
    }
};

export default adminService;
