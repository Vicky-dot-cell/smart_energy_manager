'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dataToday = [
    { time: '00:00', power: 450 },
    { time: '04:00', power: 300 },
    { time: '08:00', power: 1200 },
    { time: '12:00', power: 1800 },
    { time: '16:00', power: 1600 },
    { time: '20:00', power: 2100 },
    { time: '23:59', power: 900 },
];

const dataMonth = [
    { time: 'Week 1', power: 3200 },
    { time: 'Week 2', power: 2800 },
    { time: 'Week 3', power: 4500 },
    { time: 'Week 4', power: 3900 },
];

const dataYear = [
    { time: 'Jan', power: 14000 },
    { time: 'Feb', power: 12500 },
    { time: 'Mar', power: 13000 },
    { time: 'Apr', power: 15000 },
    { time: 'May', power: 18000 },
    { time: 'Jun', power: 22000 },
    { time: 'Jul', power: 25000 },
    { time: 'Aug', power: 24000 },
    { time: 'Sep', power: 20000 },
    { time: 'Oct', power: 16000 },
    { time: 'Nov', power: 14500 },
    { time: 'Dec', power: 15500 },
];

interface EnergyChartProps {
    range?: 'TODAY' | 'MONTH' | 'YEAR';
}

export function EnergyChart({ range = 'TODAY' }: EnergyChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 h-[400px] flex items-center justify-center">
                <div className="animate-pulse bg-neutral-800 w-full h-full rounded-lg" />
            </div>
        );
    }

    const chartData = range === 'YEAR' ? dataYear : range === 'MONTH' ? dataMonth : dataToday;
    const title = range === 'YEAR' ? 'Power Consumption (This Year)' : range === 'MONTH' ? 'Power Consumption (This Month)' : 'Power Consumption (Last 24h)';

    return (
        <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-100 mb-6">{title}</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
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
