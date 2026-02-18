'use client';

import { DashboardShell } from '@/components/DashboardShell';
import { Bell, Shield, Smartphone, Globe, Moon, Save, Check, Lock, SmartphoneCharging, Wifi } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [language, setLanguage] = useState('English (US)');
    const [currency, setCurrency] = useState('USD ($)');
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        reports: false
    });
    const [devices] = useState([
        { id: 1, name: 'Main Hub', type: 'Gateway', status: 'Online', lastActive: 'Now' },
        { id: 2, name: 'Smart Plug - AC', type: 'Plug', status: 'Online', lastActive: '5 mins ago' },
        { id: 3, name: 'Kitchen Meter', type: 'Meter', status: 'Offline', lastActive: '2 days ago' },
    ]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 800);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'devices', label: 'Devices', icon: Smartphone },
    ];

    return (
        <DashboardShell>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Settings</h1>
                    <p className="text-gray-400">Manage your application preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${saved
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                >
                    {saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? 'Saved!' : (saving ? 'Saving...' : 'Save Changes')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Settings Nav */}
                <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-4 h-fit">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === tab.id
                                        ? 'bg-blue-900/20 text-blue-400'
                                        : 'text-gray-400 hover:bg-neutral-800 hover:text-gray-100'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="md:col-span-2 space-y-6">
                    {activeTab === 'general' && (
                        <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-6 animate-fadeIn">
                            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                                <Globe size={20} /> General Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                    <div>
                                        <p className="text-gray-200 font-medium">Language</p>
                                        <p className="text-sm text-gray-500">Select your preferred language</p>
                                    </div>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                    >
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
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                    >
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                        <option>INR (₹)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-6 animate-fadeIn">
                            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                                <Bell size={20} /> Notifications
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { id: 'email', label: 'Email Alerts' },
                                    { id: 'push', label: 'Push Notifications' },
                                    { id: 'reports', label: 'Weekly Reports' }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                        <span className="text-gray-200 font-medium">{item.label}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications[item.id as keyof typeof notifications]}
                                                onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-6 animate-fadeIn">
                            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                                <Shield size={20} /> Security
                            </h3>
                            <div className="space-y-6">
                                <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                    <h4 className="text-sm font-medium text-gray-200 mb-4">Change Password</h4>
                                    <div className="space-y-3">
                                        <input type="password" placeholder="Current Password" className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500" />
                                        <input type="password" placeholder="New Password" className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500" />
                                        <input type="password" placeholder="Confirm New Password" className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                    <div>
                                        <p className="text-gray-200 font-medium">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-500">Secure your account with 2FA</p>
                                    </div>
                                    <button className="text-blue-500 hover:text-blue-400 font-medium text-sm">Enable</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'devices' && (
                        <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 p-6 animate-fadeIn">
                            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                                <Smartphone size={20} /> Connected Devices
                            </h3>
                            <div className="space-y-4">
                                {devices.map((device) => (
                                    <div key={device.id} className="flex items-center justify-between p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-neutral-800 rounded-full flex items-center justify-center text-gray-400">
                                                {device.type === 'Gateway' ? <Wifi size={20} /> : <SmartphoneCharging size={20} />}
                                            </div>
                                            <div>
                                                <p className="text-gray-200 font-medium">{device.name}</p>
                                                <p className="text-xs text-gray-500">Last active: {device.lastActive}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${device.status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            <span className="text-sm text-gray-400">{device.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}
