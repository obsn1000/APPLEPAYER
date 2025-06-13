export default function handler(req, res) {
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
        <string>example@example.com</string>
        <key>IncomingMailServerAuthentication</key>
        <string>EmailAuthPassword</string>
        <key>IncomingMailServerHostName</key>
        <string>imap.example.com</string>
        <key>IncomingMailServerPortNumber</key>
        <integer>993</integer>
        <key>IncomingMailServerUseSSL</key>
        <true/>
        <key>IncomingMailServerUsername</key>
        <string>example@example.com</string>
        <key>IncomingPassword</key>
        <string>password</string>
        <key>OutgoingMailServerAuthentication</key>
        <string>EmailAuthPassword</string>
        <key>OutgoingMailServerHostName</key>
        <string>smtp.example.com</string>
        <key>OutgoingMailServerPortNumber</key>
        <integer>465</integer>
        <key>OutgoingMailServerUseSSL</key>
        <true/>
        <key>OutgoingMailServerUsername</key>
        <string>example@example.com</string>
        <key>OutgoingPassword</key>
        <string>password</string>
        <key>PayloadDescription</key>
        <string>Configures email account.</string>
        <key>PayloadDisplayName</key>
        <string>Email Configuration</string>
        <key>PayloadIdentifier</key>
        <string>com.example.mobileconfig</string>
        <key>PayloadOrganization</key>
        <string>Example Org</string>
        <key>PayloadType</key>
        <string>com.apple.mail.managed</string>
        <key>PayloadUUID</key>
        <string>ca68175d-0fdc-4783-854b-5b7fede18a95</string>
        <key>PayloadVersion</key>
        <integer>1</integer>
      </dict>
    </array>
    <key>PayloadDescription</key>
    <string>Example Configuration</string>
    <key>PayloadDisplayName</key>
    <string>Example Config</string>
    <key>PayloadIdentifier</key>
    <string>com.example.mobileconfig</string>
    <key>PayloadOrganization</key>
    <string>Example Org</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>a4124070-5079-4583-bf05-4ab6d7f00ede</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
  </dict>
  </plist>`;

  res.setHeader('Content-Type', 'application/x-apple-aspen-config');
  res.setHeader('Content-Disposition', 'attachment; filename="example.mobileconfig"');
  res.send(mobileConfig);
}
