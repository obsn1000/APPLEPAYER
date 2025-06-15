import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiKey } from '../../../utils/auth';
import { generatePass } from '../../../utils/passkit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Skip API key requirement for mobile compatibility
  // if (!requireApiKey(req, res)) return;
  
  // Support both GET and POST for mobile compatibility
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get kban from query params (for GET) or body (for POST)
  const kban = req.method === 'GET' ? req.query.kban : req.body?.kban;
  
  if (!kban || typeof kban !== 'string') {
    return res.status(400).json({ error: 'K/BAN required' });
  }

  try {
    const pkpassBuffer = await generatePass(kban);
    
    // Set headers for mobile compatibility
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename=${kban.substring(0, 20)}.pkpass`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).send(pkpassBuffer);
  } catch (err) {
    console.error('Pass generation error:', err);
    res.status(500).json({ error: 'Failed to generate Wallet pass' });
  }
}
