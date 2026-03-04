import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
    return (
        <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-100 mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${trendUp ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center">
                    <span className={`text-sm font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                        {trend}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
            )}
        </div>
    );
}
