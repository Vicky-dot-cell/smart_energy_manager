'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
    { name: 'Electricity', value: 160, color: '#2dd4bf' }, // Teal-400
    { name: 'Gas', value: 54, color: '#facc15' },         // Yellow-400
];

export function CostPredictedChart() {
    const totalCost = data.reduce((a, b) => a + b.value, 0);

    return (
        <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 flex flex-col h-[320px]">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Cost Predicted</h3>

            <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4 lg:pb-0 z-10">
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold ">Total</span>
                    <span className="text-3xl font-bold text-white mt-1 pb-5">${totalCost}</span>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius="65%"
                            outerRadius="85%"
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={6}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: '1px solid #262626', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any) => [`$${value}`, 'Cost']}
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            iconSize={8}
                            height={36}
                            formatter={(value) => <span className="text-gray-400 ml-2 text-xs uppercase font-medium tracking-wider">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
