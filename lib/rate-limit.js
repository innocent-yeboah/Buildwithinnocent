/**
 * Sliding-window rate limiter (in-process).
 * On multi-instance/serverless deployments each instance has its own window;
 * combine with a shared store (e.g. Redis) or edge firewall for strict limits.
 */
const buckets = new Map();

const MAX_KEYS = 10_000;

function pruneKeys(now, windowMs) {
  if (buckets.size <= MAX_KEYS) return;
  const cutoff = now - windowMs;
  for (const [key, times] of buckets) {
    while (times.length && times[0] < cutoff) times.shift();
    if (times.length === 0) buckets.delete(key);
  }
}

export function rateLimit(key, { limit = 8, windowMs = 60_000 } = {}) {
  const now = Date.now();
  pruneKeys(now, windowMs);

  let times = buckets.get(key);
  if (!times) {
    times = [];
    buckets.set(key, times);
  }

  const cutoff = now - windowMs;
  while (times.length && times[0] < cutoff) times.shift();

  if (times.length >= limit) {
    const retryAfterMs = Math.max(0, times[0] + windowMs - now);
    return { success: false, retryAfterMs };
  }

  times.push(now);
  return { success: true };
}
