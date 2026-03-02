'use client';

import { useEffect, useState } from 'react';
import { api, type RoomsPayload } from '@/lib/api';

type TimeContext = 'TODAY' | 'MONTH' | 'YEAR';

export function RoomsHeatmap({ context }: { context: TimeContext }) {
    const [payload, setPayload] = useState<RoomsPayload | null>(null);

    useEffect(() => {
        api.rooms(context).then(setPayload).catch(console.error);
    }, [context]);

    const labels = payload?.labels ?? [];
    const rooms = payload?.rooms ?? [];
    const data = payload?.data ?? {};

    const getColorClass = (value: number) => {
        if (value > 4) return 'bg-teal-100';
        if (value > 3) return 'bg-teal-300';
        if (value > 2) return 'bg-teal-500';
        if (value > 1) return 'bg-teal-700';
        return 'bg-teal-900/50';
    };

    return (
        <div className="w-full bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 overflow-x-auto">
            {/* Legend */}
            <div className="flex items-center justify-end gap-4 mb-6 text-xs text-gray-400">
                {[
                    { cls: 'bg-teal-900/50', label: '0 - 1kWh' },
                    { cls: 'bg-teal-700', label: '1 - 2kWh' },
                    { cls: 'bg-teal-500', label: '2 - 3kWh' },
                    { cls: 'bg-teal-300', label: '3 - 4kWh' },
                    { cls: 'bg-teal-100', label: '> 4kWh' },
                ].map(({ cls, label }) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${cls} rounded-sm`} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>

            <div className="min-w-[800px]">
                {/* Header row */}
                <div className="flex mb-2">
                    <div className="w-32 shrink-0" />
                    <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
                        {labels.map((lbl, i) => (
                            <div key={i} className="text-center text-[10px] text-gray-500 uppercase tracking-wider truncate px-1">
                                {lbl}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data rows */}
                <div className="space-y-1">
                    {rooms.map(room => (
                        <div key={room} className="flex items-center">
                            <div className="w-32 shrink-0 text-right pr-4 text-xs font-medium text-gray-400">{room}</div>
                            <div className="flex-1 grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
                                {(data[room] ?? []).map((value, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-8 w-full transition-colors relative group ${getColorClass(value)}`}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-neutral-950 border border-neutral-800 rounded shadow-lg z-50 pointer-events-none w-max">
                                            <div className="text-xs font-semibold text-gray-200">{room}</div>
                                            <div className="text-[10px] text-gray-400">{value.toFixed(2)} kWh</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
