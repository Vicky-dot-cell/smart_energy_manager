'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot, ResponsiveContainer } from 'recharts';
import { useCustomerData } from '@/contexts/CustomerDataContext';

export function PeakUsageChart() {
    const { data: customerData } = useCustomerData();
    // The backend gives last 7 points of the ring buffer as peakUsageHours
    const data = customerData?.analytics?.peakUsageHours ?? [];

    // Find the maximum usage point to highlight it
    const maxPoint = data.reduce(
        (max: any, p: any) => (p.usage > (max?.usage ?? 0) ? p : max),
        null
    );

    return (
        // Fixed pixel height — prevents Recharts width(-1) inside flex layouts
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 16, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#374151"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#6b7280' }}
                    />
                    <YAxis
                        stroke="#374151"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#6b7280' }}
                        tickFormatter={(v) => `${v}W`}
                        width={48}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: 12 }}
                        itemStyle={{ color: '#fbbf24' }}
                        labelStyle={{ color: '#9ca3af', marginBottom: 4 }}
                        formatter={(v: any) => [`${Number(v).toFixed(1)} W`, 'Power']}
                        cursor={{ stroke: '#374151', strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="usage"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorUsage)"
                        isAnimationActive={false}
                        dot={false}
                        activeDot={{ r: 4, fill: '#f59e0b', stroke: '#78350f' }}
                    />
                    {/* Highlight the live peak point */}
                    {maxPoint && (
                        <ReferenceDot
                            x={maxPoint.time}
                            y={maxPoint.usage}
                            r={5}
                            fill="#f59e0b"
                            stroke="#fef3c7"
                            strokeWidth={2}
                            label={{ value: `${maxPoint.usage}W`, position: 'top', fill: '#fbbf24', fontSize: 11 }}
                        />
                    )}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
