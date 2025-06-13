/// FILE: /pages/api/kban/assign.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiKey } from '../../../utils/auth';
import { kbanStore } from '../../../utils/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiKey(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();

  const { kban, assigned_to } = req.body;
  const existing = kbanStore.get(kban);
  if (!existing) return res.status(404).json({ error: 'K/BAN not found' });

  kbanStore.set(kban, { ...existing, assigned_to });
  res.status(200).json({ success: true, message: 'K/BAN assigned.' });
}

