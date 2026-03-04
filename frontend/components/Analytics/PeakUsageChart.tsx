'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api, type PeakPoint } from '@/lib/api';

export function PeakUsageChart() {
    const [data, setData] = useState<PeakPoint[]>([]);

    useEffect(() => {
        api.analytics().then(res => setData(res.peakUsageHours)).catch(console.error);
    }, []);

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} kW`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fbbf24' }}
                    />
                    <Area type="monotone" dataKey="usage" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
