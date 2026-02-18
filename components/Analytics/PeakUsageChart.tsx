'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { time: '00:00', usage: 0.5 }, { time: '02:00', usage: 0.4 },
    { time: '04:00', usage: 0.3 }, { time: '06:00', usage: 1.2 },
    { time: '08:00', usage: 2.5 }, { time: '10:00', usage: 1.8 },
    { time: '12:00', usage: 1.5 }, { time: '14:00', usage: 2.1 },
    { time: '16:00', usage: 1.9 }, { time: '18:00', usage: 3.5 }, // Peak
    { time: '20:00', usage: 3.2 }, { time: '22:00', usage: 2.0 },
];

export function PeakUsageChart() {
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
                    <XAxis
                        dataKey="time"
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value} kW`}
                    />
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
