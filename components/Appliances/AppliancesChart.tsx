'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type TimeContext = 'TODAY' | 'MONTH' | 'YEAR';
type SubView = 'TODAY' | 'YESTERDAY' | 'THIS_MONTH' | 'LAST_MONTH' | 'THIS_YEAR' | 'LAST_YEAR';

interface ApplianceData {
    name: string;
    electricity: number;
    predicted?: boolean;
}

// Mock Data Generators
const generateHourlyData = (base: number) =>
    Array.from({ length: 24 }, (_, i) => ({
        name: `${i} hrs`,
        electricity: Math.max(0.1, Math.random() * base),
        predicted: i > 20 // Simulate future hours
    }));

const generateDailyData = (days: number, base: number) =>
    Array.from({ length: days }, (_, i) => ({
        name: `Day ${i + 1}`,
        electricity: Math.max(1, Math.random() * base),
        predicted: i > days - 5
    }));

const generateMonthlyData = (base: number) =>
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => ({
        name: m,
        electricity: Math.max(50, Math.random() * base),
        predicted: i > 7
    }));

export function AppliancesChart({ context }: { context: TimeContext }) {
    // Determine available sub-views based on context
    const subOptions = useMemo(() => {
        switch (context) {
            case 'TODAY': return [{ label: 'TODAY', value: 'TODAY' }, { label: 'YESTERDAY', value: 'YESTERDAY' }];
            case 'MONTH': return [{ label: 'THIS MONTH', value: 'THIS_MONTH' }, { label: 'LAST MONTH', value: 'LAST_MONTH' }];
            case 'YEAR': return [{ label: 'THIS YEAR', value: 'THIS_YEAR' }, { label: 'LAST YEAR', value: 'LAST_YEAR' }];
        }
    }, [context]);

    const [subView, setSubView] = useState<SubView>(subOptions[0].value as SubView);
    const [selectedAppliance, setSelectedAppliance] = useState('All');

    // Reset subView when context changes
    useMemo(() => {
        setSubView(subOptions[0].value as SubView);
    }, [context, subOptions]);

    // Mock Data Selection Logic
    const data = useMemo(() => {
        let base = 1.0;
        if (selectedAppliance === 'AC') base = 2.5;
        if (selectedAppliance === 'Fridge') base = 0.8;

        switch (subView) {
            case 'TODAY': return generateHourlyData(base);
            case 'YESTERDAY': return generateHourlyData(base * 0.9); // Slightly different
            case 'THIS_MONTH': return generateDailyData(30, base * 10);
            case 'LAST_MONTH': return generateDailyData(30, base * 9);
            case 'THIS_YEAR': return generateMonthlyData(base * 200);
            case 'LAST_YEAR': return generateMonthlyData(base * 180);
            default: return [];
        }
    }, [subView, selectedAppliance]);

    const totalUsage = data.reduce((acc, curr) => acc + curr.electricity, 0).toFixed(1);

    return (
        <div className="w-full bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">

                {/* Sub View Tabs */}
                <div className="flex gap-6 border-b border-neutral-800 pb-1">
                    {subOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setSubView(opt.value as SubView)}
                            className={`text-sm font-medium uppercase tracking-wider pb-2 transition-colors relative ${subView === opt.value
                                ? 'text-gray-100 after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gray-100'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Usage By Dropdown */}
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm font-medium">Usage By:</span>
                    <select
                        value={selectedAppliance}
                        onChange={(e) => setSelectedAppliance(e.target.value)}
                        className="bg-neutral-800 text-gray-200 text-sm rounded-md px-3 py-1.5 border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="All">All</option>
                        <option value="AC">AC</option>
                        <option value="Fridge">Fridge</option>
                        <option value="Fan">Fan</option>
                        <option value="Microwave">Microwave</option>
                        <option value="Washing Machine">Washing Machine</option>
                    </select>
                </div>

                {/* Total Summary */}
                <div className="text-right">
                    <p className="text-3xl font-bold text-gray-100 mb-1">{totalUsage} <span className="text-xl font-medium text-gray-500">kWh</span></p>
                    <div className="flex flex-col text-xs text-gray-400 gap-1">
                        <div className="flex justify-between w-32 ml-auto">
                            <span>Electricity</span>
                            <span className="text-gray-200">{totalUsage} kWh</span>
                        </div>
                        {/* Gas removed as requested */}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                        barSize={context === 'TODAY' ? 20 : 12}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                        <XAxis
                            dataKey="name"
                            stroke="#525252"
                            tick={{ fill: '#737373', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                            interval={context === 'TODAY' ? 2 : 0} // Skip labels for hourly if too many
                        />
                        <YAxis
                            stroke="#525252"
                            tick={{ fill: '#737373', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `${value} kWh`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#2dd4bf' }}
                            formatter={(value: any) => [`${value.toFixed(2)} kWh`, 'Electricity']}
                            cursor={{ fill: '#262626', opacity: 0.4 }}
                        />
                        <Bar dataKey="electricity" fill="#2dd4bf" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.predicted ? '#115e59' : '#2dd4bf'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                {/* Predicted Label Overlay */}
                <div className="absolute bottom-16 right-8 bg-neutral-800/80 backdrop-blur px-3 py-2 rounded-lg border border-neutral-700 text-xs text-gray-400 pointer-events-none">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#115e59] rounded-sm"></div>
                        <span>Predicted</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
