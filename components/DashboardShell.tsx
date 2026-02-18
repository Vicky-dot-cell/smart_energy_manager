'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { Home, BarChart2, Settings, User, Bell, LogOut, BatteryCharging, DollarSign, Tv, LayoutGrid, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

export function DashboardShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [sidebarWidth, setSidebarWidth] = useState(256); // Default 256px
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'High Energy Usage', desc: 'Usage spiked by 15% yesterday.', time: '2 mins ago', unread: true },
        { id: 2, title: 'Bill Generated', desc: 'January bill is ready for payment.', time: '1 hour ago', unread: true },
        { id: 3, title: 'Maintenance Alert', desc: 'Scheduled maintenance tmrw at 2 AM.', time: '5 hours ago', unread: false },
    ]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        setSidebarWidth(isCollapsed ? 256 : 80); // Reset width when toggling
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const navItems = [
        { name: 'Dashboard', href: '/', icon: Home },
        { name: 'Analytics', href: '/analytics', icon: BarChart2 },
        { name: 'Cost', href: '/cost', icon: DollarSign },
        { name: 'Appliances', href: '/appliances', icon: Tv },
        { name: 'Rooms', href: '/rooms', icon: LayoutGrid },
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
        <div className="min-h-screen min-w-[1280px] bg-neutral-950 flex font-sans text-gray-100">
            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className="bg-neutral-900 border-r border-neutral-800 flex flex-col fixed h-full z-20"
                style={{ width: sidebarWidth }}
            >
                <div className="p-6 flex items-center justify-between">
                    {!isCollapsed && (
                        <Link href="/"><h1 className="text-2xl font-bold text-white flex items-center gap-2 overflow-hidden whitespace-nowrap pr-8">
                            <BatteryCharging className="fill-current shrink-0" /> PowerWise
                        </h1></Link>
                    )}
                    {isCollapsed && (
                        <div className="mx-auto">
                            <BatteryCharging className="text-white fill-current shrink-0" size={24} />
                        </div>
                    )}
                </div>
                <button
                    onClick={toggleSidebar}
                    className="absolute right-4 top-6 text-gray-400 hover:text-white transition-colors z-50 p-1"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>

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
                                <item.icon size={20} className="shrink-0" />
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-neutral-800 overflow-hidden">
                    <a href="#" className={clsx(
                        "flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-900/20 rounded-lg font-medium transition-colors whitespace-nowrap",
                        isCollapsed && "justify-center px-2"
                    )}>
                        <LogOut size={20} className="shrink-0" />
                        {!isCollapsed && <span>Logout</span>}
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
                        <div className="flex items-center gap-4 relative">
                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                                    className="p-2 text-gray-400 hover:bg-neutral-800 rounded-full relative transition-colors"
                                >
                                    <Bell size={20} />
                                    {notifications.some(n => n.unread) && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden">
                                        <div className="p-3 border-b border-neutral-800 flex justify-between items-center">
                                            <h3 className="text-sm font-semibold text-gray-100">Notifications</h3>
                                            <span onClick={markAllRead} className="text-xs text-blue-400 cursor-pointer hover:underline">Mark all read</span>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.map((notif) => (
                                                <div key={notif.id} className={`p-3 border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors ${notif.unread ? 'bg-blue-900/10' : ''}`}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`text-sm font-medium ${notif.unread ? 'text-gray-100' : 'text-gray-400'}`}>{notif.title}</span>
                                                        <span className="text-[10px] text-gray-500">{notif.time}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400">{notif.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-2 text-center border-t border-neutral-800">
                                            <button className="text-xs text-gray-400 hover:text-gray-100">View all notifications</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                                    className="h-10 w-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold border border-blue-800 shadow-sm hover:border-blue-600 transition-colors cursor-pointer"
                                >
                                    JD
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden">
                                        <div className="p-4 border-b border-neutral-800">
                                            <p className="text-sm font-medium text-gray-100">John Doe</p>
                                            <p className="text-xs text-gray-500">john.doe@example.com</p>
                                        </div>
                                        <div className="p-1">
                                            <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-neutral-800 rounded-lg group">
                                                <User size={16} className="text-gray-500 group-hover:text-gray-300" /> My Profile
                                            </Link>
                                            <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-neutral-800 rounded-lg group">
                                                <Settings size={16} className="text-gray-500 group-hover:text-gray-300" /> Settings
                                            </Link>
                                        </div>
                                        <div className="p-1 border-t border-neutral-800">
                                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
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
