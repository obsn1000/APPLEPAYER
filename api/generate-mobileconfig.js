import { v4 as uuidv4 } from 'uuid';
import { requireApiKey, applyRateLimit } from '../utils/auth';

/**
 * Generates a mobile configuration file for iOS devices
 * 
 * @param {NextApiRequest} req - The Next.js API request object
 * @param {NextApiResponse} res - The Next.js API response object
 */
export default function handler(req, res) {
  // Apply rate limiting
  if (!applyRateLimit(req, res)) return;
  
  // Generate unique UUIDs for the configuration
  const payloadUUID = uuidv4();
  const contentUUID = uuidv4();
  
  // Get organization info from environment variables or use placeholders
  const orgName = process.env.ORGANIZATION_NAME || 'APPLEPAYER';
  const orgDomain = process.env.ORGANIZATION_DOMAIN || 'example.com';
  const configName = process.env.CONFIG_NAME || 'APPLEPAYER Configuration';
  
  const mobileConfig = `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <dict>
    <key>PayloadContent</key>
    <array>
      <dict>
        <key>EmailAccountType</key>
        <string>EmailTypeIMAP</string>
        <key>EmailAddress</key>
        <string>REPLACE_WITH_YOUR_EMAIL@${orgDomain}</string>
        <key>IncomingMailServerAuthentication</key>
        <string>EmailAuthPassword</string>
        <key>IncomingMailServerHostName</key>
        <string>imap.${orgDomain}</string>
        <key>IncomingMailServerPortNumber</key>
        <integer>993</integer>
        <key>IncomingMailServerUseSSL</key>
        <true/>
        <key>IncomingMailServerUsername</key>
        <string>REPLACE_WITH_YOUR_USERNAME</string>
        <key>IncomingPassword</key>
        <string>REPLACE_WITH_YOUR_PASSWORD</string>
        <key>OutgoingMailServerAuthentication</key>
        <string>EmailAuthPassword</string>
        <key>OutgoingMailServerHostName</key>
        <string>smtp.${orgDomain}</string>
        <key>OutgoingMailServerPortNumber</key>
        <integer>465</integer>
        <key>OutgoingMailServerUseSSL</key>
        <true/>
        <key>OutgoingMailServerUsername</key>
        <string>REPLACE_WITH_YOUR_USERNAME</string>
        <key>OutgoingPassword</key>
        <string>REPLACE_WITH_YOUR_PASSWORD</string>
        <key>PayloadDescription</key>
        <string>Configures email account.</string>
        <key>PayloadDisplayName</key>
        <string>${orgName} Email Configuration</string>
        <key>PayloadIdentifier</key>
        <string>com.${orgDomain.replace(/\./g, '-')}.mobileconfig</string>
        <key>PayloadOrganization</key>
        <string>${orgName}</string>
        <key>PayloadType</key>
        <string>com.apple.mail.managed</string>
        <key>PayloadUUID</key>
        <string>${contentUUID}</string>
        <key>PayloadVersion</key>
        <integer>1</integer>
      </dict>
    </array>
    <key>PayloadDescription</key>
    <string>${configName}</string>
    <key>PayloadDisplayName</key>
    <string>${configName}</string>
    <key>PayloadIdentifier</key>
    <string>com.${orgDomain.replace(/\./g, '-')}.mobileconfig</string>
    <key>PayloadOrganization</key>
    <string>${orgName}</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${payloadUUID}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
  </dict>
  </plist>`;

  // Set appropriate headers for the response
  res.setHeader('Content-Type', 'application/x-apple-aspen-config');
  res.setHeader('Content-Disposition', `attachment; filename="${orgName.toLowerCase()}-config.mobileconfig"`);
  res.send(mobileConfig);
}
