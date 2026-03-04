'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/DashboardShell';
import { api } from '@/lib/api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

function PaymentGatewayInner() {
    const { formatCurrency } = useSettings();
    const searchParams = useSearchParams();
    const router = useRouter();
    const amount = Number(searchParams.get('amount'));
    const method = searchParams.get('method') || 'Unknown';

    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('Processing your payment...');

    useEffect(() => {
        if (!amount || isNaN(amount)) {
            setStatus('error');
            setMessage('Invalid payment amount. Please try again.');
            return;
        }

        api.pay(amount, method)
            .then(res => {
                setStatus('success');
                setMessage(res.message || 'Payment processed successfully!');
                setTimeout(() => {
                    router.push('/bill');
                }, 3000);
            })
            .catch(err => {
                setStatus('error');
                setMessage(err.message || 'Payment failed.');
            });
    }, [amount, method, router]);

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-center">
            {status === 'processing' && (
                <div className="flex flex-col items-center">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                    <h2 className="text-xl font-bold text-gray-100 mb-2">Processing Payment</h2>
                    <p className="text-sm text-gray-400">Do not refresh or close this window...</p>
                    <div className="mt-8 text-left bg-neutral-800 rounded-lg p-4 w-full">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Amount:</span>
                            <span className="font-semibold text-gray-200">{formatCurrency(amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Method:</span>
                            <span className="font-semibold text-gray-200">{method}</span>
                        </div>
                    </div>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-100 mb-2">Payment Successful!</h2>
                    <p className="text-sm text-gray-400 mb-8">{message}</p>
                    <button
                        onClick={() => router.push('/bill')}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-xl w-full transition-colors"
                    >
                        Return to Bill
                    </button>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center">
                    <XCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-100 mb-2">Payment Failed</h2>
                    <p className="text-sm text-gray-400 mb-8">{message}</p>
                    <button
                        onClick={() => router.push('/bill')}
                        className="bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-3 px-6 rounded-xl w-full transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            )}
        </div>
    );
}

export default function PaymentPage() {
    return (
        <DashboardShell>
            <Suspense fallback={<div className="flex h-64 items-center justify-center text-gray-400">Loading payment gateway...</div>}>
                <PaymentGatewayInner />
            </Suspense>
        </DashboardShell>
    );
}
