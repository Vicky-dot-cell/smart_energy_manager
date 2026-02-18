'use client';

import { DashboardShell } from '@/components/DashboardShell';
import { RoomsHeatmap } from '@/components/Rooms/RoomsHeatmap';
import { useState } from 'react';

export default function RoomsPage() {
    const [viewMode, setViewMode] = useState<'TODAY' | 'MONTH' | 'YEAR'>('MONTH');

    return (
        <DashboardShell>
            <div className="mb-8 flex items-center justify-between">
                <div></div>
                <div className="text-right">
                    <p className="text-gray-400 text-sm">February 18th, 2026</p>
                </div>
            </div>

            <h2 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-4">Usage By Rooms</h2>

            <div className="bg-neutral-800/50 inline-flex rounded-full p-1 mb-6 border border-neutral-800">
                {(['TODAY', 'MONTH', 'YEAR'] as const).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${viewMode === mode
                                ? 'bg-neutral-700 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            <div className="mt-2">
                <RoomsHeatmap context={viewMode} />
            </div>

        </DashboardShell>
    );
}
