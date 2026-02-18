'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';

export function CostSummary() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="flex flex-col items-center">
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2">January</h3>
                <p className="text-4xl font-bold text-gray-100">$203</p>
            </div>

            <div className="flex flex-col items-center">
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2">So Far This Month</h3>
                <p className="text-4xl font-bold text-gray-100">$124.8</p>
            </div>

            <div className="flex flex-col items-center">
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2">Predicted This Month</h3>
                <p className="text-4xl font-bold text-gray-100">$214</p>
            </div>

            <div className="flex flex-col items-center">
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2">Estimated Savings</h3>
                <p className="text-4xl font-bold text-gray-100">$11</p>
            </div>
        </div>
    );
}
