'use client';

import { DashboardShell } from '@/components/DashboardShell';
import { Bell, Shield, Smartphone, Globe, Moon } from 'lucide-react';

export default function SettingsPage() {
    return (
        <DashboardShell>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-100">Settings</h1>
                <p className="text-gray-400">Manage your application preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Settings Nav */}
                <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-4 h-fit">
                    <nav className="space-y-1">
                        {['General', 'Notifications', 'Security', 'Devices'].map((item, idx) => (
                            <button key={item} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${idx === 0 ? 'bg-blue-900/20 text-blue-400' : 'text-gray-400 hover:bg-neutral-800 hover:text-gray-100'}`}>
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-6">
                        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                            <Globe size={20} /> General Preferences
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                <div>
                                    <p className="text-gray-200 font-medium">Language</p>
                                    <p className="text-sm text-gray-500">Select your preferred language</p>
                                </div>
                                <select className="bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                                    <option>English (US)</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                <div>
                                    <p className="text-gray-200 font-medium">Currency</p>
                                    <p className="text-sm text-gray-500">Currency for cost estimation</p>
                                </div>
                                <select className="bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                                    <option>USD ($)</option>
                                    <option>EUR (€)</option>
                                    <option>INR (₹)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-6">
                        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                            <Bell size={20} /> Notifications
                        </h3>
                        <div className="space-y-4">
                            {['Email Alerts', 'Push Notifications', 'Weekly Reports'].map((item) => (
                                <div key={item} className="flex items-center justify-between p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                    <span className="text-gray-200 font-medium">{item}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
