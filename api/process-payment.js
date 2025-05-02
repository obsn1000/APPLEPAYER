import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { token } = req.body;

  try {
    // Just log the token for now — we’ll decrypt later
    console.log('🔐 Received payment token:', JSON.stringify(token, null, 2));

    res.status(200).json({ status: 'ok', message: 'Token received' });
  } catch (err) {
    console.error('❌ Error handling token:', err);
    res.status(500).json({ error: 'Failed to process token' });
  }
}
