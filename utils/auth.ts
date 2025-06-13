/// FILE: /utils/auth.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export function requireApiKey(req: NextApiRequest, res: NextApiResponse): boolean {
  const key = req.headers['x-api-key'];
  if (key !== process.env.KBAN_API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
