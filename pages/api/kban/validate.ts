/// FILE: /pages/api/kban/validate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { validateKban } from '../../../utils/kban';
import { requireApiKey } from '../../../utils/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiKey(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();

  const { kban } = req.body;
  const valid = validateKban(kban);
  res.status(200).json({ valid });
}

