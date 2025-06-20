/// FILE: /pages/api/validate-merchant.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { requireApiKey } from '../../utils/auth';

interface ApplePayValidationRequest {
  validationURL: string;
  displayName?: string;
}

interface ApplePayMerchantSession {
  epochTimestamp: number;
  expiresAt: number;
  merchantSessionIdentifier: string;
  nonce: string;
  merchantIdentifier: string;
  domainName: string;
  displayName: string;
  signature: string;
  operationalAnalyticsIdentifier: string;
  retries: number;
  pspId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Require API key for security
  if (!requireApiKey(req, res)) return;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { validationURL, displayName }: ApplePayValidationRequest = req.body;

  if (!validationURL) {
    return res.status(400).json({ error: 'validationURL is required' });
  }

  // Validate that the URL is from Apple
  if (!validationURL.startsWith('https://apple-pay-gateway') && 
      !validationURL.startsWith('https://cn-apple-pay-gateway')) {
    return res.status(400).json({ error: 'Invalid Apple Pay validation URL' });
  }

  try {
    // Load certificates
    const certPath = path.join(process.cwd(), 'certs', 'apple-pay-cert.pem');
    const keyPath = path.join(process.cwd(), 'certs', 'apple-pay-key.pem');
    
    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      console.error('Apple Pay certificates not found');
      return res.status(500).json({ error: 'Apple Pay certificates not configured' });
    }

    const cert = fs.readFileSync(certPath);
    const key = fs.readFileSync(keyPath);

    // Prepare the merchant validation payload
    const merchantIdentifier = process.env.MERCHANT_ID || 'merchant.APPLEPAYER';
    const domainName = process.env.INITIATIVE_CONTEXT || 'applepayer.vercel.app';
    const merchantDisplayName = displayName || process.env.MERCHANT_NAME || 'ApplePaySDK';

    const payload = JSON.stringify({
      merchantIdentifier,
      domainName,
      displayName: merchantDisplayName
    });

    // Create HTTPS agent with client certificates
    const agent = new https.Agent({
      cert: cert,
      key: key,
      passphrase: process.env.CERT_PASSPHRASE || undefined
    });

    // Make request to Apple Pay
    const merchantSession = await new Promise<ApplePayMerchantSession>((resolve, reject) => {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        agent: agent
      };

      const appleReq = https.request(validationURL, options, (appleRes) => {
        let data = '';
        
        appleRes.on('data', (chunk) => {
          data += chunk;
        });
        
        appleRes.on('end', () => {
          if (appleRes.statusCode === 200) {
            try {
              const merchantSession = JSON.parse(data);
              resolve(merchantSession);
            } catch (parseError) {
              reject(new Error('Invalid response from Apple Pay'));
            }
          } else {
            reject(new Error(`Apple Pay validation failed: ${appleRes.statusCode} ${data}`));
          }
        });
      });

      appleReq.on('error', (error) => {
        reject(error);
      });

      appleReq.write(payload);
      appleReq.end();
    });

    // Log successful validation for debugging
    console.log('Apple Pay merchant session validated successfully');
    
    res.status(200).json({ merchantSession });

  } catch (error) {
    console.error('Apple Pay validation error:', error);
    res.status(500).json({ 
      error: 'Merchant validation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}