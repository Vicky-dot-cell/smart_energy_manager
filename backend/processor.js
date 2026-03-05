/**
 * processor.js
 * Takes a raw ESP32 payload and derives all frontend data placeholders.
 * Returns a complete frontend_data structure for a single customer.
 */

'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────

const RATE_PER_KWH = 8.0;          // ₹ per kWh (Indian tariff example)
const HOURS_IN_DAY = 24;
const DAYS_IN_MONTH = 30;

// Appliance load distribution (must sum to 1.0)
const APPLIANCE_DIST = [
    { name: 'Air Conditioner', share: 0.35 },
    { name: 'Water Heater', share: 0.20 },
    { name: 'Refrigerator', share: 0.15 },
    { name: 'Washing Machine', share: 0.12 },
    { name: 'Lighting', share: 0.10 },
    { name: 'Others', share: 0.08 },
];

// Room distribution
const ROOM_DIST = [
    { name: 'Living Room', share: 0.30 },
    { name: 'Bedroom', share: 0.25 },
    { name: 'Kitchen', share: 0.22 },
    { name: 'Bathroom', share: 0.13 },
    { name: 'Study', share: 0.10 },
];

// Cost category breakdown (pie chart)
const COST_CATEGORIES = [
    { name: 'Appliances', share: 0.40, color: '#6366f1' },
    { name: 'HVAC', share: 0.28, color: '#22d3ee' },
    { name: 'Lighting', share: 0.17, color: '#f59e0b' },
    { name: 'Others', share: 0.15, color: '#f43f5e' },
];

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'];

// Past months labels for change/trend charts
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Round to N decimal places */
const r = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

/** Sign-aware trend text, e.g. "+3.2%" */
const trendText = (pct) => `${pct >= 0 ? '+' : ''}${r(pct, 1)}%`;

/** Generate pseudo-random but deterministic variation around a baseline */
function vary(base, pct, seed = 1) {
    // Simple seeded jitter — deterministic so JSON stays stable
    const factor = 1 + ((Math.sin(seed * 9301 + 49297) * 0.5 + 0.5) * 2 - 1) * pct;
    return r(base * factor, 2);
}

/** Global ring buffer — persists across process() calls */
let todayTimeSeries = null;

/**
 * Advance the ring buffer by one tick.
 * Appends the new power reading, shifts off the oldest.
 * Returns a shallow copy so Recharts always sees a new array reference.
 */
function advanceTodayBuffer(currentPower) {
    if (!todayTimeSeries) {
        // Bootstrap: fill 60 entries (~2 min of history) so chart is never blank
        const now = new Date();
        todayTimeSeries = Array.from({ length: 60 }, (_, i) => {
            const t = new Date(now.getTime() - (59 - i) * 2000);
            const label = t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            // Sine-wave history around 460W so it looks realistic from start
            const jitter = 460 + Math.sin(i * 0.35) * 50 + (Math.random() * 20 - 10);
            return { time: label, power: r(jitter, 1) };
        });
    }

    const safepower = Math.min(3500, Math.max(50, currentPower));
    const now = new Date();
    const label = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    todayTimeSeries.shift();
    todayTimeSeries.push({ time: label, power: r(safepower, 1) });
    return [...todayTimeSeries];
}

/** Build a time-series for 'MONTH' (30 daily points) */
function buildMonthTimeSeries(basePower) {
    const now = new Date();
    return Array.from({ length: 30 }, (_, d) => {
        const t = new Date(now);
        t.setDate(now.getDate() - 29 + d);
        const label = t.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        return { time: label, power: vary(basePower, 0.15, d + 100) };
    });
}

/** Build a time-series for 'YEAR' (12 monthly points) */
function buildYearTimeSeries(basePower) {
    return MONTHS.concat(['Apr', 'May', 'Jun']).slice(-12).map((m, i) => ({
        time: m,
        power: vary(basePower, 0.20, i + 200),
    }));
}

// ─── Main processor ───────────────────────────────────────────────────────────

/**
 * @param {object} esp  - raw ESP32 payload
 * @returns {object}    - full frontend data structure
 */
