'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api, type ApplianceBarItem } from '@/lib/api';

type TimeContext = 'TODAY' | 'MONTH' | 'YEAR';

export function AppliancesChart({ context }: { context: TimeContext }) {
    const [data, setData] = useState<ApplianceBarItem[]>([]);
    const [appliances, setAppliances] = useState<string[]>([]);
    const [subView, setSubView] = useState<'A' | 'B'>('A'); // A = current period, B = previous period

    // Derive sub-options from context
    const subOptions = context === 'TODAY'
        ? [{ label: 'TODAY', value: 'A' }, { label: 'YESTERDAY', value: 'B' }]
        : context === 'MONTH'
            ? [{ label: 'THIS MONTH', value: 'A' }, { label: 'LAST MONTH', value: 'B' }]
            : [{ label: 'THIS YEAR', value: 'A' }, { label: 'LAST YEAR', value: 'B' }];

    useEffect(() => {
        // Reset to first sub-view when context changes
        setSubView('A');
    }, [context]);

    useEffect(() => {
        api.appliances(context).then(res => {
            setAppliances(res.list);
            setData(res.data);
        }).catch(console.error);
    }, [context]);

    const totalUsage = data.reduce((acc, cur) => acc + cur.electricity, 0).toFixed(1);

    return (
        <div className="w-full bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                {/* Sub-view tabs */}
                <div className="flex gap-6 border-b border-neutral-800 pb-1">
                    {subOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setSubView(opt.value as 'A' | 'B')}
                            className={`text-sm font-medium uppercase tracking-wider pb-2 transition-colors relative ${subView === opt.value
                                ? 'text-gray-100 after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gray-100'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Usage By dropdown */}
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm font-medium">Usage By:</span>
                    <select className="bg-neutral-800 text-gray-200 text-sm rounded-md px-3 py-1.5 border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                        {appliances.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>

                {/* Total */}
                <div className="text-right">
                    <p className="text-3xl font-bold text-gray-100 mb-1">
                        {totalUsage} <span className="text-xl font-medium text-gray-500">kWh</span>
                    </p>
                    <div className="flex flex-col text-xs text-gray-400 gap-1">
                        <div className="flex justify-between w-32 ml-auto">
                            <span>Electricity</span>
                            <span className="text-gray-200">{totalUsage} kWh</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barSize={context === 'TODAY' ? 20 : 12}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                        <XAxis dataKey="name" stroke="#525252" tick={{ fill: '#737373', fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#525252" tick={{ fill: '#737373', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} kWh`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#2dd4bf' }}
                            formatter={(value: any) => [`${Number(value).toFixed(2)} kWh`, 'Electricity']}
                            cursor={{ fill: '#262626', opacity: 0.4 }}
                        />
                        <Bar dataKey="electricity" fill="#2dd4bf" radius={[4, 4, 0, 0]}>
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
