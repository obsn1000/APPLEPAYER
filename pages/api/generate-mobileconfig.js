/**
 * Generates a mobile configuration file for iOS devices
 * This allows for easier configuration of Apple Pay settings
 * 
 * @param {NextApiRequest} req - The Next.js API request object
 * @param {NextApiResponse} res - The Next.js API response object
 */
export default function handler(req, res) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { deviceId, reapnetUrl, format } = req.query;
    const baseUrl = reapnetUrl || req.headers.host ? `https://${req.headers.host}` : 'https://applepayer.vercel.app';
    
    // If format=config is requested, serve the actual mobileconfig file
    if (format === 'config') {
      return serveMobileConfig(req, res, baseUrl, deviceId);
    }
    
    // Default: Return HTML with instructions instead of unsigned profile
    // This avoids signature validation issues in development
    const instructionHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ApplePaySDK - Mobile Setup</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                padding: 20px; 
                max-width: 500px; 
                margin: 0 auto;
                background: #f5f5f7;
            }
            .card {
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 16px;
            }
            .button {
                display: inline-block;
                background: #007AFF;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                text-align: center;
                font-weight: 500;
                margin: 8px 0;
                width: 100%;
                box-sizing: border-box;
            }
            .button.secondary {
                background: #34C759;
            }
            .step {
                margin: 12px 0;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #007AFF;
            }
            .emoji { font-size: 24px; margin-right: 8px; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1><span class="emoji">🍎</span>ApplePaySDK Mobile</h1>
            <p>Configure your iPhone for REAPNET Apple Pay integration:</p>
            
            <div class="step">
                <strong>Option 1:</strong> Add to Home Screen (Recommended)
                <br><small>Tap Share <span style="font-size: 18px;">⎘</span> → "Add to Home Screen"</small>
            </div>
            
            <div class="step">
                <strong>Option 2:</strong> Install Configuration Profile
                <br><small>For advanced users - requires certificate trust</small>
            </div>
            
            <a href="${baseUrl}" class="button">
                🚀 Open ApplePaySDK App
            </a>
            
            <a href="${baseUrl}/api/reapnet-config" class="button secondary">
                📱 Download REAPNET Config
            </a>
            
            <div style="margin-top: 20px; padding: 16px; background: #fff3cd; border-radius: 8px; font-size: 14px;">
                <strong>Note:</strong> Mobile configuration profiles require signing certificates for production use. 
                For development, using "Add to Home Screen" provides the same functionality.
            </div>
        </div>
        
        <script>
            // Auto-redirect to main app after 10 seconds
            setTimeout(() => {
                window.location.href = '${baseUrl}';
            }, 10000);
        </script>
    </body>
    </html>`;

    // Set HTML headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Send the instruction page
    res.status(200).send(instructionHTML);
    
  } catch (error) {
    console.error('Error generating mobile setup:', error);
    res.status(500).json({ 
      error: 'Failed to generate mobile setup',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Serve the actual mobile configuration file
 */
function serveMobileConfig(req, res, baseUrl, deviceId) {
  // Generate UUID for this configuration
  const configUUID = generateUUID();
  const webClipUUID = generateUUID();
  const restrictionsUUID = generateUUID();
  
  // Create the mobile configuration XML
  const mobileConfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadDisplayName</key>
  <string>ApplePaySDK Mobile Configuration</string>
  <key>PayloadDescription</key>
  <string>Configures iOS device for ApplePaySDK and REAPNET integration</string>
  <key>PayloadIdentifier</key>
  <string>com.applepaysdk.config</string>
  <key>PayloadOrganization</key>
  <string>ApplePaySDK</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>${configUUID}</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
  <key>PayloadContent</key>
  <array>
    <!-- Web Clip for ApplePaySDK App -->
    <dict>
      <key>PayloadType</key>
      <string>com.apple.webClip.managed</string>
      <key>PayloadIdentifier</key>
      <string>com.applepaysdk.webclip</string>
      <key>PayloadUUID</key>
      <string>${webClipUUID}</string>
      <key>PayloadDisplayName</key>
      <string>ApplePaySDK</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>URL</key>
      <string>${baseUrl}</string>
      <key>Label</key>
      <string>ApplePaySDK</string>
      <key>IsRemovable</key>
      <true/>
      <key>FullScreen</key>
      <true/>
      <key>Precomposed</key>
      <true/>
    </dict>
    
    <!-- Application Access Settings -->
    <dict>
      <key>PayloadType</key>
      <string>com.apple.applicationaccess</string>
      <key>PayloadIdentifier</key>
      <string>com.applepaysdk.appaccess</string>
      <key>PayloadUUID</key>
      <string>${restrictionsUUID}</string>
      <key>PayloadDisplayName</key>
      <string>ApplePaySDK App Access</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>allowAppInstallation</key>
      <true/>
      <key>allowUIAppInstallation</key>
      <true/>
      <key>allowAppRemoval</key>
      <true/>
      <key>allowWalletAppInstallation</key>
      <true/>
      <key>allowPassbookRemoval</key>
      <true/>
      <key>allowApplePaySetup</key>
      <true/>
    </dict>
  </array>
  
  <!-- Custom properties for ApplePaySDK -->
  <key>ApplePaySDKConfiguration</key>
  <dict>
    <key>Version</key>
    <string>1.0</string>
    <key>ConfiguredAt</key>
    <string>${new Date().toISOString()}</string>
    <key>BaseURL</key>
    <string>${baseUrl}</string>
    ${deviceId ? `<key>DeviceID</key><string>${deviceId}</string>` : ''}
    <key>Features</key>
    <array>
      <string>ApplePay</string>
      <string>WalletPasses</string>
      <string>WebClip</string>
      <string>REAPNETIntegration</string>
    </array>
  </dict>
</dict>
</plist>`;

  // Set appropriate headers for .mobileconfig file
  res.setHeader('Content-Type', 'application/x-apple-aspen-config');
  res.setHeader('Content-Disposition', 'attachment; filename="applepaysdk-config.mobileconfig"');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Send the configuration
  res.status(200).send(mobileConfig);
}

/**
 * Generate a UUID for the mobile configuration
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}