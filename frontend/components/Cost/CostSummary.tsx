'use client';

import { useEffect, useState } from 'react';
import { api, type CostSummary } from '@/lib/api';

export function CostSummary() {
    const [summary, setSummary] = useState<CostSummary | null>(null);

    useEffect(() => {
        // We load cost for TODAY by default just to get the summary
        api.cost('TODAY').then(res => setSummary(res.summary)).catch(console.error);
    }, []);

    const items = [
        { label: 'January', value: summary ? `$${summary.lastMonth}` : '—' },
        { label: 'So Far This Month', value: summary ? `$${summary.soFarThisMonth}` : '—' },
        { label: 'Predicted This Month', value: summary ? `$${summary.predictedThisMonth}` : '—' },
        { label: 'Estimated Savings', value: summary ? `$${summary.estimatedSavings}` : '—' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {items.map(item => (
                <div key={item.label} className="flex flex-col items-center">
                    <h3 className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2">{item.label}</h3>
                    <p className="text-4xl font-bold text-gray-100">{item.value}</p>
                </div>
            ))}
        </div>
    );
}
