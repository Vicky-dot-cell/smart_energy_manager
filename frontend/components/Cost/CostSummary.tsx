'use client';

import { useCustomerData } from '@/contexts/CustomerDataContext';

export function CostSummary() {
    const { data: customerData } = useCustomerData();
    const summary = customerData?.cost?.summary ?? null;

    const fmt = (v: number | null | undefined) =>
        v != null ? `₹${Number(v).toFixed(2)}` : '—';

    const items = [
        { label: 'Last Month', value: fmt(summary?.lastMonth) },
        { label: 'So Far This Month', value: fmt(summary?.soFarThisMonth) },
        { label: 'Predicted This Month', value: fmt(summary?.predictedThisMonth) },
        { label: 'Estimated Savings', value: fmt(summary?.estimatedSavings) },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {items.map(item => (
                <div key={item.label} className="flex flex-col items-center">
                    <h3 className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2">{item.label}</h3>
                    <p
                        className="text-4xl font-bold text-gray-100 tabular-nums"
                        style={{ transition: 'all 0.5s ease' }}
                    >
                        {item.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
