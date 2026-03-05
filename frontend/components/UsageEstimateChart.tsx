'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts';
import { useCustomerData } from '@/contexts/CustomerDataContext';
import { ChartModal } from './ChartModal';

export function UsageEstimateChart() {
    const { data: customerData } = useCustomerData();
    const info = customerData?.dashboard?.usageEstimate ?? null;
    const rawData = info?.data ?? [];
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Rolling window: always show newest data scrolling in from right.
    // The backend provides 7 data points per tick — we show them as a live ticker.
    const displayData = rawData.map((d: any, i: number) => ({
        ...d,
        // Shade points as "actual" (past) vs "predicted" (future) based on position
        actual: i < Math.ceil(rawData.length * 0.6) ? d.kwh : null,
        predicted: i >= Math.ceil(rawData.length * 0.6) - 1 ? d.kwh : null,
    }));

    const tillNow = info?.tillNow ?? null;
    const predicted = info?.predicted ?? null;

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 flex flex-col h-[300px] cursor-pointer hover:border-neutral-700 hover:shadow-md transition-all group"
            >
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 group-hover:text-gray-300 transition-colors">
                    Usage Estimate
                </h3>

                <div className="flex justify-between text-xs text-gray-500 mb-2 px-1">
                    <span>
                        Till Now:{' '}
                        <span
                            className="text-emerald-400 font-bold tabular-nums"
                            style={{ transition: 'all 0.5s ease' }}
                        >
                            {tillNow ?? '—'} kWh
                        </span>
                    </span>
                    <span>
                        Predicted:{' '}
                        <span
                            className="text-blue-400 font-bold tabular-nums"
                            style={{ transition: 'all 0.5s ease' }}
                        >
                            {predicted ?? '—'} kWh
                        </span>
                    </span>
                </div>

                {/* Fixed pixel height — prevents Recharts -1 dimension bug inside flex */}
                <div style={{ width: '100%', height: 178 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={displayData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="gradPredicted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: 12 }}
                                formatter={(v: any, name: string | undefined) => [`${Number(v).toFixed(2)} kWh`, name === 'actual' ? 'Actual' : 'Predicted']}
                                cursor={{ stroke: '#374151', strokeWidth: 1 }}
                            />
                            <ReferenceLine x={displayData[Math.ceil(displayData.length * 0.6) - 1]?.name} stroke="#374151" strokeDasharray="4 4" />
                            {/* Green: actual consumption */}
                            <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fill="url(#gradActual)" isAnimationActive={false} dot={false} connectNulls={false} />
                            {/* Blue: predicted consumption */}
                            <Area type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 3" fill="url(#gradPredicted)" isAnimationActive={false} dot={false} connectNulls={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <ChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Usage Estimate — This Month">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <defs>
                            <linearGradient id="gradActualModal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradPredictedModal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} tickFormatter={(v) => `${v} kWh`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                            formatter={(v: any, name: string | undefined) => [`${Number(v).toFixed(2)} kWh`, name === 'actual' ? 'Actual' : 'Predicted']}
                            cursor={{ stroke: '#374151', strokeWidth: 1 }}
                        />
                        <ReferenceLine x={displayData[Math.ceil(displayData.length * 0.6) - 1]?.name} stroke="#374151" strokeDasharray="4 4" label={{ value: 'Now', fill: '#6b7280', fontSize: 12 }} />
                        <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} fill="url(#gradActualModal)" isAnimationActive={false} dot={false} connectNulls={false} />
                        <Area type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2.5} strokeDasharray="5 3" fill="url(#gradPredictedModal)" isAnimationActive={false} dot={false} connectNulls={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartModal>
        </>
    );
}
