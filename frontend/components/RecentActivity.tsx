import { AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { type ActivityItem } from '@/lib/api';
import { useCustomerData } from '@/contexts/CustomerDataContext';

export function RecentActivity() {
    const { data } = useCustomerData();
    const activities: ActivityItem[] = data?.dashboard?.recentActivity ?? [];

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
