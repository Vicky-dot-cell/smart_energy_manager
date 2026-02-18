'use client';

import { useState, useMemo } from 'react';

type TimeContext = 'TODAY' | 'MONTH' | 'YEAR';

interface HeatmapDataPoint {
    id: string;
    value: number; // kWh
    predicted?: boolean;
}

const ROOMS = ['Master Bedroom', 'Bedroom 1', 'Drawing Room', 'Living Room', 'Kitchen', 'Garage', 'Others'];

// Mock Data Generators
const generateData = (context: TimeContext): { labels: string[], data: Record<string, HeatmapDataPoint[]> } => {
    let labels: string[] = [];
    let count = 0;

    if (context === 'TODAY') {
        labels = Array.from({ length: 24 }, (_, i) => `${i}h`);
        count = 24;
    } else if (context === 'MONTH') {
        labels = Array.from({ length: 30 }, (_, i) => `Feb ${i + 1}`);
        count = 30;
    } else {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        count = 12;
    }

    const data: Record<string, HeatmapDataPoint[]> = {};

    ROOMS.forEach(room => {
        data[room] = Array.from({ length: count }, (_, i) => ({
            id: `${room}-${i}`,
            value: Math.random() * 5, // 0 to 5 kWh
            predicted: (context === 'MONTH' && i > 25) || (context === 'TODAY' && i > 20) || (context === 'YEAR' && i > 8)
        }));
    });

    return { labels, data };
};

export function RoomsHeatmap({ context }: { context: TimeContext }) {
    const { labels, data } = useMemo(() => generateData(context), [context]);

    const getColorClass = (value: number, predicted: boolean) => {
        // Base Intensity
        let intensity = 100;
        if (value > 4) intensity = 900;      // > 4 kWh
        else if (value > 3) intensity = 700; // 3-4 kWh
        else if (value > 2) intensity = 500; // 2-3 kWh
        else if (value > 1) intensity = 300; // 1-2 kWh
        else intensity = 100;                // 0-1 kWh

        // Tailwind classes mapping
        // Using Teal scale as requested/consistent with other charts
        // The image shows a gradient from dark blue to lighter teal/white
        // Let's approximate the image's "Teal" look.
        // Image Legend: 0-1 (Lightest), >4 (Darkest/White?) - actually image shows darkest is >4kWh but it looks like LIGHTER color implies HIGHER usage in heatmaps often, OR darker.
        // Let's look at the image legend again if possible. 
        // Legend in image: 
        // 0-1kWh: Teal-900 (Darkest)
        // 1-2kWh: Teal-700
        // 2-3kWh: Teal-500
        // 3-4kWh: Teal-300
        // >4kWh:  Teal-100 (Lightest/Brightest)

        // Wait, normally heatmaps are Dark=Low, Light=High in dark mode? Or the reverse?
        // Let's stick to the specific colors mentioned in my plan based on standard "glowing" effect in dark mode.
        // Higher energy = Brighter (Lighter color).

        if (predicted) {
            // Predicted data usually distinguished, maybe slightly desaturated or opacity?
            // Image shows "Predicted" as valid blocks.
            // Let's stick to the color scale but maybe add a pattern or distinct look if needed.
            // For now, standard color scale.
        }

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
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-900/50 rounded-sm"></div>
                    <span>0 - 1kWh</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-700 rounded-sm"></div>
                    <span>1 - 2kWh</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-500 rounded-sm"></div>
                    <span>2 - 3kWh</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-300 rounded-sm"></div>
                    <span>3 - 4kWh</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-100 rounded-sm"></div>
                    <span>{'>'} 4kWh</span>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="min-w-[800px]">
                {/* Header Row */}
                <div className="flex mb-2">
                    <div className="w-32 shrink-0"></div> {/* Spacer for Row Labels */}
                    <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
                        {labels.map((label, i) => (
                            <div key={i} className="text-center text-[10px] text-gray-500 uppercase tracking-wider truncate px-1">
                                {label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Rows */}
                <div className="space-y-1">
                    {ROOMS.map((room) => (
                        <div key={room} className="flex items-center">
                            {/* Row Label */}
                            <div className="w-32 shrink-0 text-right pr-4 text-xs font-medium text-gray-400">
                                {room}
                            </div>

                            {/* Row Cells */}
                            <div className="flex-1 grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
                                {data[room].map((point) => (
                                    <div
                                        key={point.id}
                                        className={`h-8 w-full transition-colors relative group ${getColorClass(point.value, point.predicted || false)}`}
                                    >
                                        {/* Tooltip */}
                                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-neutral-950 border border-neutral-800 rounded shadow-lg z-50 pointer-events-none w-max">
                                            <div className="text-xs font-semibold text-gray-200">{room}</div>
                                            <div className="text-[10px] text-gray-400">
                                                {point.value.toFixed(2)} kWh
                                                {point.predicted && <span className="ml-1 text-teal-400">(Predicted)</span>}
                                            </div>
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
