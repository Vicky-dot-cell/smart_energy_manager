'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useCustomerData } from '@/contexts/CustomerDataContext';
import { ChartModal } from './ChartModal';

export function CostChangeChart() {
    const { formatCurrency } = useSettings();
    const { data: customerData } = useCustomerData();
    const data = customerData?.dashboard?.costChange ?? [];
    const [isModalOpen, setIsModalOpen] = useState(false);

    const n = data.length;
    const percentageChange = n >= 2
        ? ((data[n - 1].cost - data[n - 2].cost) / data[n - 2].cost) * 100
        : 12.5;
    const isUp = percentageChange >= 0;

    const barColors = (index: number) => {
        if (index === n - 1) return '#2dd4bf'; // current month highlight
        return '#334155';
    };

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 flex flex-col h-[300px] cursor-pointer hover:border-neutral-700 hover:shadow-md transition-all group"
            >
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 group-hover:text-gray-300 transition-colors">Change in Cost</h3>
                <div className="flex flex-row items-stretch flex-1 gap-4 min-h-0">
                    {/* Fixed pixel height wrapper — never 100% inside flex */}
                    <div style={{ width: '60%', height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 18, right: 8, left: 0, bottom: 0 }}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 11 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: '1px solid #333', color: '#fff', fontSize: 12 }}
                                    formatter={(v: number | undefined) => [formatCurrency(v ?? 0), 'Cost']}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar
                                    dataKey="cost"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={44}
                                    isAnimationActive={false}
                                >
                                    {data.map((_: any, i: number) => (
                                        <Cell key={`cell-${i}`} fill={barColors(i)} />
                                    ))}
                                    <LabelList
                                        dataKey="cost"
                                        position="top"
                                        fill="#9ca3af"
                                        fontSize={10}
                                        formatter={(val: any) => formatCurrency(Number(val) || 0)}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-start">
                        <div className={`flex items-center gap-2 mb-1 ${isUp ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {isUp ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                            <span
                                className="text-2xl font-bold tabular-nums"
                                style={{ transition: 'all 0.5s ease' }}
                            >
                                {Math.abs(percentageChange).toFixed(1)}%
                            </span>
                        </div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                            {isUp ? 'increase' : 'decrease'} in cost
                        </p>
                    </div>
                </div>
            </div>

            <ChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Change in Cost — Month over Month">
                <div className="flex flex-row items-stretch h-full w-full gap-6">
                    <div className="flex-1 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 13 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: '1px solid #333', color: '#fff' }}
                                    formatter={(v: number | undefined) => [formatCurrency(v ?? 0), 'Cost']}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="cost" radius={[6, 6, 0, 0]} maxBarSize={60} isAnimationActive={false}>
                                    {data.map((_: any, i: number) => (
                                        <Cell key={`cell-modal-${i}`} fill={barColors(i)} />
                                    ))}
                                    <LabelList dataKey="cost" position="top" fill="#e5e7eb" fontSize={13} formatter={(v: any) => formatCurrency(Number(v) || 0)} offset={10} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-48 flex flex-col justify-center items-center">
                        <div className={`flex items-center gap-3 mb-2 ${isUp ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {isUp ? <TrendingUp size={36} /> : <TrendingDown size={36} />}
                            <span className="text-5xl font-bold tabular-nums">{Math.abs(percentageChange).toFixed(1)}%</span>
                        </div>
                        <p className="text-gray-400 text-base uppercase tracking-wider">{isUp ? 'Increase' : 'Decrease'} in Cost</p>
                    </div>
                </div>
            </ChartModal>
        </>
    );
}
