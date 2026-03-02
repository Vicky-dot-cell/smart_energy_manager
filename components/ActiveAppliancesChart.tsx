'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { api, type ApplianceBar } from '@/lib/api';

export function ActiveAppliancesChart() {
    const [info, setInfo] = useState<{ top3Percent: number; data: ApplianceBar[] } | null>(null);

    useEffect(() => {
        api.activeAppliances().then(setInfo).catch(console.error);
    }, []);

    const data = info?.data ?? [];

    return (
        <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 flex flex-col h-[300px]">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Active Appliances</h3>

            <div className="flex-1 w-full min-h-0 flex flex-row">
                <div className="w-2/3 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#d4d4d4', fontSize: 12 }}
                                width={90}
                            />
                            <Bar dataKey="kwh" background={{ fill: 'transparent' }} radius={[0, 4, 4, 0]}>
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill="#a855f7" />
                                ))}
                                <LabelList dataKey="kwh" position="right" fill="#fff" formatter={(val: any) => `${val} kWh`} fontSize={12} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/3 flex items-end justify-center pb-8 text-center">
                    <p className="text-xs text-gray-400">
                        Top 3 appliances make up <span className="text-white font-bold">{info?.top3Percent ?? '—'}%</span> of the net usage.
                    </p>
                </div>
            </div>
        </div>
    );
}
