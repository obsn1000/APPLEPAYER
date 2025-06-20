/**
 * Generates a REAPNET-specific mobile configuration file
 * This configures iOS devices to work optimally with REAPNET
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

    const { deviceId, reapnetUrl } = req.query;
    const baseUrl = reapnetUrl || req.headers.host ? `http://${req.headers.host}` : 'http://localhost:3000';
    
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
  <string>REAPNET Mobile Configuration</string>
  <key>PayloadDescription</key>
  <string>Configures iOS device for REAPNET desktop application integration with Apple Pay and wallet pass management</string>
  <key>PayloadIdentifier</key>
  <string>com.reapnet.mobile.config</string>
  <key>PayloadOrganization</key>
  <string>REAPNET</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>REAPNET-MOBILE-CONFIG-2024</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
  <key>PayloadContent</key>
  <array>
    <!-- Web Clip for REAPNET App -->
    <dict>
      <key>PayloadType</key>
      <string>com.apple.webClip.managed</string>
      <key>PayloadIdentifier</key>
      <string>com.reapnet.webclip.main</string>
      <key>PayloadUUID</key>
      <string>REAPNET-WEBCLIP-MAIN-2024</string>
      <key>PayloadDisplayName</key>
      <string>REAPNET Mobile</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>URL</key>
      <string>${baseUrl}</string>
      <key>Label</key>
      <string>REAPNET</string>
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
      <string>com.reapnet.appaccess</string>
      <key>PayloadUUID</key>
      <string>${restrictionsUUID}</string>
      <key>PayloadDisplayName</key>
      <string>REAPNET App Access</string>
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
    
    <!-- Safari Settings for REAPNET -->
    <dict>
      <key>PayloadType</key>
      <string>com.apple.Safari</string>
      <key>PayloadIdentifier</key>
      <string>com.reapnet.safari</string>
      <key>PayloadUUID</key>
      <string>${generateUUID()}</string>
      <key>PayloadDisplayName</key>
      <string>REAPNET Safari Settings</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>AutoFillPasswords</key>
      <true/>
      <key>AutoFillCreditCardData</key>
      <true/>
      <key>SafariAllowAutoFill</key>
      <true/>
      <key>SafariAllowJavaScript</key>
      <true/>
      <key>SafariAllowPopups</key>
      <false/>
      <key>SafariAcceptCookies</key>
      <integer>2</integer>
    </dict>
  </array>
  
  <!-- Custom properties for REAPNET -->
  <key>ReapnetConfiguration</key>
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
      <string>MobileOptimized</string>
    </array>
  </dict>
</dict>
</plist>`;

    // Set appropriate headers for .mobileconfig file
    res.setHeader('Content-Type', 'application/x-apple-aspen-config');
    res.setHeader('Content-Disposition', 'attachment; filename="reapnet-config.mobileconfig"');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Send the configuration
    res.status(200).send(mobileConfig);
    
  } catch (error) {
    console.error('Error generating REAPNET mobile config:', error);
    res.status(500).json({ 
      error: 'Failed to generate REAPNET mobile configuration',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
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