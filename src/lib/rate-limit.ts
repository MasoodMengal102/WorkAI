/**
 * Infrastructure Protection Rate Limiter for WorkAI.
 * 
 * Protects against bot scrapers and API cost abuse.
 * Strictly adheres to Requirement 5, 31, 102, 103:
 * - Rate limits exist solely to protect server infrastructure.
 * - These are NOT monetization gates.
 * - Messages inform users about daily free protection limits,
 *   never asking to "Upgrade to Pro" or "Buy credits".
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryLimiter = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  message?: string;
}

export function checkRateLimit(
  identifier: string,
  limit = 20,
  windowSeconds = 86400 // default 24-hour rolling window
): RateLimitResult {
  if (process.env.RATE_LIMIT_ENABLED === "false") {
    return { allowed: true, limit, remaining: limit, resetSeconds: 0 };
  }

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const existing = memoryLimiter.get(identifier);

  if (!existing || now > existing.resetAt) {
    memoryLimiter.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetSeconds: windowSeconds,
    };
  }

  if (existing.count >= limit) {
    const resetSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetSeconds,
      message:
        "You've reached today's free usage infrastructure protection limit. To protect server capacity for everyone, please try again tomorrow or sign in for an expanded daily free allowance.",
    };
  }

  existing.count++;
  const resetSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return {
    allowed: true,
    limit,
    remaining: limit - existing.count,
    resetSeconds,
  };
}
