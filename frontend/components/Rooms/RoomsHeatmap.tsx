'use client';

import { useEffect, useState } from 'react';
import { api, type RoomsPayload } from '@/lib/api';

type TimeContext = 'TODAY' | 'MONTH' | 'YEAR';

// ── Colour config per context ──────────────────────────────────────────────────
// Each context has different kWh value ranges, so thresholds and colours
// are tuned separately to ensure the full palette is always used.
const COLOUR_CONFIG: Record<
    TimeContext,
    { unit: string; stops: { above: number; bg: string }[] }
> = {
    TODAY: {
        unit: 'kWh/hr',
        stops: [
            { above: 0.06, bg: 'bg-emerald-100' },
            { above: 0.045, bg: 'bg-emerald-300' },
            { above: 0.030, bg: 'bg-emerald-500' },
            { above: 0.015, bg: 'bg-emerald-700' },
            { above: 0, bg: 'bg-emerald-950' },
        ],
    },
    MONTH: {
        unit: 'kWh/day',
        stops: [
            { above: 3.5, bg: 'bg-emerald-100' },
            { above: 2.5, bg: 'bg-emerald-300' },
            { above: 1.5, bg: 'bg-emerald-500' },
            { above: 0.8, bg: 'bg-emerald-700' },
            { above: 0, bg: 'bg-emerald-950' },
        ],
    },
    YEAR: {
        unit: 'kWh/mo',
        stops: [
            { above: 80, bg: 'bg-emerald-100' },
            { above: 55, bg: 'bg-emerald-300' },
            { above: 35, bg: 'bg-emerald-500' },
            { above: 18, bg: 'bg-emerald-700' },
            { above: 0, bg: 'bg-emerald-950' },
        ],
    },
};

const LEGEND_LABELS: Record<TimeContext, string[]> = {
    TODAY: ['< 0.015', '0.015–0.030', '0.030–0.045', '0.045–0.060', '> 0.060'],
    MONTH: ['< 0.8', '0.8–1.5', '1.5–2.5', '2.5–3.5', '> 3.5'],
    YEAR: ['< 18', '18–35', '35–55', '55–80', '> 80'],
};

export function RoomsHeatmap({ context }: { context: TimeContext }) {
    const [payload, setPayload] = useState<RoomsPayload | null>(null);

    useEffect(() => {
        api.rooms(context).then(setPayload).catch(console.error);
    }, [context]);

    const labels = payload?.labels ?? [];
    const rooms = payload?.rooms ?? [];
    const data = payload?.data ?? {};

    const cfg = COLOUR_CONFIG[context];

    const getCellClass = (value: number): string => {
        for (const stop of cfg.stops) {
            if (value > stop.above) return stop.bg;
        }
        return cfg.stops[cfg.stops.length - 1].bg;
    };

    // From lowest → highest intensity
    const legendStops = [...cfg.stops].reverse();
    const legendLabels = LEGEND_LABELS[context];

    return (
        <div className="w-full bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 overflow-x-auto">
            {/* Legend */}
            <div className="flex items-center justify-end gap-4 mb-6 text-xs text-gray-400 flex-wrap">
                <span className="text-gray-500 mr-1">{cfg.unit}:</span>
                {legendStops.map((stop, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${stop.bg} rounded-sm`} />
                        <span>{legendLabels[i]}</span>
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
                                        className={`h-8 w-full transition-colors relative group ${getCellClass(value)}`}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-neutral-950 border border-neutral-800 rounded shadow-lg z-50 pointer-events-none w-max">
                                            <div className="text-xs font-semibold text-gray-200">{room}</div>
                                            <div className="text-[10px] text-gray-400">{value.toFixed(3)} {cfg.unit}</div>
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
