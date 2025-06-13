/// FILE: /pages/api/kban/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateKban } from '../../../utils/kban';
import { requireApiKey } from '../../../utils/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiKey(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();

  const kban = generateKban();
  res.status(200).json({ kban });
}

