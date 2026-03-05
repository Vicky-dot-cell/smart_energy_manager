'use client';

import { useCustomerData } from '@/contexts/CustomerDataContext';
import { type Range } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EnergyChartProps {
    range?: Range;
}

export function EnergyChart({ range = 'TODAY' }: EnergyChartProps) {
    const { data: customerData, loading } = useCustomerData();

    const rawChart = customerData?.dashboard?.energyChart;
    const data = rawChart
        ? (rawChart[range]?.data ?? rawChart['TODAY']?.data ?? [])
        : [];

    const title = range === 'YEAR'
        ? 'Power Consumption (This Year)'
        : range === 'MONTH'
            ? 'Power Consumption (This Month)'
            : 'Power Consumption (Last 24h)';

    if (loading && data.length === 0) {
        return (
            <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 h-[400px] flex items-center justify-center">
                <div className="animate-pulse bg-neutral-800 w-full h-full rounded-lg" />
            </div>
        );
    }

    return (
        <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">{title}</h3>
            {/* Use a fixed height div — never 100% inside flex, that causes -1 in Recharts */}
            <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#737373', fontSize: 11 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#737373', fontSize: 11 }}
                            tickFormatter={(v) => `${v}W`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: '1px solid #262626', color: '#fff' }}
                            itemStyle={{ color: '#60a5fa' }}
                            labelStyle={{ color: '#a3a3a3' }}
                            formatter={(v: number | undefined) => [`${(v ?? 0).toFixed(1)} W`, 'Power']}
                        />
                        <Area
                            type="monotone"
                            dataKey="power"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPower)"
                            isAnimationActive={false}
                            dot={false}
                            activeDot={{ r: 4, fill: '#3b82f6', stroke: '#1e3a5f' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
