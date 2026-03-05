'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useCustomerData } from '@/contexts/CustomerDataContext';
import { ChartModal } from './ChartModal';

function getStatus(pct: number): { label: string; color: string; bg: string } {
    if (pct < 0.4) return { label: 'LOW', color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
    if (pct < 0.75) return { label: 'MODERATE', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
    return { label: 'HIGH', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
}

interface GaugePieProps {
    gaugeData: { name: string; value: number }[];
    gradId: string;
    fillColor: string;
    modal?: boolean;
}

function GaugePie({ gaugeData, gradId, fillColor, modal = false }: GaugePieProps) {
    const r_inner = modal ? '65%' : '68%';
    const r_outer = modal ? '85%' : '88%';
    return (
        <PieChart>
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
                    {/* Subtle lighter start then the status color */}
                    <stop offset="0%" stopColor={fillColor} stopOpacity={0.7} />
                    <stop offset="100%" stopColor={fillColor} stopOpacity={1} />
                </linearGradient>
            </defs>
            {/* Background track */}
            <Pie
                data={[{ value: 1 }]}
                cx="50%"
                cy="75%"
                startAngle={180}
                endAngle={0}
                innerRadius={r_inner}
                outerRadius={r_outer}
                dataKey="value"
                stroke="none"
                fill="#1f2937"
                isAnimationActive={false}
            />
            {/* Value track */}
            <Pie
                data={gaugeData}
                cx="50%"
                cy="75%"
                startAngle={180}
                endAngle={0}
                innerRadius={r_inner}
                outerRadius={r_outer}
                dataKey="value"
                stroke="none"
                cornerRadius={8}
                paddingAngle={0}
                isAnimationActive={true}
                animationDuration={600}
            >
                <Cell fill={`url(#${gradId})`} />
                <Cell fill="transparent" />
            </Pie>
        </PieChart>
    );
}

export function EnergyIntensityChart() {
    const { data: customerData } = useCustomerData();
    const info = customerData?.dashboard?.energyIntensity ?? null;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const value = info?.value ?? 0;
    const maxValue = info?.max ?? 100;
    const pct = maxValue > 0 ? value / maxValue : 0;
    const status = getStatus(pct);

    const gaugeData = [
        { name: 'Value', value },
        { name: 'Remaining', value: Math.max(0, maxValue - value) },
    ];

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 flex flex-col h-[320px] cursor-pointer hover:border-neutral-700 hover:shadow-md transition-all group"
            >
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2 group-hover:text-gray-300 transition-colors">
                    Energy Intensity
                </h3>

                <div className="flex-1 w-full min-h-0 relative flex flex-col items-center justify-end">
                    <ResponsiveContainer width="100%" height="100%">
                        <GaugePie gaugeData={gaugeData} gradId="intensityGrad" fillColor={status.color} />
                    </ResponsiveContainer>

                    {/* Centre overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 pointer-events-none">
                        <span
                            className="text-3xl font-bold tracking-tighter tabular-nums"
                            style={{ color: status.color }}
                        >
                            {value}
                        </span>
                        <span className="text-gray-500 text-xs font-medium mt-0.5 uppercase tracking-wide">
                            {info?.unit ?? 'kWh/Sqft'}
                        </span>

                        {/* Status pill */}
                        <span
                            className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                            style={{ color: status.color, backgroundColor: status.bg }}
                        >
                            {status.label}
                        </span>
                    </div>

                    {/* Min / Max labels */}
                    <div className="w-[88%] flex justify-between text-[10px] text-gray-600 font-medium tracking-wide mb-1">
                        <span>0</span>
                        <span>{maxValue}</span>
                    </div>
                </div>
            </div>

            <ChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Energy Intensity">
                <div className="w-full h-full relative flex flex-col items-center justify-end pb-8">
                    <ResponsiveContainer width="100%" height="90%">
                        <GaugePie gaugeData={gaugeData} gradId="intensityGradModal" fillColor={status.color} modal />
                    </ResponsiveContainer>

                    {/* Centre overlay for modal */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none">
                        <span
                            className="text-6xl font-bold tracking-tighter tabular-nums"
                            style={{ color: status.color }}
                        >
                            {value}
                        </span>
                        <span className="text-gray-400 text-base font-medium mt-2 uppercase tracking-wide">
                            {info?.unit ?? 'kWh/Sqft'}
                        </span>
                        <span
                            className="mt-3 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                            style={{ color: status.color, backgroundColor: status.bg }}
                        >
                            {status.label}
                        </span>
                    </div>

                    {/* Min / Max labels */}
                    <div className="w-[80%] flex justify-between text-sm text-gray-500 font-medium tracking-wide">
                        <span>0</span>
                        <span>Max: {maxValue}</span>
                    </div>
                </div>
            </ChartModal>
        </>
    );
}
