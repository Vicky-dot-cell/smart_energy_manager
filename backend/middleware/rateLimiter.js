const { Ratelimit } = require('@upstash/ratelimit');
const redis = require('../config/upstash');

// Memory fallback to ensure app continues to function if Upstash is not configured
const fallbackMemory = new Map();

let ratelimit = null;

if (redis) {
    // 100 requests per 1 minute window
    ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(100, "60 s"),
        analytics: true,
    });
}

const rateLimiter = async (req, res, next) => {
    // Identify user by consumer_id from request, fallback to IP address
    let identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "anonymous";

    // In our smart energy app, consumers often use generic API calls, but we can look for CID if provided
    if (req.params.cid) identifier = req.params.cid;
    if (req.body && req.body.consumer_id) identifier = req.body.consumer_id;

    if (ratelimit) {
        try {
            const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
            res.setHeader('X-RateLimit-Limit', limit);
            res.setHeader('X-RateLimit-Remaining', remaining);
            res.setHeader('X-RateLimit-Reset', reset);

            if (!success) {
                return res.status(429).json({ error: 'Too Many Requests from this IP/User, please try again later.' });
            }
        } catch (error) {
            console.error('[RateLimit Error]', error);
            // If upstash errors out, allow traffic anyway (fail open)
        }
    } else {
        // Simple memory fallback (optional naive implementation)
        const now = Date.now();
        const requestData = fallbackMemory.get(identifier) || { count: 0, resetAt: now + 60000 };

        if (now > requestData.resetAt) {
            requestData.count = 0;
            requestData.resetAt = now + 60000;
        }

        requestData.count++;
        fallbackMemory.set(identifier, requestData);

        if (requestData.count > 100) {
            return res.status(429).json({ error: 'Too Many Requests (Local Memory Cap)' });
        }
    }

    next();
};

module.exports = rateLimiter;
