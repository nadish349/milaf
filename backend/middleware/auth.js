export function authenticateBearer(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || '';
    const [, token] = authHeader.split(' ');
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

    // For now, we trust any non-empty token and attach minimal identity.
    // In production, verify JWT (e.g., Firebase Admin, custom JWT, etc.).
    req.user = { token };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}


