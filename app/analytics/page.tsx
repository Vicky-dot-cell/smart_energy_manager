'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { EnergyChart } from '@/components/EnergyChart';
import { PeakUsageChart } from '@/components/Analytics/PeakUsageChart';
import { api, type MonthlyRow } from '@/lib/api';

export default function AnalyticsPage() {
    const [rows, setRows] = useState<MonthlyRow[]>([]);

    useEffect(() => {
        api.analytics().then(res => setRows(res.monthlyBreakdown)).catch(console.error);
    }, []);

    return (
        <DashboardShell>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-100">Analytics</h1>
                <p className="text-gray-400">Detailed overview of energy consumption.</p>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <EnergyChart />
                    <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800">
                        <h3 className="text-lg font-semibold text-gray-100 mb-6">Peak Usage Hours</h3>
                        <PeakUsageChart />
                    </div>
                </div>

                <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 overflow-hidden">
                    <div className="p-6 border-b border-neutral-800">
                        <h3 className="text-lg font-semibold text-gray-100">Monthly Usage Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-neutral-950 text-gray-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Consumption (kWh)</th>
                                    <th className="px-6 py-4">Cost (Est.)</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4">{row.date}</td>
                                        <td className="px-6 py-4">{row.consumption} kWh</td>
                                        <td className="px-6 py-4">${row.cost.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'High'
                                                    ? 'bg-red-500/10 text-red-400'
                                                    : 'bg-green-500/10 text-green-400'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
