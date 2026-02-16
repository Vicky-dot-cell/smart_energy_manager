'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { Home, BarChart2, Settings, User, Bell, LogOut, BatteryCharging } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

export function DashboardShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [sidebarWidth, setSidebarWidth] = useState(256); // Default 256px
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { name: 'Dashboard', href: '/', icon: Home },
        { name: 'Analytics', href: '/analytics', icon: BarChart2 },
        { name: 'Settings', href: '/settings', icon: Settings },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const startResizing = () => {
        setIsResizing(true);
    };

    const stopResizing = () => {
        setIsResizing(false);
    };

    const resize = (mouseMoveEvent: MouseEvent) => {
        if (isResizing) {
            const newWidth = mouseMoveEvent.clientX;
            if (newWidth >= 160 && newWidth <= 480) { // Min 160px, Max 480px
                setSidebarWidth(newWidth);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing]);

    return (
        <div className="min-h-screen bg-neutral-950 flex font-sans text-gray-100">
            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className="bg-neutral-900 border-r border-neutral-800 hidden md:flex flex-col fixed h-full z-20"
                style={{ width: sidebarWidth }}
            >
                <div className="p-6">
                    <Link href="/"><h1 className="text-2xl font-bold text-white  flex items-center gap-2 overflow-hidden whitespace-nowrap">
                        <BatteryCharging className="fill-current shrink-0" /> PowerWise
                    </h1></Link>
                </div>
                <nav className="mt-6 px-4 space-y-2 flex-1 overflow-hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap',
                                    isActive
                                        ? 'text-blue-400 bg-blue-900/20'
                                        : 'text-gray-400 hover:bg-neutral-800 hover:text-gray-100'
                                )}
                            >
                                <item.icon size={20} className="shrink-0" /> {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-neutral-800 overflow-hidden">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-900/20 rounded-lg font-medium transition-colors whitespace-nowrap">
                        <LogOut size={20} className="shrink-0" /> Logout
                    </a>
                </div>

                {/* Resize Handle */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 transition-colors z-50"
                    onMouseDown={startResizing}
                />
            </aside>

            {/* Main Content */}
            <main
                className="flex-1 transition-all duration-75"
                style={{ marginLeft: `max(0px, ${sidebarWidth}px)` }} // Only apply margin on desktop where sidebar is visible
            >
                {/* Mobile Sidebar Placeholder (hidden on desktop) */}
                <div className="md:hidden">
                    {/* You might want a separate mobile menu implementation here, but for now we keep the layout consistent */}
                </div>

                {/* Header */}
                <header className="bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-10 w-full">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-100">Dashboard Overview</h2>
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-gray-400 hover:bg-neutral-800 rounded-full relative transition-colors">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            </button>
                            <div className="h-10 w-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold border border-blue-800 shadow-sm">
                                JD
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
