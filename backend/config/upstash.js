require('dotenv').config();
const { Redis } = require('@upstash/redis');

let redis = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('[System] Upstash Redis client initialized');
} else {
    console.log('[System] Missing UPSTASH_REDIS vars. Rate limiting will run in fallback memory mode.');
}

module.exports = redis;
