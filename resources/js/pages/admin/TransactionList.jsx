import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import moment from 'moment-jalaali';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await adminService.getTransactions(page);
            setTransactions(response.data.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid': return <FaCheckCircle className="text-green-500" />;
            case 'failed': return <FaTimesCircle className="text-red-500" />;
            default: return <FaClock className="text-yellow-500" />;
        }
    };

    if (loading) return <div className="p-8 text-center">در حال بارگذاری لیست تراکنش‌ها...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden" dir="rtl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">لیست تراکنش‌های مالی</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">کاربر</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">بسته</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">مبلغ (تومان)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاریخ</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">وضعیت</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">کد پیگیری</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.map((trx) => (
                            <tr key={trx.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {trx.user?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {trx.package?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold">
                                    {parseInt(trx.amount).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {moment(trx.created_at).format('jYYYY/jMM/jDD HH:mm')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(trx.status)}
                                        <span className={`
                                            ${trx.status === 'paid' ? 'text-green-600' : ''}
                                            ${trx.status === 'failed' ? 'text-red-600' : ''}
                                            ${trx.status === 'pending' ? 'text-yellow-600' : ''}
                                        `}>
                                            {trx.status === 'paid' ? 'موفق' : (trx.status === 'failed' ? 'ناموفق' : 'در انتظار')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                                    {trx.ref_id || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionList;
