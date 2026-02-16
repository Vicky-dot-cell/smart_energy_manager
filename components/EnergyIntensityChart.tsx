'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Value', value: 47 },
];
const maxValue = 100;

export function EnergyIntensityChart() {
    const value = data[0].value;
    // Calculate angles for the value slice: 180 degrees total.
    // 47/100 * 180 = 84.6 degrees.
    // Start at 180 (left), end at 180 - 84.6. No, Recharts works counter-clockwise usually or clockwise depending on sign.
    // Actually simplest way: simpler is to use Two Segments: Value, Max-Value.

    const gaugeData = [
        { name: 'Value', value: value },
        { name: 'Remaining', value: maxValue - value },
    ];

    return (
        <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 flex flex-col h-[320px]">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Energy Intensity</h3>

            <div className="flex-1 w-full min-h-0 relative flex flex-col items-center justify-end">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            <linearGradient id="intensityGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#2dd4bf" />   {/* Teal */}
                                <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
                            </linearGradient>
                        </defs>
                        {/* Background Track */}
                        <Pie
                            data={[{ value: 1 }]}
                            cx="50%"
                            cy="75%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="70%"
                            outerRadius="90%"
                            dataKey="value"
                            stroke="none"
                            fill="#262626"
                        />
                        {/* Value Track */}
                        <Pie
                            data={gaugeData}
                            cx="50%"
                            cy="75%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="70%"
                            outerRadius="90%"
                            dataKey="value"
                            stroke="none"
                            cornerRadius={10}
                            paddingAngle={0}
                        >
                            <Cell key="value" fill="url(#intensityGradient)" />
                            <Cell key="remaining" fill="transparent" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 pointer-events-none">
                    <span className="text-5xl font-bold text-white tracking-tighter">{value}</span>
                    <span className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-wide">kWh/Sqft</span>
                </div>
            </div>
        </div>
    );
}
