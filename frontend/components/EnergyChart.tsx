'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api, type EnergyPoint, type Range } from '@/lib/api';

interface EnergyChartProps {
    range?: Range;
}

export function EnergyChart({ range = 'TODAY' }: EnergyChartProps) {
    const [data, setData] = useState<EnergyPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.energyChart(range)
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [range]);

    const title = range === 'YEAR'
        ? 'Power Consumption (This Year)'
        : range === 'MONTH'
            ? 'Power Consumption (This Month)'
            : 'Power Consumption (Last 24h)';

    if (loading) {
        return (
            <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 h-[400px] flex items-center justify-center">
                <div className="animate-pulse bg-neutral-800 w-full h-full rounded-lg" />
            </div>
        );
    }

    return (
        <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-100 mb-6">{title}</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#737373' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: '1px solid #262626', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: '#a3a3a3' }}
                        />
                        <Area type="monotone" dataKey="power" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPower)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
