'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { Home, BarChart2, Settings, User, Bell, LogOut, BatteryCharging, DollarSign, Tv, LayoutGrid, Menu, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { api, type Notification as ApiNotification, type Profile } from '@/lib/api';

export function DashboardShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarWidth, setSidebarWidth] = useState(256); // Default 256px
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
    const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);
    const [notifications, setNotifications] = useState<ApiNotification[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/login');
        } else {
            setIsCheckingAuth(false);
            api.notifications().then(setNotifications).catch(console.error);
            api.profile().then(setProfile).catch(console.error);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('consumer_id');
        router.push('/login');
    };

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const handleNotificationClick = (id: number) => {
        markAsRead(id);
        setSelectedNotificationId(id);
        setIsNotificationCenterOpen(true);
        setShowNotifications(false);
    };

    const handleViewAllClick = () => {
        setIsNotificationCenterOpen(true);
        setShowNotifications(false);
    };

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
        if (isResizing && !isCollapsed) {
            const newWidth = mouseMoveEvent.clientX;
            // Min 240px to prevent logo shrinking, Max 360px to prevent over-expanding
            if (newWidth >= 240 && newWidth <= 360) {
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

    if (isCheckingAuth) {
        return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-gray-400">Loading...</div>;
    }

    return (
        <div className="min-h-screen min-w-[1280px] bg-neutral-950 flex font-sans text-gray-100">
            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className="bg-neutral-900 border-r border-neutral-800 flex flex-col fixed h-full z-20 group/sidebar"
                style={{ width: sidebarWidth }}
            >
                <div className="p-6 flex items-center justify-between h-[80px] group/header">
                    {!isCollapsed ? (
                        <>
                            <Link href="/" className="flex-1 min-w-0">
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2 overflow-hidden whitespace-nowrap">
                                    <BatteryCharging className="fill-current shrink-0" size={24} />
                                    <span className="truncate">PowerWise</span>
                                </h1>
                            </Link>
                            <button
                                onClick={toggleSidebar}
                                className="text-gray-500 hover:text-gray-100 hover:bg-neutral-800 p-1.5 rounded-md transition-all opacity-0 group-hover/header:opacity-100 shrink-0 ml-2"
                                aria-label="Collapse sidebar"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        </>
                    ) : (
                        <div className="w-full flex justify-center">
                            <button
                                onClick={toggleSidebar}
                                className="text-gray-400 hover:text-gray-100 hover:bg-neutral-800 p-2 rounded-md transition-colors"
                                aria-label="Expand sidebar"
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    )}
                </div>

                <nav className="mt-2 px-4 space-y-2 flex-1 overflow-hidden">
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
                    <button onClick={handleLogout} className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-900/20 rounded-lg font-medium transition-colors whitespace-nowrap",
                        isCollapsed && "justify-center px-2"
                    )}>
                        <LogOut size={20} className="shrink-0" />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>

                {/* Resize Handle */}
                {!isCollapsed && (
                    <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 transition-colors z-50"
                        onMouseDown={startResizing}
                    />
                )}
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
                                                <div
                                                    key={notif.id}
                                                    onClick={() => handleNotificationClick(notif.id)}
                                                    className={`p-3 border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors cursor-pointer ${notif.unread ? 'bg-blue-900/10' : ''}`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`text-sm font-medium ${notif.unread ? 'text-gray-100' : 'text-gray-400'}`}>{notif.title}</span>
                                                        <span className="text-[10px] text-gray-500">{notif.time}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 line-clamp-1">{notif.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-2 text-center border-t border-neutral-800">
                                            <button
                                                onClick={handleViewAllClick}
                                                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                                            >
                                                View all notifications
                                            </button>
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
                                    {profile?.initials ?? '…'}
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden">
                                        <div className="p-4 border-b border-neutral-800">
                                            <p className="text-sm font-medium text-gray-100">{profile?.name ?? '—'}</p>
                                            <p className="text-xs text-gray-500">{profile?.email ?? '—'}</p>
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
                                            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
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

                {/* Notification Center Slide-over */}
                {isNotificationCenterOpen && (
                    <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm">
                        <div className="w-full max-w-md bg-neutral-900 h-full border-l border-neutral-800 shadow-2xl flex flex-col">
                            <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/95 backdrop-blur z-10">
                                <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                                    <Bell size={20} className="text-blue-400" /> Notifications
                                </h2>
                                <div className="flex items-center gap-4">
                                    <button onClick={markAllRead} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Mark all read</button>
                                    <button onClick={() => setIsNotificationCenterOpen(false)} className="p-2 text-gray-400 hover:text-gray-100 hover:bg-neutral-800 rounded-full transition-all">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        onClick={() => {
                                            markAsRead(notif.id);
                                            setSelectedNotificationId(selectedNotificationId === notif.id ? null : notif.id);
                                        }}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${selectedNotificationId === notif.id ? 'bg-neutral-800 border-blue-500/50 ring-1 ring-blue-500/30' : notif.unread ? 'bg-blue-900/10 border-blue-900/30 hover:bg-neutral-800/80' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2 gap-4">
                                            <h3 className={`font-medium ${notif.unread ? 'text-gray-100' : 'text-gray-300'}`}>{notif.title}</h3>
                                            <span className="text-xs text-gray-500 whitespace-nowrap pt-0.5">{notif.time}</span>
                                        </div>
                                        <p className={`text-sm leading-relaxed ${selectedNotificationId === notif.id ? 'text-gray-300' : 'text-gray-400 line-clamp-2'}`}>
                                            {notif.desc}
                                        </p>

                                        {/* Expanded details */}
                                        {selectedNotificationId === notif.id && (
                                            <div className="mt-4 pt-4 border-t border-neutral-700/50 flex justify-end gap-3 translate-y-0 opacity-100 transition-all">
                                                <button className="text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors">
                                                    Archive
                                                </button>
                                                <button className="text-xs bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 font-medium px-4 py-1.5 rounded-lg transition-colors border border-blue-500/20">
                                                    Action
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {notifications.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                        <Bell size={48} className="mb-4 opacity-20" />
                                        <p className="text-sm">No notifications right now</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
