import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiKey, applyRateLimit } from '../../utils/auth';
import { generatePass } from '../../utils/passkit';
import { validateKban } from '../../utils/kban';

/**
 * Creates an Apple Wallet pass for a given K/BAN code
 * 
 * @param {NextApiRequest} req - The Next.js API request object
 * @param {NextApiResponse} res - The Next.js API response object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Apply rate limiting
    if (!applyRateLimit(req, res)) return;
    
    // Check API key
    if (!requireApiKey(req, res)) return;
    
    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Extract and validate the K/BAN from the request body
    const { kban } = req.body;
    
    if (!kban) {
      return res.status(400).json({ error: 'K/BAN required' });
    }
    
    if (!validateKban(kban)) {
      return res.status(400).json({ error: 'Invalid K/BAN format' });
    }
    
    // Generate the pass
    const pkpassBuffer = await generatePass(kban);
    
    // Set response headers and send the pass
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename=${kban}.pkpass`);
    res.status(200).send(pkpassBuffer);
  } catch (error) {
    console.error('Error creating pass:', error);
    return res.status(500).json({ 
      error: 'Failed to generate Wallet pass',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
