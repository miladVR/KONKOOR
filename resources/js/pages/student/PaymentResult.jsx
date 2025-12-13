import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, failed
    const [message, setMessage] = useState('در حال تأیید تراکنش...');
    const [refId, setRefId] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const transaction_id = searchParams.get('transaction_id');
            const Authority = searchParams.get('Authority');
            const Status = searchParams.get('Status');

            if (!transaction_id || !Authority || !Status) {
                setStatus('failed');
                setMessage('پارامترهای بازگشت از بانک نامعتبر است.');
                return;
            }

            if (Status !== 'OK') {
                setStatus('failed');
                setMessage('پرداخت توسط کاربر لغو شد یا ناموفق بود.');
                return;
            }

            try {
                const response = await paymentService.verify({
                    transaction_id,
                    Authority,
                    Status
                });
                setStatus('success');
                setMessage('پرداخت با موفقیت انجام شد!');
                setRefId(response.ref_id);
            } catch (error) {
                setStatus('failed');
                setMessage(error.response?.data?.message || 'خطا در تأیید نهایی تراکنش.');
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                {status === 'verifying' && (
                    <div className="animate-pulse">
                        <div className="h-16 w-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
                        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">در حال ارتباط با بانک...</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <FaCheckCircle className="mx-auto text-green-500 text-6xl mb-4" />
                        <h2 className="text-2xl font-bold text-green-600 mb-2">پرداخت موفق</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                        {refId && (
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-6">
                                <span className="block text-sm text-gray-500">شماره پیگیری:</span>
                                <span className="block text-xl font-mono font-bold text-gray-800 dark:text-white">{refId}</span>
                            </div>
                        )}
                        <Link to="/dashboard" className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                            بازگشت به داشبورد
                        </Link>
                    </div>
                )}

                {status === 'failed' && (
                    <div>
                        <FaTimesCircle className="mx-auto text-red-500 text-6xl mb-4" />
                        <h2 className="text-2xl font-bold text-red-600 mb-2">پرداخت ناموفق</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                        <Link to="/subscription/plans" className="block w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition">
                            تلاش مجدد
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;
