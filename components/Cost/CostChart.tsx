'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api, type CostBarItem, type Range } from '@/lib/api';

export function CostChart({ range }: { range: Range }) {
    const [data, setData] = useState<CostBarItem[]>([]);

    useEffect(() => {
        api.cost(range).then(res => setData(res.chart.data)).catch(console.error);
    }, [range]);

    return (
        <div className="w-full">
            <div className="h-[400px] w-full bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barSize={range === 'MONTH' ? 12 : 24}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                        <XAxis dataKey="name" stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#2dd4bf' }}
                            formatter={(value: any) => [`$${value}`, 'Cost']}
                            cursor={{ fill: '#262626', opacity: 0.4 }}
                        />
                        <Bar dataKey="cost" fill="#2dd4bf" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.predicted ? '#115e59' : '#2dd4bf'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
