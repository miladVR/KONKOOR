import './bootstrap';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 text-red-900 font-mono text-left" dir="ltr">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
                    <details className="whitespace-pre-wrap">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
import GuestLayout from './components/layout/GuestLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DailyLogForm from './pages/student/DailyLogForm';
import DailyLogList from './pages/student/DailyLogList';
import TakeExam from './pages/student/TakeExam';
import ExamResults from './pages/student/ExamResults';
import WeeklyResources from './pages/student/WeeklyResources';
import ResourceList from './pages/admin/ResourceList';
import LandingPage from './pages/landing/LandingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';
import UserCreate from './pages/admin/UserCreate';
import UserEdit from './pages/admin/UserEdit';
import RoleManagement from './pages/admin/RoleManagement';
import AuditLogList from './pages/admin/AuditLogList';
import TransactionList from './pages/admin/TransactionList';
import QuestionBank from './pages/admin/QuestionBank';
import QuestionForm from './pages/admin/QuestionForm';
import ExamList from './pages/admin/ExamList';
import ExamForm from './pages/admin/ExamForm';
import AvailableExams from './pages/student/AvailableExams';
import StudyPlanView from './pages/student/StudyPlanView';
import StudyPlanForm from './pages/student/StudyPlanForm';
import SubscriptionPlans from './pages/student/SubscriptionPlans';
import PaymentResult from './pages/student/PaymentResult';
import { dailyLogService } from './services/dailyLogService';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">در حال بارگذاری...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles.length > 0) {
        const hasRole = roles.some(role => user.roles?.some(userRole => userRole.name === role));
        if (!hasRole) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
};

