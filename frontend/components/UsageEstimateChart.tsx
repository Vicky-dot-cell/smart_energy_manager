'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { api, type UsageEstimate } from '@/lib/api';

export function UsageEstimateChart() {
    const [info, setInfo] = useState<UsageEstimate | null>(null);

    useEffect(() => {
        api.usageEstimate().then(setInfo).catch(console.error);
    }, []);

    return (
        <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 flex flex-col h-[300px]">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Usage Estimate</h3>

            <div className="flex justify-between text-xs text-gray-400 mb-2 px-2">
                <span>Till Now: <span className="text-white font-bold">{info?.tillNow ?? '—'} kWh</span></span>
                <span>Predicted: <span className="text-white font-bold">{info?.predicted ?? '—'} kWh</span></span>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={info?.data ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="splitColor" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0.5" stopColor="#ec4899" stopOpacity={0.8} />
                                <stop offset="0.5" stopColor="#3b82f6" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                        <XAxis dataKey="name" hide />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                        <ReferenceLine x="Current" stroke="#666" strokeDasharray="3 3" />
                        <Area type="monotone" dataKey="kwh" stroke="none" fill="url(#splitColor)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
