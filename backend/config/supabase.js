require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

let supabase = null;

if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('[System] Supabase client initialized');

    // Auto-flush data older than 10 seconds every 10 seconds
    setInterval(async () => {
        try {
            const tenSecondsAgo = Date.now() - 10000;
            const { error } = await supabase
                .from('realtime_energy')
                .delete()
                .lt('timestamp', tenSecondsAgo);
            if (error) console.error('[Supabase Flush Error]:', error);
        } catch (e) {
            console.error('[Supabase Flush Exception]:', e);
        }
    }, 10000);
} else {
    console.log('[System] Missing SUPABASE_URL or SUPABASE_KEY. Skipping Supabase DB operations.');
}

module.exports = supabase;