// Dashboard Component with Charts
const Dashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await dailyLogService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const weeklyChartData = {
        labels: stats?.last_7_days?.map(d => d.date) || [],
        datasets: [
            {
                label: 'ساعات مطالعه',
                data: stats?.last_7_days?.map(d => d.total_hours) || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const subjectChartData = {
        labels: stats?.by_subject?.map(s => s.subject) || [],
        datasets: [
            {
                data: stats?.by_subject?.map(s => s.total_hours) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                ],
            },
        ],
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-xl text-gray-700 dark:text-gray-300">در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                داشبورد دانش‌آموز
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                خوش آمدید، {user?.name}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {user.roles?.some(r => r.name === 'admin') && (
                                <Link to="/admin" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition">
                                    پنل مدیریت
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition"
                            >
                                خروج
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">مجموع ساعات</p>
                                <p className="text-3xl font-bold mt-2">{stats?.overall?.total_hours || 0}</p>
                                <p className="text-blue-100 text-xs mt-1">ساعت مطالعه</p>
                            </div>
                            <div className="text-5xl opacity-30">📊</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">مجموع تست‌ها</p>
                                <p className="text-3xl font-bold mt-2">{stats?.overall?.total_tests || 0}</p>
                                <p className="text-green-100 text-xs mt-1">تست حل شده</p>
                            </div>
                            <div className="text-5xl opacity-30">✅</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm">میانگین کیفیت</p>
                                <p className="text-3xl font-bold mt-2">{stats?.overall?.avg_quality || 0}</p>
                                <p className="text-yellow-100 text-xs mt-1">از 10</p>
                            </div>
                            <div className="text-5xl opacity-30">⭐</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">تعداد گزارش‌ها</p>
                                <p className="text-3xl font-bold mt-2">{stats?.overall?.total_logs || 0}</p>
                                <p className="text-purple-100 text-xs mt-1">گزارش ثبت شده</p>
                            </div>
                            <div className="text-5xl opacity-30">📝</div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Weekly Progress Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            پیشرفت هفتگی (7 روز اخیر)
                        </h3>
                        {stats?.last_7_days?.length > 0 ? (
                            <Line data={weeklyChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                هنوز داده‌ای برای نمایش وجود ندارد
                            </div>
                        )}
                    </div>

                    {/* Subject Breakdown Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            توزیع دروس (بر اساس ساعت)
                        </h3>
                        {stats?.by_subject?.length > 0 ? (
                            <Doughnut data={subjectChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                هنوز داده‌ای برای نمایش وجود ندارد
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Access Cards */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">دسترسی سریع</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <Link
                            to="/daily-logs/create"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-8 px-6 rounded-lg text-center transition duration-300 transform hover:scale-105"
                        >
                            <div className="text-4xl mb-2">📝</div>
                            <div className="text-xl">ثبت گزارش روزانه</div>
                        </Link>

                        <Link
                            to="/daily-logs"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-8 px-6 rounded-lg text-center transition duration-300 transform hover:scale-105"
                        >
                            <div className="text-4xl mb-2">📊</div>
                            <div className="text-xl">مشاهده گزارش‌ها</div>
                        </Link>

                        <Link
                            to="/study-plans"
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-8 px-6 rounded-lg text-center transition duration-300 transform hover:scale-105"
                        >
                            <div className="text-4xl mb-2">📚</div>
                            <div className="text-xl">برنامه مطالعاتی</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route element={<GuestLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/daily-logs" element={
                        <ProtectedRoute>
                            <DailyLogList />
                        </ProtectedRoute>
                    } />
                    <Route path="/daily-logs/create" element={
                        <ProtectedRoute>
                            <DailyLogForm />
                        </ProtectedRoute>
                    } />
                    <Route path="/study-plans" element={
                        <ProtectedRoute>
                            <StudyPlanView />
                        </ProtectedRoute>
                    } />
                    <Route path="/study-plans/create" element={
                        <ProtectedRoute>
                            <StudyPlanForm />
                        </ProtectedRoute>
                    } />
                    <Route path="/study-plans/edit/:id" element={
                        <ProtectedRoute>
                            <StudyPlanForm />
                        </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute roles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                        <ProtectedRoute roles={['admin']}>
                            <UserList />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/users/create" element={
                        <ProtectedRoute roles={['admin']}>
                            <UserCreate />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/users/edit/:id" element={
                        <ProtectedRoute roles={['admin']}>
                            <UserEdit />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/roles" element={
                        <ProtectedRoute roles={['admin']}>
                            <RoleManagement />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/audit-logs" element={
                        <ProtectedRoute roles={['admin']}>
                            <AuditLogList />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/transactions" element={
                        <ProtectedRoute roles={['admin']}>
                            <TransactionList />
                        </ProtectedRoute>
                    } />

                    {/* Admin - Question Bank */}
                    <Route path="/admin/questions" element={
                        <ProtectedRoute roles={['admin', 'assistant']}>
                            <QuestionBank />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/questions/create" element={
                        <ProtectedRoute roles={['admin', 'assistant']}>
                            <QuestionForm />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/questions/:id/edit" element={
                        <ProtectedRoute roles={['admin', 'assistant']}>
                            <QuestionForm />
                        </ProtectedRoute>
                    } />

                    {/* Admin - Exams */}
                    <Route path="/admin/exams" element={
                        <ProtectedRoute roles={['admin', 'assistant']}>
                            <ExamList />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/exams/create" element={
                        <ProtectedRoute roles={['admin', 'assistant']}>
                            <ExamForm />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/exams/:id/edit" element={
                        <ProtectedRoute roles={['admin', 'assistant']}>
                            <ExamForm />
                        </ProtectedRoute>
                    } />

                    {/* Admin - Weekly Resources */}
                    <Route path="/admin/resources" element={
                        <ProtectedRoute roles={['admin', 'assistant']}>
                            <ResourceList />
                        </ProtectedRoute>
                    } />

                    {/* Student - Exams */}
                    <Route path="/student/exams" element={
                        <ProtectedRoute>
                            <AvailableExams />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/exams/take/:studentExamId" element={
                        <ProtectedRoute>
                            <TakeExam />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/exams/results/:studentExamId" element={
                        <ProtectedRoute>
                            <ExamResults />
                        </ProtectedRoute>
                    } />

                    {/* Student - Weekly Resources */}
                    <Route path="/weekly-resources" element={
                        <ProtectedRoute>
                            <WeeklyResources />
                        </ProtectedRoute>
                    } />

                    {/* Financial Module */}
                    <Route path="/subscription/plans" element={
                        <ProtectedRoute>
                            <SubscriptionPlans />
                        </ProtectedRoute>
                    } />
                    <Route path="/payment/callback" element={
                        <ProtectedRoute>
                            <PaymentResult />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
}
