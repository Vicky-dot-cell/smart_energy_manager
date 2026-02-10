'use client';

import { DashboardShell } from '@/components/DashboardShell';
import { EnergyChart } from '@/components/EnergyChart';

export default function AnalyticsPage() {
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
                        {/* Placeholder for another chart or data visualization */}
                        <div className="h-[300px] flex items-center justify-center text-gray-500 border-2 border-dashed border-neutral-800 rounded-lg">
                            Peak Usage Chart Placeholder
                        </div>
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
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item} className="hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4">Feb 1{item}, 2026</td>
                                        <td className="px-6 py-4">12.{item} kWh</td>
                                        <td className="px-6 py-4">${(1.5 * item).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                                Normal
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
