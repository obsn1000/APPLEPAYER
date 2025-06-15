import fs from 'fs';
import path from 'path';
import https from 'https';
import { applyRateLimit } from '../utils/auth';

// Load certificates once at module level
const CERTS = {
  cert: fs.readFileSync(path.resolve('certs/apple-pay-cert.pem')),
  key: fs.readFileSync(path.resolve('certs/apple-pay-key.pem')),
  ca: fs.readFileSync(path.resolve('certs/apple-root-ca.pem')),
};

// Get merchant configuration from environment variables or use defaults
const MERCHANT_ID = process.env.MERCHANT_ID || 'merchant.APPLEPAYER';
const MERCHANT_NAME = process.env.MERCHANT_NAME || 'APPLEPAYER';
const INITIATIVE_CONTEXT = process.env.INITIATIVE_CONTEXT || 'reapwareapi.cc';

/**
 * Validates an Apple Pay merchant session
 * 
 * @param {NextApiRequest} req - The Next.js API request object
 * @param {NextApiResponse} res - The Next.js API response object
 */
export default async function handler(req, res) {
  // Apply rate limiting
  if (!applyRateLimit(req, res)) return;
  
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Parse request body
    let validationURL;
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      validationURL = body.validationURL;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    
    // Validate required parameters
    if (!validationURL) {
      return res.status(400).json({ error: 'Missing validationURL parameter' });
    }
    
    // Prepare data for Apple Pay validation
    const postData = JSON.stringify({
      merchantIdentifier: MERCHANT_ID,
      displayName: MERCHANT_NAME,
      initiative: 'web',
      initiativeContext: INITIATIVE_CONTEXT
    });
    
    // Parse the validation URL
    let hostname, pathname;
    try {
      const url = new URL(validationURL);
      hostname = url.hostname;
      pathname = url.pathname;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid validationURL format' });
    }
    
    // Create a promise to handle the HTTPS request
    const validateMerchant = new Promise((resolve, reject) => {
      const request = https.request({
        hostname,
        path: pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
        cert: CERTS.cert,
        key: CERTS.key,
        ca: CERTS.ca,
      }, (appleRes) => {
        // Check for successful status code
        if (appleRes.statusCode < 200 || appleRes.statusCode >= 300) {
          return reject(new Error(`Apple Pay validation failed with status ${appleRes.statusCode}`));
        }
        
        // Collect response data
        let data = '';
        appleRes.on('data', chunk => data += chunk);
        appleRes.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error('Failed to parse Apple Pay validation response'));
          }
        });
      });
      
      // Handle request errors
      request.on('error', (err) => {
        reject(err);
      });
      
      // Send the request
      request.write(postData);
      request.end();
    });
    
    // Wait for the validation result
    const merchantSession = await validateMerchant;
    return res.status(200).json(merchantSession);
    
  } catch (error) {
    console.error('Merchant validation error:', error);
    return res.status(500).json({ 
      error: 'Merchant validation failed',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
