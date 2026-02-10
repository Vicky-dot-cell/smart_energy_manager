import { AlertCircle, CheckCircle2, Zap } from 'lucide-react';

const activities = [
    { id: 1, type: 'alert', message: 'Voltage spike detected', time: '2 mins ago' },
    { id: 2, type: 'success', message: 'System optimization complete', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'Daily report generated', time: '3 hours ago' },
    { id: 4, type: 'alert', message: 'High consumption alert', time: '5 hours ago' },
];

export function RecentActivity() {
    return (
        <div className="bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-800">
            <h3 className="text-lg font-semibold text-gray-100 mb-6">Recent Activity</h3>
            <div className="space-y-6">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                        <div className={`mt-1 p-2 rounded-full ${activity.type === 'alert' ? 'bg-red-500/10 text-red-500' :
                            activity.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                'bg-blue-500/10 text-blue-500'
                            }`}>
                            {activity.type === 'alert' ? <AlertCircle size={16} /> :
                                activity.type === 'success' ? <CheckCircle2 size={16} /> :
                                    <Zap size={16} />}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-200">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
