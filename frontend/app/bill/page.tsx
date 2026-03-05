'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { FileText, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

// ─── Static bill data (never changes with real-time updates) ───────────────────
const STATIC_BILL = {
    invoiceNumber: 'INV-2025-0312',
    billingPeriod: 'Feb 1, 2025 – Feb 28, 2025',
    dueDate: 'Mar 15, 2025',
    status: 'Unpaid' as string,
    currentCharges: 1284.50,
    fixedCharges: 120.00,
    taxes: 70.23,
    totalDue: 1474.73,
    savings: 142.80,
    paymentHistory: [
        { id: 'TXN-20250201', date: 'Jan 31, 2025', method: 'UPI', amount: 1390.20, status: 'Paid' },
        { id: 'TXN-20250101', date: 'Dec 31, 2024', method: 'Credit Card', amount: 1520.00, status: 'Paid' },
    ],
};
// ──────────────────────────────────────────────────────────────────────────────

type PayState = 'idle' | 'redirecting' | 'success';

export default function BillPage() {
    const { formatCurrency } = useSettings();
    const bill = STATIC_BILL;

    const [selectedMethod, setSelectedMethod] = useState('Credit Card');
    const [payState, setPayState] = useState<PayState>('idle');
    const [countdown, setCountdown] = useState(3);

    // Drive the countdown + state transitions using explicit timeouts (more reliable)
    useEffect(() => {
        if (payState === 'idle') return;

        setCountdown(3);
        const t1 = setTimeout(() => setCountdown(2), 1000);
        const t2 = setTimeout(() => setCountdown(1), 2000);
        const t3 = setTimeout(() => {
            setPayState(prev => (prev === 'redirecting' ? 'success' : 'idle'));
        }, 3000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [payState]);

    const handlePay = () => {
        if (payState === 'idle') setPayState('redirecting');
    };

    // ── Overlay screens ────────────────────────────────────────────────────────
    if (payState === 'redirecting') {
        return (
            <DashboardShell>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="max-w-md w-full p-10 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-center flex flex-col items-center gap-6">
                        <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-100 mb-2">Redirecting to Payment</h2>
                            <p className="text-sm text-gray-400">Please wait, do not close this window…</p>
                        </div>
                        <div className="bg-neutral-800 rounded-xl p-4 w-full text-left space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Amount</span>
                                <span className="font-semibold text-gray-200">{formatCurrency(bill.totalDue)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Method</span>
                                <span className="font-semibold text-gray-200">{selectedMethod}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">Redirecting in {countdown}s…</p>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    if (payState === 'success') {
        return (
            <DashboardShell>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="max-w-md w-full p-10 bg-neutral-900 border border-green-900/50 rounded-3xl shadow-2xl text-center flex flex-col items-center gap-6">
                        <div className="relative">
                            <CheckCircle className="w-20 h-20 text-green-400" />
                            <span className="absolute -inset-2 rounded-full bg-green-500/10 animate-ping" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-100 mb-2">Bill Paid Successfully!</h2>
                            <p className="text-sm text-gray-400">
                                {formatCurrency(bill.totalDue)} paid via {selectedMethod}.<br />
                                Returning to your bill in {countdown}s…
                            </p>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-1000"
                                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    // ── Main bill page ─────────────────────────────────────────────────────────
    return (
        <DashboardShell>
            <div className="max-w-4xl mx-auto space-y-6 text-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Bill &amp; Payment</h1>
                        <p className="text-sm text-gray-400">View your current billing details and make payments.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bill Details */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="text-blue-400" />
                            <h2 className="text-lg font-semibold">Bill Details</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-neutral-800 pb-2">
                                <span className="text-gray-400">Invoice Number</span>
                                <span className="font-medium">{bill.invoiceNumber}</span>
                            </div>
                            <div className="flex justify-between border-b border-neutral-800 pb-2">
                                <span className="text-gray-400">Billing Period</span>
                                <span className="font-medium">{bill.billingPeriod}</span>
                            </div>
                            <div className="flex justify-between border-b border-neutral-800 pb-2">
                                <span className="text-gray-400">Due Date</span>
                                <span className="font-medium text-red-400">{bill.dueDate}</span>
                            </div>
                            <div className="flex justify-between border-b border-neutral-800 pb-2">
                                <span className="text-gray-400">Status</span>
                                <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${bill.status === 'Paid' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                                    {bill.status}
                                </span>
                            </div>
                            {bill.savings > 0 && (
                                <div className="mt-4 p-3 bg-green-900/20 border border-green-900/50 rounded-lg flex items-center gap-2 text-green-400 text-sm">
                                    <CheckCircle size={16} />
                                    <span>Great job! You saved {formatCurrency(bill.savings)} compared to last month.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="text-blue-400" />
                            <h2 className="text-lg font-semibold">Cost Breakdown</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Current Energy Charges</span>
                                <span>{formatCurrency(bill.currentCharges)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Fixed Charges</span>
                                <span>{formatCurrency(bill.fixedCharges)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Taxes (5%)</span>
                                <span>{formatCurrency(bill.taxes)}</span>
                            </div>
                            <div className="pt-4 border-t border-neutral-800 flex justify-between items-center text-lg font-bold">
                                <span>Total Amount Due</span>
                                <span className="text-xl text-blue-400">{formatCurrency(bill.totalDue)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Options */}
                {bill.status === 'Unpaid' ? (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="text-blue-400" />
                            <h2 className="text-lg font-semibold">Select Payment Method</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {['Credit Card', 'Debit Card', 'UPI', 'Net Banking'].map(method => (
                                <button
                                    key={method}
                                    onClick={() => setSelectedMethod(method)}
                                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${selectedMethod === method ? 'bg-blue-900/20 border-blue-500' : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'}`}
                                >
                                    <span className="text-sm font-medium">{method}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handlePay}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
                            >
                                Pay Now — {formatCurrency(bill.totalDue)}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2"><CheckCircle /> Bill is Paid</h2>
                        <p className="text-gray-400">Your bill for this period has been successfully paid. Thank you!</p>

                        {bill.paymentHistory && bill.paymentHistory.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-md font-medium mb-3">Recent Payments</h3>
                                <div className="space-y-3">
                                    {bill.paymentHistory.map((ph: any) => (
                                        <div key={ph.id} className="flex justify-between items-center p-3 bg-neutral-800/50 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium">{ph.date}</p>
                                                <p className="text-xs text-gray-500">Txn: {ph.id} • {ph.method}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-200">{formatCurrency(ph.amount)}</p>
                                                <p className="text-xs text-green-400">{ph.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}
