'use client';

import { DashboardShell } from '@/components/DashboardShell';
import { CostSummary } from '@/components/Cost/CostSummary';
import { CostChart } from '@/components/Cost/CostChart';
import { useState } from 'react';

export default function CostPage() {
    const [viewMode, setViewMode] = useState<'TODAY' | 'MONTH' | 'YEAR'>('TODAY');

    return (
        <DashboardShell>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-100 mb-1">Cost</h1>
                    {/* The switches at the top left in the image "TODAY MONTH YEAR" seemed to be a global filter or specific to this page. 
                         I'll implement them here if they are global, or just let the chart handle it. 
                         The design shows "TODAY MONTH YEAR" pills at the top left. 
                         I will add them as a page-level control if needed, but the Chart also has "THIS MONTH", "LAST MONTH" in the image.
                         Let's stick to the Chart having the primary controls for now as per my previous file, 
                         but I will add the top pills as requested "add another page ( cost ) with ( today, month, year ) like the picture".
                     */}
                </div>
                <div className="text-right">
                    <p className="text-gray-400 text-sm">February 2026</p>
                </div>
            </div>

            {/* Top Pills / Filter - mimicking the image "TODAY MONTH YEAR" */}
            <div className="bg-neutral-800/50 inline-flex rounded-full p-1 mb-10 border border-neutral-800">
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

            <CostSummary />

            <div className="mt-8">
                {/* I am passing the viewMode to the chart to control it from the top pills if desired, 
                    OR I can keep the local state in the chart. 
                    The Prompt said "page with ( today, month, year ) like the picture". 
                    In the picture, there are pills at the top left nicely styled. 
                    I'll implement the CostChart to accept this prop or just render the chart which has its own controls. 
                    Actually, to make it "like the picture", the top pills likely control the data. 
                    I'll modify CostChart to accept `range` as a prop.
                */}
                <CostChart range={viewMode} />
            </div>

        </DashboardShell>
    );
}
