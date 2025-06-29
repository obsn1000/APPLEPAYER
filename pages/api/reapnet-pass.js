import { generatePass } from '../../utils/passkit';

/**
 * Generates a REAPNET-specific Apple Wallet pass
 * This integrates with the REAPNET desktop application
 * 
 * @param {NextApiRequest} req - The Next.js API request object
 * @param {NextApiResponse} res - The Next.js API response object
 */
export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { kban, deviceId, reapnetId } = req.body;

    // Validate required fields
    if (!kban) {
      return res.status(400).json({ error: 'K/BAN is required' });
    }

    // Generate a REAPNET-specific pass
    const passBuffer = await generateReapnetPass(kban, deviceId, reapnetId);

    // Set appropriate headers for .pkpass file
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename="reapnet-${kban}.pkpass"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // Send the pass
    res.status(200).send(passBuffer);
    
  } catch (error) {
    console.error('Error generating REAPNET pass:', error);
    res.status(500).json({ 
      error: 'Failed to generate REAPNET pass',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Generates a REAPNET-specific Apple Wallet pass
 * 
 * @param {string} kban - The K/BAN code
 * @param {string} deviceId - Optional device identifier
 * @param {string} reapnetId - Optional REAPNET session identifier
 * @returns {Promise<Buffer>} The generated .pkpass file as a Buffer
 */
async function generateReapnetPass(kban, deviceId = null, reapnetId = null) {
  const Passbook = require('passbook');
  const fs = require('fs');
  const path = require('path');

  // Load certificates
  const certPath = path.resolve('./certs');
  const template = new Passbook({
    model: path.join(process.cwd(), 'assets/reapnet-pass.json'),
    certificates: {
      wwdr: fs.readFileSync(path.join(certPath, 'wwdr.pem')),
      signerCert: fs.readFileSync(path.join(certPath, 'signingCert.pem')),
      signerKey: fs.readFileSync(path.join(certPath, 'signingKey.pem'))
    }
  });

  // Create unique serial number
  const serialNumber = `reapnet-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  
  // Create the pass with REAPNET desktop app branding
  const pass = template.createPass({
    serialNumber,
    description: 'REAPNET Desktop Integration Pass',
    organizationName: 'REAPNET',
    logoText: 'REAPNET',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(33, 150, 243)', // REAPNET blue
    generic: {
      primaryFields: [{ 
        key: 'kban', 
        label: 'K/BAN CODE', 
        value: kban,
        textAlignment: 'PKTextAlignmentCenter'
      }],
      secondaryFields: [
        { 
          key: 'created', 
          label: 'CREATED', 
          value: new Date().toLocaleDateString(),
          dateStyle: 'PKDateStyleShort',
          timeStyle: 'PKDateStyleShort'
        },
        { 
          key: 'source', 
          label: 'SOURCE', 
          value: 'REAPNET DESKTOP' 
        }
      ],
      auxiliaryFields: [
        { 
          key: 'status', 
          label: 'STATUS', 
          value: 'ACTIVE' 
        },
        { 
          key: 'version', 
          label: 'VERSION', 
          value: '2.0.4' 
        },
        ...(deviceId ? [{ 
          key: 'device', 
          label: 'DEVICE', 
          value: deviceId.substring(0, 8) + '...' 
        }] : [])
      ],
      backFields: [
        {
          key: 'instructions',
          label: 'INSTRUCTIONS',
          value: 'This pass was generated by REAPNET desktop application. Use it with Apple Pay enabled applications and services.'
        },
        {
          key: 'support',
          label: 'SUPPORT',
          value: 'For support, refer to REAPNET desktop application documentation.'
        },
        {
          key: 'integration',
          label: 'INTEGRATION',
          value: 'This pass integrates with REAPNET desktop app running on localhost:3000'
        },
        {
          key: 'compatibility',
          label: 'COMPATIBILITY',
          value: 'Compatible with REAPNET v2.0.4 and Apple Pay SDK integration'
        },
        {
          key: 'features',
          label: 'FEATURES',
          value: 'Apple Pay, Wallet Passes, K/BAN Generation, Mobile Integration, Desktop Sync'
        }
      ]
    },
    // Add QR code with REAPNET desktop app data
    barcode: {
      message: JSON.stringify({
        kban: kban,
        source: 'reapnet-desktop',
        version: '2.0.4',
        platform: 'linux',
        deviceId: deviceId,
        reapnetId: reapnetId,
        integrationUrl: 'http://localhost:3000',
        timestamp: Date.now(),
        appName: 'reapnet-nativefier-bae6c8'
      }),
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1',
      altText: `REAPNET Desktop: ${kban}`
    },
    // Add web service URLs for pass updates
    webServiceURL: 'http://localhost:3000/api/pass',
    authenticationToken: generateAuthToken(kban, serialNumber),
    // Additional REAPNET desktop integration metadata
    appLaunchURL: 'http://localhost:3000',
    userInfo: {
      source: 'reapnet-desktop',
      version: '2.0.4',
      platform: 'linux',
      integration: 'applepayer',
      desktopAppVersion: 'reapnet-nativefier-bae6c8',
      configuredAt: new Date().toISOString(),
      features: [
        'ApplePay',
        'WalletPasses', 
        'KBANGeneration',
        'MobileIntegration',
        'DesktopSync'
      ],
      supportedPlatforms: [
        'iOS',
        'Linux',
        'Electron'
      ]
    },
    relevantDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toISOString() // 1 year from now
  });

  return await pass.generate();
}

/**
 * Generate authentication token for pass updates
 */
function generateAuthToken(kban, serialNumber) {
  const crypto = require('crypto');
  const secret = process.env.PASS_AUTH_SECRET || 'reapnet-default-secret';
  return crypto.createHmac('sha256', secret)
    .update(`${kban}-${serialNumber}`)
    .digest('hex');
}