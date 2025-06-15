/// FILE: /utils/auth.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Simple in-memory rate limiting implementation
// For production, use a more robust solution like Redis-based rate limiting
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore: Record<string, RateLimitRecord> = {};
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 100; // 100 requests per window

/**
 * Cleans up expired rate limit records
 * This should be called periodically to prevent memory leaks
 */
function cleanupRateLimitStore(): void {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}

// Run cleanup every hour
setInterval(cleanupRateLimitStore, 60 * 60 * 1000);

/**
 * Validates the API key in the request headers
 * 
 * @param {NextApiRequest} req - The Next.js API request object
 * @param {NextApiResponse} res - The Next.js API response object
 * @returns {boolean} True if the API key is valid, false otherwise
 */
export function requireApiKey(req: NextApiRequest, res: NextApiResponse): boolean {
  const key = req.headers['x-api-key'];
  if (key !== process.env.KBAN_API_KEY) {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid API key' });
    return false;
  }
  return true;
}

/**
 * Applies rate limiting to API requests
 * 
 * @param {NextApiRequest} req - The Next.js API request object
 * @param {NextApiResponse} res - The Next.js API response object
 * @returns {boolean} True if the request is within rate limits, false otherwise
 */
export function applyRateLimit(req: NextApiRequest, res: NextApiResponse): boolean {
  // Get client identifier (IP address or API key if available)
  const clientId = (req.headers['x-api-key'] as string) || 
                   req.headers['x-forwarded-for'] as string || 
                   req.socket.remoteAddress || 
                   'unknown';
  
  const now = Date.now();
  
  // Initialize or get existing rate limit record
  if (!rateLimitStore[clientId] || rateLimitStore[clientId].resetTime < now) {
    rateLimitStore[clientId] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    };
    return true;
  }
  
  // Increment count and check if over limit
  rateLimitStore[clientId].count++;
  
  if (rateLimitStore[clientId].count > RATE_LIMIT_MAX) {
    const resetTime = new Date(rateLimitStore[clientId].resetTime);
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', Math.floor(resetTime.getTime() / 1000).toString());
    res.status(429).json({ 
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again after ${resetTime.toISOString()}`
    });
    return false;
  }
  
  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
  res.setHeader('X-RateLimit-Remaining', (RATE_LIMIT_MAX - rateLimitStore[clientId].count).toString());
  res.setHeader('X-RateLimit-Reset', Math.floor(rateLimitStore[clientId].resetTime / 1000).toString());
  
  return true;
}
