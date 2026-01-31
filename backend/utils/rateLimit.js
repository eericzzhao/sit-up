// Simple in-memory rate limiter
// For production, consider using Redis-based rate limiting

const rateLimitMap = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitMap.entries()) {
    if (now - data.resetTime > 60000) {
      // Remove entries older than 1 minute
      rateLimitMap.delete(key);
    }
  }
}, 300000);

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60000; // 1 minute window
  const maxRequests = 60; // 60 requests per minute

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return next();
  }

  const userData = rateLimitMap.get(ip);

  // Reset if window has passed
  if (now > userData.resetTime) {
    userData.count = 1;
    userData.resetTime = now + windowMs;
    return next();
  }

  // Increment counter
  userData.count++;

  // Check if limit exceeded
  if (userData.count > maxRequests) {
    return res.status(429).json({
      error: "Too many requests",
      retryAfter: Math.ceil((userData.resetTime - now) / 1000),
    });
  }

  next();
};

module.exports = rateLimit;