function process(esp) {
    const {
        voltage,
        current,
        power,        // Watts
        energy,       // kWh (cumulative reading)
        power_factor,
        temperature,
        status,
        timestamp,
        device_id,
    } = esp;

    // ── Derived base values ──────────────────────────────────────────────────
    const powerKw = power / 1000;                          // kW
    const dailyKwh = powerKw * HOURS_IN_DAY;               // kWh/day estimated
    const monthlyKwh = dailyKwh * DAYS_IN_MONTH;             // kWh/month estimated
    const dailyCost = dailyKwh * RATE_PER_KWH;              // ₹/day
    const monthlyCost = monthlyKwh * RATE_PER_KWH;            // ₹/month
    const kwh_so_far = energy;                                // cumulative kWh
    const cost_so_far = kwh_so_far * RATE_PER_KWH;

    // Trend deltas (compare to -5% baseline: simulates previous reading)
    const voltageTrend = r(((voltage - 225.0) / 225.0) * 100, 1);
    const currentTrend = r(((current - 2.0) / 2.0) * 100, 1);
    const powerTrend = r(((power - 480.0) / 480.0) * 100, 1);
    const energyTrend = r(((energy - 11.0) / 11.0) * 100, 1);

    // ── Dashboard Stats ──────────────────────────────────────────────────────
    const stats = {
        voltage: { value: `${r(voltage, 1)} V`, trend: trendText(voltageTrend), trendUp: voltageTrend >= 0 },
        current: { value: `${r(current, 2)} A`, trend: trendText(currentTrend), trendUp: currentTrend >= 0 },
        power: { value: `${r(power, 1)} W`, trend: trendText(powerTrend), trendUp: powerTrend >= 0 },
        totalEnergy: { value: `${r(energy, 2)} kWh`, trend: trendText(energyTrend), trendUp: energyTrend >= 0 },
    };

    // ── Energy Chart (all three range modes) ─────────────────────────────────
    // IMPORTANT: call advanceTodayBuffer ONCE per tick. Reuse same snapshot for
    // analytics so the ring buffer doesn't shift twice in one processor call.
    const todaySnapshot = advanceTodayBuffer(power);
    const energyChart = {
        TODAY: { range: 'TODAY', data: todaySnapshot },
        MONTH: { range: 'MONTH', data: buildMonthTimeSeries(power) },
        YEAR: { range: 'YEAR', data: buildYearTimeSeries(power) },
    };

    // ── Recent Activity ───────────────────────────────────────────────────────
    const recentActivity = [
        { id: 1, type: 'success', message: `Device ${device_id} online — ${status}`, time: '2 min ago' },
        { id: 2, type: 'info', message: `Power reading: ${r(power, 1)} W @ ${r(voltage, 1)} V`, time: '5 min ago' },
        {
            id: 3, type: power_factor < 0.9 ? 'alert' : 'info',
            message: `Power factor: ${r(power_factor, 2)} — ${power_factor < 0.9 ? 'needs correction' : 'good'}`, time: '10 min ago'
        },
        {
            id: 4, type: temperature > 40 ? 'alert' : 'info',
            message: `Sensor temperature: ${r(temperature, 1)} °C`, time: '15 min ago'
        },
        { id: 5, type: 'info', message: `Daily estimated cost: ₹${r(dailyCost, 2)}`, time: '30 min ago' },
        { id: 6, type: 'success', message: `Monthly projected: ₹${r(monthlyCost, 0)}`, time: '1 hr ago' },
    ];

    // ── Cost Predicted (pie) ─────────────────────────────────────────────────
    const costPredicted = COST_CATEGORIES.map(c => ({
        name: c.name,
        value: r(monthlyCost * c.share, 2),
        color: c.color,
    }));

    // ── Cost Change (month-over-month bar) ────────────────────────────────────
    const costChange = MONTHS.map((m, i) => ({
        name: m,
        cost: vary(monthlyCost, 0.18, i + 300),
    }));
    // Override last bar with current actual estimate
    costChange[costChange.length - 1] = { name: MONTHS[MONTHS.length - 1], cost: r(monthlyCost, 2) };

    // ── Usage Estimate ────────────────────────────────────────────────────────
    const daysElapsed = new Date().getDate();
    const kwhTillNow = r(dailyKwh * daysElapsed, 2);
    const kwhPredMonthly = r(dailyKwh * DAYS_IN_MONTH, 2);
    const usageEstimate = {
        tillNow: kwhTillNow,
        predicted: kwhPredMonthly,
        data: Array.from({ length: 7 }, (_, i) => ({
            name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            kwh: vary(dailyKwh, 0.12, i + 400),
        })),
    };

    // ── Active Appliances ─────────────────────────────────────────────────────
    const top3Power = APPLIANCE_DIST.slice(0, 3).reduce((s, a) => s + a.share, 0);
    const activeAppliances = {
        top3Percent: r(top3Power * 100, 0),
        data: APPLIANCE_DIST.map(a => ({
            name: a.name,
            kwh: r(dailyKwh * a.share, 2),
        })),
    };

    // ── Energy Intensity ──────────────────────────────────────────────────────
    const intensity = r(power / power_factor, 1);
    const energyIntensity = {
        value: intensity,
        max: 2000,
        unit: 'VA',
    };

    // ── Analytics ─────────────────────────────────────────────────────────────
    // Reuse the SAME today snapshot — do NOT call advanceTodayBuffer again
    // The last 7 points of the buffer act as "peak usage" display
    const peakUsageHours = todaySnapshot
        .slice(-7)
        .map(p => ({ time: p.time, usage: p.power }));

    const monthlyBreakdown = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - 5 + i);
        const consumption = vary(monthlyKwh, 0.15, i + 500);
        return {
            date: d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
            consumption: r(consumption, 2),
            cost: r(consumption * RATE_PER_KWH, 2),
            status: consumption > monthlyKwh * 1.1 ? 'High' : consumption < monthlyKwh * 0.9 ? 'Low' : 'Normal',
        };
    });

    // ── Cost page ─────────────────────────────────────────────────────────────
    const lastMonthCost = vary(monthlyCost, 0.12, 601);
    const costSummary = {
        lastMonth: r(lastMonthCost, 2),
        soFarThisMonth: r(cost_so_far, 2),
        predictedThisMonth: r(monthlyCost, 2),
        estimatedSavings: r(Math.max(0, lastMonthCost - monthlyCost), 2),
    };

    const buildCostBars = (baseCost, numBars, labels) =>
        labels.map((name, i) => ({
            name,
            cost: vary(baseCost, 0.15, i + 700),
            ...(i === labels.length - 1 ? { predicted: true } : {}),
        }));

    const costChart = {
        TODAY: {
            range: 'TODAY',
            data: buildCostBars(dailyCost / 24, 24,
                Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`)),
        },
        MONTH: {
            range: 'MONTH',
            data: buildCostBars(dailyCost, 30,
                Array.from({ length: 30 }, (_, d) => {
                    const dt = new Date(); dt.setDate(dt.getDate() - 29 + d);
                    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                })),
        },
        YEAR: {
            range: 'YEAR',
            data: buildCostBars(monthlyCost, 12,
                MONTHS.concat(['Apr', 'May', 'Jun']).slice(-12)),
        },
    };

    // ── Appliances page ───────────────────────────────────────────────────────
    const buildApplianceBars = (baseKwh) =>
        APPLIANCE_DIST.map((a, i) => ({
            name: a.name,
            electricity: vary(baseKwh * a.share, 0.10, i + 800),
            ...(i === APPLIANCE_DIST.length - 1 ? { predicted: true } : {}),
        }));

    const buildApplianceTimeSeries = (baseKwh, numPoints, labels) => {
        const timeSeries = {};
        APPLIANCE_DIST.forEach((a, aIdx) => {
            timeSeries[a.name] = labels.map((_, i) =>
                vary(baseKwh * a.share / numPoints, 0.15, i + a.share * 1000 + aIdx * 10)
            );
        });
        return {
            labels,
            data: timeSeries
        };
    };

    const getMonthDays = () => Array.from({ length: 30 }, (_, d) => {
        const dt = new Date(); dt.setDate(dt.getDate() - 29 + d);
        return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    });

    const appliancesData = {
        list: APPLIANCE_DIST.map(a => a.name),
        TODAY: {
            range: 'TODAY',
            data: buildApplianceBars(dailyKwh),
            timeSeries: buildApplianceTimeSeries(dailyKwh, 24, Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`))
        },
        MONTH: {
            range: 'MONTH',
            data: buildApplianceBars(monthlyKwh),
            timeSeries: buildApplianceTimeSeries(monthlyKwh, 30, getMonthDays())
        },
        YEAR: {
            range: 'YEAR',
            data: buildApplianceBars(monthlyKwh * 12),
            timeSeries: buildApplianceTimeSeries(monthlyKwh * 12, 12, MONTHS.concat(['Apr', 'May', 'Jun']).slice(-12))
        },
    };

    // ── Rooms page ────────────────────────────────────────────────────────────
    const buildRoomData = (baseKwh, numPoints, labels) => {
        const roomData = {};
        ROOM_DIST.forEach((rm, rIdx) => {
            const roomSeed = (rIdx + 1) * 137;   // unique prime-spaced seed per room
            roomData[rm.name] = labels.map((_, i) => {
                // High variance (0.45) + room-specific seed → full colour spread
                const raw = vary(baseKwh * rm.share / numPoints, 0.45, i + roomSeed + rm.share * 500);
                return Math.max(0, r(raw, 3));
            });
        });
        return {
            rooms: ROOM_DIST.map(r => r.name),
            range: '',
            labels,
            data: roomData,
        };
    };

    const rooms = {
        TODAY: { ...buildRoomData(dailyKwh, 24, Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`)), range: 'TODAY' },
        MONTH: { ...buildRoomData(monthlyKwh, 30, Array.from({ length: 30 }, (_, d) => { const dt = new Date(); dt.setDate(dt.getDate() - 29 + d); return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); })), range: 'MONTH' },
        YEAR: { ...buildRoomData(monthlyKwh * 12, 12, MONTHS.concat(['Apr', 'May', 'Jun']).slice(-12)), range: 'YEAR' },
    };

    // ── Profile / Settings / Devices / Notifications ──────────────────────────
    const profile = {
        name: 'kim jong un',
        initials: 'JK',
        role: 'Admin',
        email: 'kimjongun@smartenergy.io',
        phone: '+850 123 4567',
        location: 'Pyongyang, North Korea',
        memberSince: 'January 2025',
        lastLogin: new Date(timestamp).toLocaleString('en-IN'),
    };

    const settings = {
        language: 'English',
        currency: 'INR (₹)',
        notifications: { email: true, push: true, reports: true },
    };

    const devices = [
        { id: 1, name: device_id, type: 'ESP32 Energy Meter', status, lastActive: new Date(timestamp).toLocaleString('en-IN') },
        { id: 2, name: 'Smart Plug A', type: 'Smart Plug', status: 'inactive', lastActive: '2026-03-03 10:00' },
        { id: 3, name: 'Smart Plug B', type: 'Smart Plug', status: 'inactive', lastActive: '2026-03-02 08:30' },
    ];

    const notifications = [
        { id: 1, title: 'High Energy Consumption', desc: `Power usage hit ${r(power, 0)} W — above daily average.`, time: '2 min ago', unread: true },
        { id: 2, title: 'Device Online', desc: `${device_id} connected and streaming data.`, time: '5 min ago', unread: true },
        { id: 3, title: 'Monthly Report Ready', desc: `Your energy report for February is ready.`, time: '1 hr ago', unread: true },
        { id: 4, title: 'Power Factor Alert', desc: `PF is ${r(power_factor, 2)} — ${power_factor >= 0.9 ? 'healthy' : 'consider capacitor banks'}.`, time: '2 hrs ago', unread: false },
        { id: 5, title: 'Temperature Normal', desc: `Sensor temp is ${r(temperature, 1)} °C — within safe range.`, time: '3 hrs ago', unread: false },
        { id: 6, title: 'Billing Cycle Update', desc: `Projected bill this month: ₹${r(monthlyCost, 0)}.`, time: '1 day ago', unread: false },
    ];

    // ── Billing and Payment ───────────────────────────────────────────────────
    const bill = {
        invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        billingPeriod: `${new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        currentCharges: r(monthlyCost, 2),
        fixedCharges: 150.00,
        taxes: r(monthlyCost * 0.05, 2),
        totalDue: r(monthlyCost + 150.00 + monthlyCost * 0.05, 2),
        savings: r(Math.max(0, lastMonthCost - monthlyCost), 2),
        status: 'Unpaid',
        paymentHistory: [
            { id: 'PAY-892', date: '12 Feb 2026', amount: r(lastMonthCost + 150.0 + (lastMonthCost * 0.05), 2), method: 'Credit Card', status: 'Success' }
        ]
    };

    // ── Assemble full structure ───────────────────────────────────────────────
    return {
        generatedAt: new Date().toISOString(),
        esp32_raw: esp,
        customers: {
            'CUST-001': {
                dashboard: {
                    stats,
                    energyChart,
                    recentActivity,
                    costPredicted,
                    costChange,
                    usageEstimate,
                    activeAppliances,
                    energyIntensity,
                },
                analytics: {
                    peakUsageHours,
                    monthlyBreakdown,
                },
                cost: {
                    summary: costSummary,
                    chart: costChart,
                },
                appliances: appliancesData,
                rooms,
                profile,
                settings,
                devices,
                notifications,
                bill,
            },
        },
    };
}

module.exports = { process };
