/**
 * server.js
 * Smart Energy Meter — Express Backend
 * Port 4000 | CORS enabled for frontend at localhost:3000
 *
 * Endpoints mirror smart_energy/frontend/lib/api.ts exactly.
 *
 * Data flow:
 *   ESP32 ──POST /ingest──► processor.js ──► data/frontend_data.json
 *   Frontend GET requests ◄─── reads frontend_data.json
 */

'use strict';

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const processor = require('./processor');

// ─── Paths ─────────────────────────────────────────────────────────────────

const RAW_PATH = path.join(__dirname, 'data', 'esp32_raw.json');
const DERIVED_PATH = path.join(__dirname, 'data', 'frontend_data.json');
const USERS_PATH = path.join(__dirname, 'data', 'users.json');

// ─── Bootstrap: derive frontend data from seed file ────────────────────────

function readUsers() {
    try {
        return JSON.parse(fs.readFileSync(USERS_PATH, 'utf8')).users;
    } catch (e) {
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(USERS_PATH, JSON.stringify({ users }, null, 2));
}

function rebuildDerived() {
    const raw = JSON.parse(fs.readFileSync(RAW_PATH, 'utf8'));
    const derived = processor.process(raw);
    fs.writeFileSync(DERIVED_PATH, JSON.stringify(derived, null, 2));
    return derived;
}

// Build on startup
let store = rebuildDerived();
console.log(`[startup] Processed esp32_raw.json → frontend_data.json`);

// Helper: get customer slice (throws 404-style error if not found)
function getCustomer(cid) {
    const cust = store.customers[cid];
    if (!cust) throw Object.assign(new Error(`Customer ${cid} not found`), { status: 404 });
    return cust;
}

// ─── App ────────────────────────────────────────────────────────────────────

const app = express();

app.use(cors());
app.use(express.json());

// ── Auth Routes ──────────────────────────────────────────────────────────────

app.post('/auth/login', (req, res) => {
    const { consumer_id, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.consumer_id === consumer_id && u.password === password);

    if (user) {
        // Generate a simple dummy token, but mostly rely on the frontend storing consumer_id
        res.json({ token: Buffer.from(consumer_id).toString('base64'), consumer_id: user.consumer_id, name: user.name });
    } else {
        res.status(401).json({ error: 'Invalid Consumer ID or Password' });
    }
});

app.post('/auth/signup', (req, res) => {
    const { consumer_id, password } = req.body;
    if (!consumer_id || !password) {
        return res.status(400).json({ error: 'Consumer ID and Password are required' });
    }

    const users = readUsers();
    if (users.find(u => u.consumer_id === consumer_id)) {
        return res.status(400).json({ error: 'Consumer ID already exists' });
    }

    const newUser = { consumer_id, password, name: 'New User' };
    users.push(newUser);
    writeUsers(users);

    // Auto-initialize frontend data placeholder for the new user if they don't exist
    if (!store.customers[consumer_id]) {
        // Clone CUST-001's structure for the new user as a baseline placeholder
        store.customers[consumer_id] = JSON.parse(JSON.stringify(store.customers['CUST-001']));
        store.customers[consumer_id].profile.name = 'New User';
        store.customers[consumer_id].profile.initials = 'NU';
        fs.writeFileSync(DERIVED_PATH, JSON.stringify(store, null, 2));
    }

    res.json({ token: Buffer.from(consumer_id).toString('base64'), consumer_id, name: 'New User' });
});

app.post('/auth/reset-password', (req, res) => {
    const { consumer_id, new_password } = req.body;
    if (!consumer_id || !new_password) {
        return res.status(400).json({ error: 'Consumer ID and new password are required' });
    }

    const users = readUsers();
    const userIndex = users.findIndex(u => u.consumer_id === consumer_id);

    if (userIndex !== -1) {
        users[userIndex].password = new_password;
        writeUsers(users);
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(404).json({ error: 'Consumer ID not found' });
    }
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        generatedAt: store.generatedAt,
        device: store.esp32_raw?.device_id ?? 'unknown',
    });
});

// ── ESP32 ingest ──────────────────────────────────────────────────────────────
/**
 * POST /ingest
 * Body: ESP32 JSON payload
 * Re-derives all frontend data and persists both raw + derived files.
 */
app.post('/ingest', (req, res) => {
    const payload = req.body;

    // Basic validation
    const required = ['device_id', 'voltage', 'current', 'power', 'energy', 'frequency', 'power_factor', 'temperature', 'status'];
    const missing = required.filter(k => payload[k] === undefined);
    if (missing.length) {
        return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    }

    // Add timestamp if absent
    if (!payload.timestamp) payload.timestamp = new Date().toISOString();

    // Persist raw
    fs.writeFileSync(RAW_PATH, JSON.stringify(payload, null, 2));

    // Re-derive and persist
    store = processor.process(payload);
    fs.writeFileSync(DERIVED_PATH, JSON.stringify(store, null, 2));

    console.log(`[ingest] ${payload.device_id} @ ${payload.timestamp} — P=${payload.power}W`);
    res.json({ ok: true, generatedAt: store.generatedAt });
});

