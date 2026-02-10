'use client';

import { DashboardShell } from '@/components/DashboardShell';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';

export default function ProfilePage() {
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
                                    <h2 className="text-2xl font-bold text-gray-100">John Doe</h2>
                                    <p className="text-gray-400">Admin</p>
                                </div>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                Edit Profile
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-100 border-b border-neutral-800 pb-2">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Mail size={18} className="text-gray-500" />
                                        <span>john.doe@example.com</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Phone size={18} className="text-gray-500" />
                                        <span>+1 (555) 123-4567</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <MapPin size={18} className="text-gray-500" />
                                        <span>San Francisco, CA</span>
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
                                        <p className="text-lg font-semibold text-gray-200">2 mins ago</p>
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
