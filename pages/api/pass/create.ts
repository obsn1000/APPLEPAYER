import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiKey } from '../../../utils/auth';
import { generatePass } from '../../../utils/passkit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiKey(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();

  const { kban } = req.body;
  if (!kban) return res.status(400).json({ error: 'K/BAN required' });

  try {
    const pkpassBuffer = await generatePass(kban);
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename=${kban}.pkpass`);
    res.status(200).send(pkpassBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate Wallet pass' });
  }
}
