/**
 * Sliding window rate limiting & abuse prevention utility.
 * Protects against brute-force attacks, endpoint flooding, and unauthorized overuse.
 */

interface RateLimitEntry {
  timestamps: number[];
}

class MemoryRateLimiter {
  private cache = new Map<string, RateLimitEntry>();
  private readonly cleanupInterval: number = 60000; // 1 minute cleanup

  constructor() {
    // Periodically remove stale entries
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), this.cleanupInterval).unref?.();
    }
  }

  /**
   * Checks if an action is permitted under rate limit constraints.
   * @param key Unique identifier (e.g. IP, userId, or email)
   * @param limit Max allowed attempts in the window
   * @param windowMs Window duration in milliseconds
   * @returns { allowed: boolean, remaining: number, resetMs: number }
   */
  check(
    key: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    const windowStart = now - windowMs;

    let entry = this.cache.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      this.cache.set(key, entry);
    }

    // Filter out timestamps outside the current window
    entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

    if (entry.timestamps.length >= limit) {
      const oldest = entry.timestamps[0];
      const resetMs = oldest ? oldest + windowMs - now : windowMs;
      return { allowed: false, remaining: 0, resetMs: Math.max(resetMs, 0) };
    }

    // Record the current attempt
    entry.timestamps.push(now);
    const remaining = limit - entry.timestamps.length;
    return { allowed: true, remaining, resetMs: windowMs };
  }

  /**
   * Resets rate limit for a key (e.g. after a successful login)
   */
  reset(key: string): void {
    this.cache.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < 3600000); // 1 hour max
      if (entry.timestamps.length === 0) {
        this.cache.delete(key);
      }
    }
  }
}

// Global singleton instance
export const rateLimiter = new MemoryRateLimiter();

// Pre-configured rate limits
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: { limit: 5, windowMs: 15 * 60 * 1000 },      // 5 attempts per 15 minutes
  PASSWORD_RESET: { limit: 3, windowMs: 30 * 60 * 1000 },      // 3 attempts per 30 minutes
  WAITLIST_SUBMISSIONS: { limit: 5, windowMs: 10 * 60 * 1000 }, // 5 submissions per 10 minutes
  SIMULATION_RUNS: { limit: 10, windowMs: 60 * 60 * 1000 },     // 10 simulations per hour per user
  PROJECT_CREATIONS: { limit: 15, windowMs: 60 * 60 * 1000 },   // 15 projects per hour per user
};

/**
 * Extracts client IP safely from Next.js request headers.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}
