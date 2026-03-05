'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, Cell, Tooltip } from 'recharts';
import { useCustomerData } from '@/contexts/CustomerDataContext';
import { ChartModal } from './ChartModal';

export function ActiveAppliancesChart() {
    const { data: customerData } = useCustomerData();
    const info = customerData?.dashboard?.activeAppliances ?? null;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const data = info?.data ?? [];

    // Purple gradient stops for each bar
    const colors = ['#a855f7', '#9333ea', '#7c3aed', '#8b5cf6', '#c084fc', '#d8b4fe'];

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 flex flex-col h-[300px] cursor-pointer hover:border-neutral-700 hover:shadow-md transition-all group"
            >
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 group-hover:text-gray-300 transition-colors">Active Appliances</h3>

                <div className="flex flex-row items-center flex-1 gap-2 min-h-0">
                    {/* Fixed pixel height to avoid Recharts -1 bug inside flex */}
                    <div style={{ width: '65%', height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={data}
                                margin={{ top: 0, right: 52, left: 0, bottom: 0 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#d4d4d4', fontSize: 11 }}
                                    width={88}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: '1px solid #333', color: '#fff', fontSize: 12 }}
                                    formatter={(v: any) => [`${v} kWh`, 'Usage']}
                                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                />
                                <Bar
                                    dataKey="kwh"
                                    background={{ fill: '#1e1e1e', radius: 4 }}
                                    radius={[0, 4, 4, 0]}
                                    isAnimationActive={false}
                                >
                                    {data.map((_: any, i: number) => (
                                        <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                                    ))}
                                    <LabelList
                                        dataKey="kwh"
                                        position="right"
                                        fill="#9ca3af"
                                        fontSize={11}
                                        formatter={(v: any) => `${v} kWh`}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                        <span
                            className="text-3xl font-bold text-white tabular-nums"
                            style={{ transition: 'all 0.5s ease' }}
                        >
                            {info?.top3Percent ?? '—'}%
                        </span>
                        <p className="text-xs text-gray-500 mt-1 leading-tight">Top 3 share<br />of net usage</p>
                    </div>
                </div>
            </div>

            <ChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Active Appliances — Top Consumers">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data} margin={{ top: 20, right: 100, left: 20, bottom: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#d4d4d4', fontSize: 14 }}
                            width={130}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: '1px solid #333', color: '#fff' }}
                            formatter={(v: any) => [`${v} kWh`, 'Usage']}
                            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                        />
                        <Bar dataKey="kwh" barSize={28} background={{ fill: '#1e1e1e', radius: 4 }} radius={[0, 6, 6, 0]} isAnimationActive={false}>
                            {data.map((_: any, i: number) => (
                                <Cell key={`cell-modal-${i}`} fill={colors[i % colors.length]} />
                            ))}
                            <LabelList dataKey="kwh" position="right" fill="#e5e7eb" fontSize={14} formatter={(v: any) => `${v} kWh`} offset={12} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartModal>
        </>
    );
}
