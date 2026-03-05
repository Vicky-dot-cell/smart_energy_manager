'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { useSettings } from '@/contexts/SettingsContext';
import { useCustomerData } from '@/contexts/CustomerDataContext';
import { ChartModal } from './ChartModal';

// Custom active shape: glows the hovered slice
const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius - 2}
                outerRadius={outerRadius + 6}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                opacity={0.95}
                cornerRadius={6}
            />
        </g>
    );
};

export function CostPredictedChart() {
    const { formatCurrency } = useSettings();
    const { data: customerData } = useCustomerData();
    const data: any[] = customerData?.dashboard?.costPredicted ?? [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

    const totalCost = data.reduce((a: number, b: any) => a + b.value, 0);

    // Enrich data with percentage
    const enriched = data.map((d: any) => ({
        ...d,
        pct: totalCost > 0 ? Math.round((d.value / totalCost) * 100) : 0,
    }));

    const customLegend = ({ payload }: any) => (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
            {payload?.map((entry: any, i: number) => {
                const item = enriched[i];
                return (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                        <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-400 font-medium uppercase tracking-wide">
                            {entry.value}
                        </span>
                        <span className="text-gray-500">{item?.pct ?? 0}%</span>
                    </div>
                );
            })}
        </div>
    );

    const sharedPie = (modal = false) => (
        <PieChart>
            <Pie
                data={enriched}
                cx="50%"
                cy="50%"
                innerRadius={modal ? '55%' : '65%'}
                outerRadius={modal ? '78%' : '88%'}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={6}
                isAnimationActive={true}
                animationDuration={500}
                {...({ activeIndex } as any)}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
            >
                {enriched.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
            </Pie>
            <Tooltip
                contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: modal ? 13 : 12,
                    padding: '8px 12px',
                }}
                itemStyle={{ color: '#d1d5db' }}
                formatter={(value: any, _name: any, props: any) => {
                    const item = enriched[props?.dataIndex ?? 0];
                    return [
                        <span key="val" className="font-semibold text-white">
                            {formatCurrency(value)}
                        </span>,
                        <span key="pct" style={{ color: props?.payload?.color }}>
                            {item?.name ?? ''} &nbsp;·&nbsp; {item?.pct ?? 0}%
                        </span>,
                    ];
                }}
            />
            <Legend content={customLegend} />
        </PieChart>
    );

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 flex flex-col h-[320px] cursor-pointer hover:border-neutral-700 hover:shadow-md transition-all group"
            >
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2 group-hover:text-gray-300 transition-colors">
                    Cost Predicted
                </h3>

                <div className="flex-1 w-full min-h-[200px] relative flex items-center justify-center">
                    {/* Donut center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6 z-10">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Total</span>
                        <span className="text-2xl font-bold text-white mt-0.5 tabular-nums">
                            {formatCurrency(totalCost)}
                        </span>
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                        {sharedPie(false)}
                    </ResponsiveContainer>
                </div>
            </div>

            <ChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cost Predicted — Breakdown">
                <div className="w-full h-full relative flex items-center justify-center">
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-10 z-10">
                        <span className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Total</span>
                        <span className="text-5xl font-bold text-white mt-2 tabular-nums">
                            {formatCurrency(totalCost)}
                        </span>
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                        {sharedPie(true)}
                    </ResponsiveContainer>
                </div>
            </ChartModal>
        </>
    );
}