// ── Dashboard routes ──────────────────────────────────────────────────────────

app.get('/customers/:cid/dashboard/stats', (req, res) => {
    try { res.json(getCustomer(req.params.cid).dashboard.stats); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

app.get('/customers/:cid/dashboard/energy-chart', (req, res) => {
    try {
        const range = (req.query.range || 'TODAY').toUpperCase();
        const chart = getCustomer(req.params.cid).dashboard.energyChart;
        res.json(chart[range] ?? chart['TODAY']);
    } catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

app.get('/customers/:cid/dashboard/recent-activity', (req, res) => {
    try { res.json(getCustomer(req.params.cid).dashboard.recentActivity); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

app.get('/customers/:cid/dashboard/cost-predicted', (req, res) => {
    try { res.json(getCustomer(req.params.cid).dashboard.costPredicted); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

app.get('/customers/:cid/dashboard/cost-change', (req, res) => {
    try { res.json(getCustomer(req.params.cid).dashboard.costChange); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

app.get('/customers/:cid/dashboard/usage-estimate', (req, res) => {
    try { res.json(getCustomer(req.params.cid).dashboard.usageEstimate); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

app.get('/customers/:cid/dashboard/active-appliances', (req, res) => {
    try { res.json(getCustomer(req.params.cid).dashboard.activeAppliances); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

app.get('/customers/:cid/dashboard/energy-intensity', (req, res) => {
    try { res.json(getCustomer(req.params.cid).dashboard.energyIntensity); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

// ── Analytics ─────────────────────────────────────────────────────────────────

app.get('/customers/:cid/analytics', (req, res) => {
    try { res.json(getCustomer(req.params.cid).analytics); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

// ── Cost ──────────────────────────────────────────────────────────────────────

app.get('/customers/:cid/cost', (req, res) => {
    try {
        const range = (req.query.range || 'TODAY').toUpperCase();
        const c = getCustomer(req.params.cid).cost;
        res.json({ summary: c.summary, chart: c.chart[range] ?? c.chart['TODAY'] });
    } catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

// ── Appliances ────────────────────────────────────────────────────────────────

app.get('/customers/:cid/appliances', (req, res) => {
    try {
        const range = (req.query.range || 'TODAY').toUpperCase();
        const a = getCustomer(req.params.cid).appliances;
        res.json({ list: a.list, ...(a[range] ?? a['TODAY']) });
    } catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

// ── Rooms ─────────────────────────────────────────────────────────────────────

app.get('/customers/:cid/rooms', (req, res) => {
    try {
        const range = (req.query.range || 'TODAY').toUpperCase();
        const rms = getCustomer(req.params.cid).rooms;
        res.json(rms[range] ?? rms['TODAY']);
    } catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

// ── Profile / Settings / Devices / Notifications ──────────────────────────────

app.get('/customers/:cid/profile', (req, res) => {
    try { res.json(getCustomer(req.params.cid).profile); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

app.get('/customers/:cid/settings', (req, res) => {
    try { res.json(getCustomer(req.params.cid).settings); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

app.get('/customers/:cid/devices', (req, res) => {
    try { res.json(getCustomer(req.params.cid).devices); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

app.get('/customers/:cid/notifications', (req, res) => {
    try { res.json(getCustomer(req.params.cid).notifications); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

// ── Billing and Payment ───────────────────────────────────────────────────────

app.get('/customers/:cid/bill', (req, res) => {
    try { res.json(getCustomer(req.params.cid).bill); }
    catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

app.post('/customers/:cid/pay', (req, res) => {
    try {
        const { amount, method } = req.body;
        const cid = req.params.cid;
        const cust = getCustomer(cid);

        if (cust.bill.status === 'Paid') {
            return res.status(400).json({ error: 'Bill is already paid' });
        }

        // Simulating processing delay without blocking Event Loop entirely but keeping it simple
        cust.bill.status = 'Paid';
        cust.bill.paymentHistory.unshift({
            id: `PAY-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            amount: amount,
            method: method || 'Unknown',
            status: 'Success'
        });

        // Commit changes to disk
        fs.writeFileSync(DERIVED_PATH, JSON.stringify(store, null, 2));
        res.json({ success: true, message: 'Payment processed successfully', newStatus: 'Paid' });
    } catch (e) { res.status(e.status ?? 500).json({ error: e.message }); }
});

// ── 404 catch-all ─────────────────────────────────────────────────────────────

app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`\n🟢  Smart Energy Backend running on http://localhost:${PORT}`);
    console.log(`    POST http://localhost:${PORT}/ingest  ← ESP32 sends data here`);
    console.log(`    GET  http://localhost:${PORT}/customers/CUST-001/dashboard/stats`);
    console.log(`    GET  http://localhost:${PORT}/health\n`);
});
