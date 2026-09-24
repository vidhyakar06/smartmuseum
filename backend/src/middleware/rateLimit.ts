import rateLimit from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 40, // limit each IP to 40 requests per windowMs
  message: {
    success: false,
    message: 'Too many AI inquiries generated. Please pause for a moment to absorb the artwork.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
