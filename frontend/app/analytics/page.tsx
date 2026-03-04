'use client';

import { useSettings } from '@/contexts/SettingsContext';
import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { EnergyChart } from '@/components/EnergyChart';
import { PeakUsageChart } from '@/components/Analytics/PeakUsageChart';
import { api, type MonthlyRow } from '@/lib/api';

export default function AnalyticsPage() {
    const { formatCurrency } = useSettings();
    const [rows, setRows] = useState<MonthlyRow[]>([]);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const toggleRow = (index: number) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

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
                                    <React.Fragment key={i}>
                                        <tr
                                            onClick={() => toggleRow(i)}
                                            className="hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`transform transition-transform ${expandedRow === i ? 'rotate-90' : ''} text-gray-500`}>
                                                        ▶
                                                    </span>
                                                    {row.date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{row.consumption} kWh</td>
                                            <td className="px-6 py-4">{formatCurrency(row.cost)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'High'
                                                    ? 'bg-red-500/10 text-red-400'
                                                    : 'bg-green-500/10 text-green-400'
                                                    }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                        {expandedRow === i && (
                                            <tr className="bg-neutral-900/40">
                                                <td colSpan={4} className="px-8 py-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                                                            <h4 className="text-sm font-semibold text-gray-300 mb-3 border-b border-neutral-800 pb-2">Category Breakdown</h4>
                                                            <div className="space-y-2 text-sm text-gray-400">
                                                                <div className="flex justify-between"><span>HVAC:</span> <span className="text-gray-200">{(row.consumption * 0.45).toFixed(1)} kWh</span></div>
                                                                <div className="flex justify-between"><span>Appliances:</span> <span className="text-gray-200">{(row.consumption * 0.30).toFixed(1)} kWh</span></div>
                                                                <div className="flex justify-between"><span>Lighting:</span> <span className="text-gray-200">{(row.consumption * 0.15).toFixed(1)} kWh</span></div>
                                                                <div className="flex justify-between"><span>Other:</span> <span className="text-gray-200">{(row.consumption * 0.10).toFixed(1)} kWh</span></div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 flex flex-col justify-center">
                                                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Efficiency Rating</h4>
                                                            <div className="flex items-baseline gap-2 mb-2">
                                                                <span className="text-3xl font-bold text-cyan-400">A</span>
                                                                <span className="text-gray-500">Tier</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                                Your usage pattern for {row.date} was better than 75% of similar households in your area.
                                                            </p>
                                                        </div>
                                                        <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 flex flex-col justify-center">
                                                            <h4 className="text-sm font-semibold text-gray-300 mb-2">AI Cost Insight</h4>
                                                            <p className="text-sm text-gray-400 leading-relaxed mb-2">
                                                                Reducing HVAC usage by just 2 hours daily could have saved you <strong>{formatCurrency(row.cost * 0.12)}</strong> this month.
                                                            </p>
                                                            <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded transition-colors self-start">
                                                                View Adjustments
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
