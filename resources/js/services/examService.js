import api from './api';

const examService = {
    // دریافت آزمون‌های قابل شرکت
    getAvailableExams: async () => {
        const response = await api.get('/exams/available');
        return response.data;
    },

    // شروع آزمون
    startExam: async (examId) => {
        const response = await api.post(`/exams/${examId}/start`);
        return response.data;
    },

    // دریافت سوالات آزمون
    getExamQuestions: async (studentExamId, sessionId) => {
        const response = await api.get(`/exams/student-exams/${studentExamId}/questions`, {
            headers: {
                'X-Session-ID': sessionId
            }
        });
        return response.data;
    },

    // ثبت پاسخ (Auto-save)
    submitAnswer: async (studentExamId, sessionId, questionId, selectedAnswer, timeSpent) => {
        const response = await api.post(`/exams/student-exams/${studentExamId}/submit-answer`, {
            question_id: questionId,
            selected_answer: selectedAnswer,
            time_spent: timeSpent
        }, {
            headers: {
                'X-Session-ID': sessionId
            }
        });
        return response.data;
    },

    // علامت‌گذاری سوال
    toggleBookmark: async (studentExamId, sessionId, questionId) => {
        const response = await api.post(`/exams/student-exams/${studentExamId}/bookmark`, {
            question_id: questionId
        }, {
            headers: {
                'X-Session-ID': sessionId
            }
        });
        return response.data;
    },

    // ثبت فعالیت (tab switch, fullscreen exit)
    logActivity: async (studentExamId, sessionId, activityType) => {
        const response = await api.post(`/exams/student-exams/${studentExamId}/log-activity`, {
            activity_type: activityType
        }, {
            headers: {
                'X-Session-ID': sessionId
            }
        });
        return response.data;
    },

    // تحویل نهایی آزمون
    submitExam: async (studentExamId, sessionId) => {
        const response = await api.post(`/exams/student-exams/${studentExamId}/submit`, {}, {
            headers: {
                'X-Session-ID': sessionId
            }
        });
        return response.data;
    },

    // مشاهده نتایج
    getResults: async (studentExamId) => {
        const response = await api.get(`/exams/student-exams/${studentExamId}/results`);
        return response.data;
    },

    // ادامه آزمون
    resumeExam: async (studentExamId) => {
        const response = await api.get(`/exams/student-exams/${studentExamId}/resume`);
        return response.data;
    }
};

export default examService;
