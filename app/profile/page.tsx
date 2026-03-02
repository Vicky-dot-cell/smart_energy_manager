'use client';

import { DashboardShell } from '@/components/DashboardShell';
import { User, Mail, Phone, MapPin, Camera, Save, X, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api, type Profile } from '@/lib/api';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<Profile | null>(null);
    const [tempUser, setTempUser] = useState<Profile | null>(null);

    useEffect(() => {
        api.profile().then(p => { setUser(p); setTempUser(p); }).catch(console.error);
    }, []);

    const handleEdit = () => { setTempUser(user); setIsEditing(true); };
    const handleCancel = () => setIsEditing(false);
    const handleSave = () => { if (tempUser) setUser(tempUser); setIsEditing(false); };
    const handleChange = (field: string, value: string) =>
        setTempUser(prev => prev ? { ...prev, [field]: value } : prev);

    if (!user) {
        return (
            <DashboardShell>
                <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
                    <div className="h-32 bg-neutral-800 rounded-xl" />
                    <div className="h-48 bg-neutral-900 rounded-xl" />
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-100">Profile</h1>
                <p className="text-gray-400">Manage your personal information.</p>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="flex items-end">
                                <div className="h-24 w-24 rounded-full ring-4 ring-neutral-900 bg-neutral-800 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                    <div className="h-full w-full bg-blue-900/50 flex items-center justify-center text-blue-400 text-3xl font-bold">
                                        {user.initials}
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                </div>
                                <div className="ml-6 mb-1">
                                    <h2 className="text-2xl font-bold text-gray-100">{user.name}</h2>
                                    <p className="text-gray-400">{user.role}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleEdit}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-100 border-b border-neutral-800 pb-2">Contact Information</h3>
                                <div className="space-y-4">
                                    {[
                                        { icon: Mail, val: user.email },
                                        { icon: Phone, val: user.phone },
                                        { icon: MapPin, val: user.location },
                                    ].map(({ icon: Icon, val }) => (
                                        <div key={val} className="flex items-center gap-3 text-gray-300 h-10">
                                            <Icon size={18} className="text-gray-500 shrink-0" />
                                            <span>{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-100 border-b border-neutral-800 pb-2">Account Statistics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                        <p className="text-sm text-gray-500">Member Since</p>
                                        <p className="text-lg font-semibold text-gray-200">{user.memberSince}</p>
                                    </div>
                                    <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                        <p className="text-sm text-gray-500">Last Login</p>
                                        <p className="text-lg font-semibold text-gray-200">{user.lastLogin}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && tempUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
                            <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                            <button onClick={handleCancel} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { label: 'Full Name', field: 'name', type: 'text' },
                                { label: 'Role', field: 'role', type: 'text' },
                                { label: 'Email', field: 'email', type: 'email' },
                                { label: 'Phone', field: 'phone', type: 'text' },
                                { label: 'Location', field: 'location', type: 'text' },
                            ].map(({ label, field, type }) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
                                    <input
                                        type={type}
                                        value={(tempUser as any)[field]}
                                        onChange={e => handleChange(field, e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-900/50 rounded-b-2xl">
                            <button onClick={handleCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-neutral-800 transition-colors">Cancel</button>
                            <button onClick={handleSave} className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardShell>
    );
}
