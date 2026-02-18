'use client';

import { DashboardShell } from '@/components/DashboardShell';
import { User, Mail, Phone, MapPin, Camera, Save, X, Edit2 } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        name: 'John Doe',
        role: 'Admin',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA'
    });
    const [tempUser, setTempUser] = useState(user);

    const handleEdit = () => {
        setTempUser(user);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = () => {
        setUser(tempUser);
        setIsEditing(false);
    };

    const handleChange = (field: string, value: string) => {
        setTempUser(prev => ({ ...prev, [field]: value }));
    };

    return (
        <DashboardShell>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-100">Profile</h1>
                <p className="text-gray-400">Manage your personal information.</p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-neutral-900 rounded-xl shadow-sm border border-neutral-800 overflow-hidden">
                    {/* Cover Image */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="flex items-end">
                                <div className="h-24 w-24 rounded-full ring-4 ring-neutral-900 bg-neutral-800 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                    <div className="h-full w-full bg-blue-900/50 flex items-center justify-center text-blue-400 text-3xl font-bold">JD</div>
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                </div>
                                <div className="ml-6 mb-1">
                                    {isEditing ? (
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="text"
                                                value={tempUser.name}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                className="bg-neutral-800 border border-neutral-700 text-white text-xl font-bold rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={tempUser.role}
                                                onChange={(e) => handleChange('role', e.target.value)}
                                                className="bg-neutral-800 border border-neutral-700 text-gray-400 text-sm rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none w-32"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-2xl font-bold text-gray-100">{user.name}</h2>
                                            <p className="text-gray-400">{user.role}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEdit}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Edit2 size={16} /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-100 border-b border-neutral-800 pb-2">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-300 h-10">
                                        <Mail size={18} className="text-gray-500 shrink-0" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={tempUser.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none w-full"
                                            />
                                        ) : (
                                            <span>{user.email}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300 h-10">
                                        <Phone size={18} className="text-gray-500 shrink-0" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={tempUser.phone}
                                                onChange={(e) => handleChange('phone', e.target.value)}
                                                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none w-full"
                                            />
                                        ) : (
                                            <span>{user.phone}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300 h-10">
                                        <MapPin size={18} className="text-gray-500 shrink-0" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={tempUser.location}
                                                onChange={(e) => handleChange('location', e.target.value)}
                                                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none w-full"
                                            />
                                        ) : (
                                            <span>{user.location}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-100 border-b border-neutral-800 pb-2">Account Statistics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                        <p className="text-sm text-gray-500">Member Since</p>
                                        <p className="text-lg font-semibold text-gray-200">Jan 2024</p>
                                    </div>
                                    <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                                        <p className="text-sm text-gray-500">Last Login</p>
                                        <p className="text-lg font-semibold text-gray-200">Just now</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
