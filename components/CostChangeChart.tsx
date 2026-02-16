'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
    { name: 'Jan', cost: 203 },
    { name: 'Feb', cost: 214 },
];

export function CostChangeChart() {
    const percentageChange = ((data[1].cost - data[0].cost) / data[0].cost) * 100;

    return (
        <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 flex flex-col h-[300px]">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Change in Cost</h3>
            <div className="flex flex-row items-center h-full">
                <div className="flex-1 h-full w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3' }} />
                            <YAxis hide />
                            <Bar dataKey="cost" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 1 ? '#2dd4bf' : '#4b5563'} />
                                ))}
                                <LabelList dataKey="cost" position="top" fill="#fff" formatter={(val: any) => `$${val}`} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="w-1/2 flex flex-col justify-center items-start pl-4">
                    <div className="flex items-center space-x-2 text-rose-500 mb-1">
                        <TrendingUp size={24} className="fill-current" />
                        <span className="text-3xl font-bold">{percentageChange.toFixed(2)}%</span>
                    </div>
                    <p className="text-gray-400 text-sm">INCREASE IN COST</p>
                </div>
            </div>
        </div>
    );
}
