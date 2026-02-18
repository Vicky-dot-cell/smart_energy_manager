'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CostData {
    name: string;
    cost: number;
    predicted?: boolean;
}

const dataToday: CostData[] = [
    { name: '12 AM', cost: 0.12 }, { name: '4 AM', cost: 0.08 },
    { name: '8 AM', cost: 0.45 }, { name: '12 PM', cost: 0.60 },
    { name: '4 PM', cost: 0.55 }, { name: '8 PM', cost: 0.75 },
    { name: '11 PM', cost: 0.30 },
];

const dataMonth: CostData[] = [
    { name: 'Feb 1', cost: 4.50 }, { name: 'Feb 2', cost: 3.80 },
    { name: 'Feb 3', cost: 4.20 }, { name: 'Feb 4', cost: 3.90 },
    { name: 'Feb 5', cost: 4.60 }, { name: 'Feb 6', cost: 4.10 },
    { name: 'Feb 7', cost: 3.70 }, { name: 'Feb 8', cost: 4.80 },
    { name: 'Feb 9', cost: 4.30 }, { name: 'Feb 10', cost: 3.50 },
    { name: 'Feb 11', cost: 4.10 }, { name: 'Feb 12', cost: 3.90 },
    { name: 'Feb 13', cost: 4.00 }, { name: 'Feb 14', cost: 4.40 },
    { name: 'Feb 15', cost: 3.60 }, { name: 'Feb 16', cost: 3.20 },
    { name: 'Feb 17', cost: 4.10 }, { name: 'Feb 18', cost: 3.80 }, // Current day roughly
    { name: 'Feb 19', cost: 4.20, predicted: true },
    { name: 'Feb 20', cost: 3.90, predicted: true },
    { name: 'Feb 21', cost: 4.10, predicted: true },
    { name: 'Feb 22', cost: 4.30, predicted: true },
];

const dataYear: CostData[] = [
    { name: 'Jan', cost: 120 }, { name: 'Feb', cost: 115 },
    { name: 'Mar', cost: 130 }, { name: 'Apr', cost: 110 },
    { name: 'May', cost: 140 }, { name: 'Jun', cost: 150 },
    { name: 'Jul', cost: 180 }, { name: 'Aug', cost: 170 },
    { name: 'Sep', cost: 130 }, { name: 'Oct', cost: 120 },
    { name: 'Nov', cost: 125 }, { name: 'Dec', cost: 140 },
];

export function CostChart({ range }: { range: 'TODAY' | 'MONTH' | 'YEAR' }) {

    const getData = () => {
        switch (range) {
            case 'TODAY': return dataToday;
            case 'MONTH': return dataMonth;
            case 'YEAR': return dataYear;
            default: return dataMonth;
        }
    };

    const currentData = getData();

    return (
        <div className="w-full">
            <div className="h-[400px] w-full bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={currentData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        barSize={range === 'MONTH' ? 12 : 24}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                        <XAxis
                            dataKey="name"
                            stroke="#525252"
                            tick={{ fill: '#737373', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#525252"
                            tick={{ fill: '#737373', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#2dd4bf' }}
                            formatter={(value: any) => [`$${value}`, 'Cost']}
                            cursor={{ fill: '#262626', opacity: 0.4 }}
                        />
                        <Bar dataKey="cost" fill="#2dd4bf" radius={[4, 4, 0, 0]}>
                            {currentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.predicted ? '#115e59' : '#2dd4bf'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
