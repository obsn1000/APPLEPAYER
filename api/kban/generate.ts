import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiKey, applyRateLimit } from '../../utils/auth';
import { generateKban } from '../../utils/kban';

/**
 * Generates a new K/BAN code
 * 
 * @param {NextApiRequest} req - The Next.js API request object
 * @param {NextApiResponse} res - The Next.js API response object
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Apply rate limiting
    if (!applyRateLimit(req, res)) return;
    
    // Check API key
    if (!requireApiKey(req, res)) return;
    
    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Generate a new K/BAN code
    const kban = generateKban();
    
    // Log the generation (in production, consider storing in a database)
    console.log(`Generated K/BAN: ${kban}`);
    
    // Return the generated K/BAN
    return res.status(200).json({ 
      kban,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating K/BAN:', error);
    return res.status(500).json({ 
      error: 'Failed to generate K/BAN',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
