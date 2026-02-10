'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { time: '00:00', power: 450 },
    { time: '04:00', power: 300 },
    { time: '08:00', power: 1200 },
    { time: '12:00', power: 1800 },
    { time: '16:00', power: 1600 },
    { time: '20:00', power: 2100 },
    { time: '23:59', power: 900 },
];

export function EnergyChart() {
    return (
        <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 h-[400px]">
            <h3 className="text-lg font-semibold text-gray-100 mb-6">Power Consumption (Last 24h)</h3>
            <ResponsiveContainer width="100%" height="90%">
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
    );
}
