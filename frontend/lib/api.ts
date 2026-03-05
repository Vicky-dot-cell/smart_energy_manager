// ─── Config ──────────────────────────────────────────────────────────────────

export const API_BASE = 'http://localhost:4001';

/**
 * Get the active customer ID from localStorage, fallback to CUST-001 (dummy default)
 */
export const getCustomerId = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('consumer_id') || 'CUST-001';
    }
    return 'CUST-001';
};

// ─── Generic fetch helper ─────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {})
        }
    });

    if (!res.ok) {
        let errorMsg = `API error ${res.status}`;
        try {
            const errorBody = await res.json();
            if (errorBody.error) errorMsg = errorBody.error;
        } catch (e) { }
        throw new Error(errorMsg);
    }
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

export interface BillPaymentItem { id: string; date: string; amount: number; method: string; status: string; }
export interface Bill {
    invoiceNumber: string;
    billingPeriod: string;
    dueDate: string;
    currentCharges: number;
    fixedCharges: number;
    taxes: number;
    totalDue: number;
    savings: number;
    status: 'Paid' | 'Unpaid';
    paymentHistory: BillPaymentItem[];
}

// ─── API functions ────────────────────────────────────────────────────────────

const base = (cid: string) => `/customers/${cid}`;

export const api = {
    // Auth
    login: (consumer_id: string, password: string) =>
        apiFetch<{ token: string, consumer_id: string, name: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ consumer_id, password })
        }),
    signup: (consumer_id: string, password: string) =>
        apiFetch<{ token: string, consumer_id: string, name: string }>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ consumer_id, password })
        }),
    resetPassword: (consumer_id: string, new_password: string) =>
        apiFetch<{ message: string }>('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ consumer_id, new_password })
        }),

    // Master Unified Fetch
    customerData: (cid = getCustomerId()) => apiFetch<any>(`${base(cid)}`),

    // Dashboard
    stats: (cid = getCustomerId()) => apiFetch<DashboardStats>(`${base(cid)}/dashboard/stats`),
    energyChart: (range: Range, cid = getCustomerId()) => apiFetch<{ range: string; data: EnergyPoint[] }>(`${base(cid)}/dashboard/energy-chart?range=${range}`),
    recentActivity: (cid = getCustomerId()) => apiFetch<ActivityItem[]>(`${base(cid)}/dashboard/recent-activity`),
    costPredicted: (cid = getCustomerId()) => apiFetch<CostPredItem[]>(`${base(cid)}/dashboard/cost-predicted`),
    costChange: (cid = getCustomerId()) => apiFetch<CostChangeItem[]>(`${base(cid)}/dashboard/cost-change`),
    usageEstimate: (cid = getCustomerId()) => apiFetch<UsageEstimate>(`${base(cid)}/dashboard/usage-estimate`),
    activeAppliances: (cid = getCustomerId()) => apiFetch<ActiveAppliances>(`${base(cid)}/dashboard/active-appliances`),
    energyIntensity: (cid = getCustomerId()) => apiFetch<EnergyIntensity>(`${base(cid)}/dashboard/energy-intensity`),

    // Analytics
    analytics: (cid = getCustomerId()) => apiFetch<{ peakUsageHours: PeakPoint[]; monthlyBreakdown: MonthlyRow[] }>(`${base(cid)}/analytics`),

    // Cost
    cost: (range: Range, cid = getCustomerId()) => apiFetch<{ summary: CostSummary; chart: { range: string; data: CostBarItem[] } }>(`${base(cid)}/cost?range=${range}`),

    // Appliances
    appliances: (range: Range, cid = getCustomerId()) => apiFetch<{
        list: string[];
        range: string;
        data: ApplianceBarItem[];
        timeSeries: { labels: string[]; data: Record<string, number[]> };
    }>(`${base(cid)}/appliances?range=${range}`),

    // Rooms
    rooms: (range: Range, cid = getCustomerId()) => apiFetch<RoomsPayload>(`${base(cid)}/rooms?range=${range}`),

    // Profile / Settings / Devices / Notifications
    profile: (cid = getCustomerId()) => apiFetch<Profile>(`${base(cid)}/profile`),
    settings: (cid = getCustomerId()) => apiFetch<Settings>(`${base(cid)}/settings`),
    updateSettings: (settings: Settings, cid = getCustomerId()) =>
        apiFetch<{ success: boolean; settings: Settings }>(`${base(cid)}/settings`, {
            method: 'POST',
            body: JSON.stringify(settings)
        }),
    devices: (cid = getCustomerId()) => apiFetch<Device[]>(`${base(cid)}/devices`),
    notifications: (cid = getCustomerId()) => apiFetch<Notification[]>(`${base(cid)}/notifications`),

    // Billing
    bill: (cid = getCustomerId()) => apiFetch<Bill>(`${base(cid)}/bill`),
    pay: (amount: number, method: string, cid = getCustomerId()) =>
        apiFetch<{ success: boolean; message: string; newStatus: string }>(`${base(cid)}/pay`, {
            method: 'POST',
            body: JSON.stringify({ amount, method })
        }),
};
