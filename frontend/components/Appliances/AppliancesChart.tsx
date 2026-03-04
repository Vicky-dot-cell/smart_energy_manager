'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api, type ApplianceBarItem } from '@/lib/api';
import { Info, Clock, PiggyBank, Zap } from 'lucide-react';
import Image from 'next/image';

type TimeContext = 'TODAY' | 'MONTH' | 'YEAR';

export function AppliancesChart({ context }: { context: TimeContext }) {
    const [data, setData] = useState<ApplianceBarItem[]>([]);
    const [timeSeries, setTimeSeries] = useState<{ labels: string[]; data: Record<string, number[]> } | null>(null);
    const [appliances, setAppliances] = useState<string[]>([]);
    const [subView, setSubView] = useState<'A' | 'B'>('A'); // A = current period, B = previous period
    const [selectedAppliance, setSelectedAppliance] = useState<string>('ALL');

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
            if ('timeSeries' in res) {
                setTimeSeries((res as any).timeSeries);
            }
        }).catch(console.error);
    }, [context]);

    const chartData = selectedAppliance === 'ALL' || !timeSeries
        ? data
        : timeSeries.labels.map((label, i) => ({
            name: label,
            electricity: timeSeries.data[selectedAppliance]?.[i] ?? 0
        }));

    const totalUsage = chartData.reduce((acc, cur) => acc + cur.electricity, 0).toFixed(1);

    const getApplianceDetails = (applianceName: string) => {
        const details: Record<string, { img: string, desc: string, time: string, tip: string, savings: string }> = {
            'Air Conditioner': {
                img: '/images/appliances/ac.png',
                desc: 'Inverter Smart AC (1.5 Ton)',
                time: 'Best used: 10 PM - 6 AM',
                tip: 'Set temperature to 24°C for optimal balance of comfort and efficiency.',
                savings: 'Est. savings: ~$15/mo'
            },
            'Water Heater': {
                img: '/images/appliances/heater.png',
                desc: 'Smart Boiler (25L)',
                time: 'Best used: 6 AM - 8 AM',
                tip: 'Turn off when not in use. Lower thermostat to 120°F (49°C).',
                savings: 'Est. savings: ~$8/mo'
            },
            'Refrigerator': {
                img: '/images/appliances/refrigerator.png',
                desc: 'Frost-Free Double Door',
                time: 'Continuous operation',
                tip: 'Keep coils clean and avoid opening the door frequently.',
                savings: 'Est. savings: ~$5/mo'
            },
            'Washing Machine': {
                img: '/images/appliances/washer.png',
                desc: 'Front Load AI Washer',
                time: 'Best used: Weekends off-peak',
                tip: 'Wash full loads in cold water to save up to 90% of energy used.',
                savings: 'Est. savings: ~$10/mo'
            },
            'Lighting': {
                img: '/images/appliances/lighting.png',
                desc: 'Smart LED Bulbs',
                time: '6 PM - 11 PM',
                tip: 'Use motion sensors or schedules to ensure lights are off in empty rooms.',
                savings: 'Est. savings: ~$12/mo'
            }
        };

        const defaultDetails = {
            img: '/images/appliances/ac.png',
            desc: 'Smart Home Appliance',
            time: 'Usage varies',
            tip: 'Optimize usage during off-peak hours.',
            savings: 'Est. savings: varies'
        };

        return details[applianceName] || defaultDetails;
    };

    const details = selectedAppliance !== 'ALL' ? getApplianceDetails(selectedAppliance) : null;

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
                    <select
                        value={selectedAppliance}
                        onChange={e => setSelectedAppliance(e.target.value)}
                        className="bg-neutral-800 text-gray-200 text-sm rounded-md px-3 py-1.5 border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="ALL">All Appliances</option>
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
                    <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barSize={context === 'TODAY' ? 20 : 12}>
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
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={(entry as any).predicted ? '#115e59' : '#2dd4bf'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Detailed Info Card */}
            {selectedAppliance !== 'ALL' && details && (
                <div className="mt-8 p-6 bg-neutral-950/50 rounded-xl border border-neutral-800 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-32 h-32 relative flex-shrink-0 bg-neutral-900 rounded-2xl flex items-center justify-center p-4 border border-cyan-900/30 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                        <Image src={details.img} alt={selectedAppliance} fill className="object-cover" />
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                        <div>
                            <h4 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                                {selectedAppliance}
                                <span className="bg-cyan-500/10 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-medium border border-cyan-500/20">Smart AI Enabled</span>
                            </h4>
                            <p className="text-gray-400 text-sm mt-1">{details.desc}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/50 flex items-start gap-3">
                                <Clock className="text-blue-400 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Recommended Time</p>
                                    <p className="text-sm text-gray-200 mt-0.5">{details.time}</p>
                                </div>
                            </div>
                            <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/50 flex items-start gap-3">
                                <Zap className="text-emerald-400 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Usage Tip</p>
                                    <p className="text-sm text-gray-200 mt-0.5 leading-snug">{details.tip}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-48 w-full bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-5 rounded-xl border border-indigo-500/20 flex flex-col items-center justify-center text-center flex-shrink-0 gap-2">
                        <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-300 mb-1">
                            <PiggyBank size={20} />
                        </div>
                        <p className="text-sm font-medium text-indigo-300">Potential Savings</p>
                        <p className="text-lg font-bold text-indigo-100">{details.savings.split(': ')[1]}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
