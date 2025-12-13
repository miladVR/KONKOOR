import api from './api';

const questionService = {
    // دریافت لیست سوالات
    getQuestions: async (filters = {}) => {
        const response = await api.get('/admin/questions', { params: filters });
        return response.data;
    },

    // ایجاد سوال جدید
    createQuestion: async (data) => {
        const formData = new FormData();

        // افزودن فیلدهای متنی
        Object.keys(data).forEach(key => {
            if (key.includes('_image') && data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const response = await api.post('/admin/questions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // دریافت جزئیات سوال
    getQuestion: async (id) => {
        const response = await api.get(`/admin/questions/${id}`);
        return response.data;
    },

    // ویرایش سوال
    updateQuestion: async (id, data) => {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (key.includes('_image') && data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        // Laravel doesn't support PUT with FormData, so we use POST with _method
        formData.append('_method', 'PUT');

        const response = await api.post(`/admin/questions/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // حذف سوال
    deleteQuestion: async (id) => {
        const response = await api.delete(`/admin/questions/${id}`);
        return response.data;
    },

    // ایمپورت سوالات
    importQuestions: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/admin/questions/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // اکسپورت سوالات
    exportQuestions: async () => {
        const response = await api.get('/admin/questions/export', {
            responseType: 'blob'
        });
        return response.data;
    },

    // دانلود قالب Excel
    downloadTemplate: async () => {
        const response = await api.get('/admin/questions/template', {
            responseType: 'blob'
        });
        return response.data;
    }
};

export default questionService;
