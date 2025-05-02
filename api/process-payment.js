import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const { token } = JSON.parse(body);

      console.log('🔐 Received payment token:', JSON.stringify(token, null, 2));

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'ok', message: 'Token received' }));
    } catch (err) {
      console.error('❌ Error parsing token:', err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to parse token' }));
    }
  });
}
