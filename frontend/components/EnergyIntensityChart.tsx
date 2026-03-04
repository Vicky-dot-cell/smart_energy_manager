'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { api, type EnergyIntensity } from '@/lib/api';
import { ChartModal } from './ChartModal';

export function EnergyIntensityChart() {
    const [info, setInfo] = useState<EnergyIntensity | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        api.energyIntensity().then(setInfo).catch(console.error);
    }, []);

    const value = info?.value ?? 0;
    const maxValue = info?.max ?? 100;
    const gaugeData = [
        { name: 'Value', value },
        { name: 'Remaining', value: maxValue - value },
    ];

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 flex flex-col h-[320px] cursor-pointer hover:border-neutral-700 hover:shadow-md transition-all group"
            >
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 group-hover:text-gray-300 transition-colors">Energy Intensity</h3>

                <div className="flex-1 w-full min-h-0 relative flex flex-col items-center justify-end">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <linearGradient id="intensityGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#2dd4bf" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                            {/* Background track */}
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
                            {/* Value track */}
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

                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 pointer-events-none">
                        <span className="text-3xl font-bold text-white tracking-tighter">{value}</span>
                        <span className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-wide">
                            {info?.unit ?? 'kWh/Sqft'}
                        </span>
                    </div>
                </div>
            </div>

            <ChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Energy Intensity mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            <linearGradient id="intensityGradientModal" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#2dd4bf" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                        <Pie data={[{ value: 1 }]} cx="50%" cy="75%" startAngle={180} endAngle={0} innerRadius="70%" outerRadius="90%" dataKey="value" stroke="none" fill="#262626" />
                        <Pie data={gaugeData} cx="50%" cy="75%" startAngle={180} endAngle={0} innerRadius="70%" outerRadius="90%" dataKey="value" stroke="none" cornerRadius={10} paddingAngle={0}>
                            <Cell key="value" fill="url(#intensityGradientModal)" />
                            <Cell key="remaining" fill="transparent" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 pointer-events-none">
                    <span className="text-6xl font-bold text-white tracking-tighter">{value}</span>
                    <span className="text-gray-400 text-base font-medium mt-2 uppercase tracking-wide">
                        {info?.unit ?? 'kWh/Sqft'}
                    </span>
                </div>
            </ChartModal>
        </>
    );
}
