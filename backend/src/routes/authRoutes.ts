import { Router, Request, Response } from 'express';

const router = Router();

router.post('/login', (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required' });
    return;
  }

  const configuredEmail = process.env.ADMIN_EMAIL?.trim();
  const configuredPassword = process.env.ADMIN_PASSWORD?.trim();

  // If specific admin credentials configured in .env, enforce them
  if (configuredEmail && configuredPassword) {
    if (email.trim().toLowerCase() !== configuredEmail.toLowerCase() || password !== configuredPassword) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }
  }

  // Successfully authenticate admin
  const displayName = email.split('@')[0];
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1) + ' (Admin)';

  res.json({
    success: true,
    token: `auth-jwt-token-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    user: {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: formattedName,
      email: email.trim(),
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  });
});

export default router;
