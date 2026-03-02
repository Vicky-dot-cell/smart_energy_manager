// ─── Config ──────────────────────────────────────────────────────────────────

export const API_BASE = 'http://localhost:4000';

/**
 * Default customer ID.
 * Change this (or replace with auth context) to switch customers.
 */
export const CUSTOMER_ID = 'CUST-001';

// ─── Generic fetch helper ─────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Range = 'TODAY' | 'MONTH' | 'YEAR';

export interface Stat {
    value: string;
    trend: string;
    trendUp: boolean;
}
export interface DashboardStats {
    voltage: Stat;
    current: Stat;
    power: Stat;
    totalEnergy: Stat;
}

export interface EnergyPoint { time: string; power: number; }
export interface ActivityItem { id: number; type: 'alert' | 'success' | 'info'; message: string; time: string; }
export interface CostPredItem { name: string; value: number; color: string; }
export interface CostChangeItem { name: string; cost: number; }
export interface UsageEstimate { tillNow: number; predicted: number; data: { name: string; kwh: number }[]; }
export interface ApplianceBar { name: string; kwh: number; }
export interface ActiveAppliances { top3Percent: number; data: ApplianceBar[]; }
export interface EnergyIntensity { value: number; max: number; unit: string; }

export interface PeakPoint { time: string; usage: number; }
export interface MonthlyRow { date: string; consumption: number; cost: number; status: string; }

export interface CostSummary { lastMonth: number; soFarThisMonth: number; predictedThisMonth: number; estimatedSavings: number; }
export interface CostBarItem { name: string; cost: number; predicted?: boolean; }

export interface ApplianceBarItem { name: string; electricity: number; predicted?: boolean; }

export interface RoomsPayload { rooms: string[]; range: string; labels: string[]; data: Record<string, number[]>; }

export interface Profile { name: string; initials: string; role: string; email: string; phone: string; location: string; memberSince: string; lastLogin: string; }
export interface Settings { language: string; currency: string; notifications: { email: boolean; push: boolean; reports: boolean }; }
export interface Device { id: number; name: string; type: string; status: string; lastActive: string; }
export interface Notification { id: number; title: string; desc: string; time: string; unread: boolean; }

// ─── API functions ────────────────────────────────────────────────────────────

const base = (cid: string) => `/customers/${cid}`;

export const api = {
    // Dashboard
    stats: (cid = CUSTOMER_ID) => apiFetch<DashboardStats>(`${base(cid)}/dashboard/stats`),
    energyChart: (range: Range, cid = CUSTOMER_ID) => apiFetch<{ range: string; data: EnergyPoint[] }>(`${base(cid)}/dashboard/energy-chart?range=${range}`),
    recentActivity: (cid = CUSTOMER_ID) => apiFetch<ActivityItem[]>(`${base(cid)}/dashboard/recent-activity`),
    costPredicted: (cid = CUSTOMER_ID) => apiFetch<CostPredItem[]>(`${base(cid)}/dashboard/cost-predicted`),
    costChange: (cid = CUSTOMER_ID) => apiFetch<CostChangeItem[]>(`${base(cid)}/dashboard/cost-change`),
    usageEstimate: (cid = CUSTOMER_ID) => apiFetch<UsageEstimate>(`${base(cid)}/dashboard/usage-estimate`),
    activeAppliances: (cid = CUSTOMER_ID) => apiFetch<ActiveAppliances>(`${base(cid)}/dashboard/active-appliances`),
    energyIntensity: (cid = CUSTOMER_ID) => apiFetch<EnergyIntensity>(`${base(cid)}/dashboard/energy-intensity`),

    // Analytics
    analytics: (cid = CUSTOMER_ID) => apiFetch<{ peakUsageHours: PeakPoint[]; monthlyBreakdown: MonthlyRow[] }>(`${base(cid)}/analytics`),

    // Cost
    cost: (range: Range, cid = CUSTOMER_ID) => apiFetch<{ summary: CostSummary; chart: { range: string; data: CostBarItem[] } }>(`${base(cid)}/cost?range=${range}`),

    // Appliances
    appliances: (range: Range, cid = CUSTOMER_ID) => apiFetch<{ list: string[]; range: string; data: ApplianceBarItem[] }>(`${base(cid)}/appliances?range=${range}`),

    // Rooms
    rooms: (range: Range, cid = CUSTOMER_ID) => apiFetch<RoomsPayload>(`${base(cid)}/rooms?range=${range}`),

    // Profile / Settings / Devices / Notifications
    profile: (cid = CUSTOMER_ID) => apiFetch<Profile>(`${base(cid)}/profile`),
    settings: (cid = CUSTOMER_ID) => apiFetch<Settings>(`${base(cid)}/settings`),
    devices: (cid = CUSTOMER_ID) => apiFetch<Device[]>(`${base(cid)}/devices`),
    notifications: (cid = CUSTOMER_ID) => apiFetch<Notification[]>(`${base(cid)}/notifications`),
};
