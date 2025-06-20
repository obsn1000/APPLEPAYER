# REAPNET Integration Guide

This guide explains how to integrate the APPLEPAYER project with the REAPNET desktop application for seamless Apple Pay and Wallet Pass management.

## Overview

The APPLEPAYER project provides web-based Apple Pay integration and Wallet Pass generation that works perfectly with the REAPNET desktop application. This integration allows you to:

- Generate mobile configuration profiles for iOS devices
- Create Apple Wallet passes with K/BAN codes from REAPNET
- Provide a web interface for Apple Pay processing
- Bridge REAPNET desktop app with mobile iOS functionality

## Quick Start

### 1. Start APPLEPAYER Server

```bash
cd /home/kali/APPLEPAYER
npm run dev
```

The server will start at `http://localhost:3000`

### 2. Launch REAPNET Desktop App

```bash
cd /home/kali/Desktop/reap-linux-new
./REAPNET
```

REAPNET will automatically load the APPLEPAYER web interface at `localhost:3000`

### 3. Configure iOS Device

#### Option A: Mobile Configuration Profile (Advanced)
1. On your iPhone, visit: `http://localhost:3000/api/reapnet-config`
2. Download and install the configuration profile
3. Trust the profile in Settings > General > VPN & Device Management

#### Option B: Add to Home Screen (Recommended)
1. On your iPhone, visit: `http://localhost:3000`
2. Tap the Share button and select "Add to Home Screen"
3. The REAPNET web app will be available as a native-like app

## API Endpoints

### Mobile Configuration
- **URL**: `http://localhost:3000/api/reapnet-config`
- **Method**: GET
- **Description**: Downloads a `.mobileconfig` file for iOS device setup
- **Parameters**:
  - `deviceId` (optional): Device identifier
  - `reapnetUrl` (optional): Custom REAPNET URL

### Wallet Pass Generation
- **URL**: `http://localhost:3000/api/reapnet-pass`
- **Method**: POST
- **Description**: Generates a `.pkpass` file for Apple Wallet
- **Body**:
  ```json
  {
    "kban": "K/BAN code from REAPNET",
    "deviceId": "optional device ID",
    "reapnetId": "optional REAPNET session ID"
  }
  ```

### General Mobile Setup
- **URL**: `http://localhost:3000/api/generate-mobileconfig`
- **Method**: GET
- **Description**: Provides setup instructions and configuration options

## File Structure

### Mobile Configuration Files
- `/assets/reapnet.mobileconfig` - Template configuration file
- `/pages/api/reapnet-config.js` - Dynamic configuration generator
- `/pages/api/generate-mobileconfig.js` - General mobile setup

### Wallet Pass Files
- `/assets/pass/pass.json` - Pass template
- `/pages/api/reapnet-pass.js` - Pass generator
- `/utils/passkit.ts` - Pass generation utilities

### Integration Files
- `/reapnet-bridge.js` - Bridge script for data exchange
- `/public/reapnet.html` - REAPNET-specific web interface

## Configuration Details

### Mobile Configuration Profile Features
- **Web Clip**: Adds REAPNET as a home screen app
- **Safari Settings**: Optimizes browser for Apple Pay
- **App Permissions**: Enables Wallet and Apple Pay functionality
- **Security Settings**: Configures appropriate access levels

### Wallet Pass Features
- **K/BAN Display**: Shows the K/BAN code prominently
- **QR Code**: Contains REAPNET-specific data for scanning
- **Branding**: REAPNET colors and styling
- **Updates**: Web service integration for pass updates

## Usage Workflow

### 1. REAPNET Desktop → APPLEPAYER Web
1. Launch REAPNET desktop application
2. REAPNET loads `http://localhost:3000` automatically
3. Use the web interface for Apple Pay processing
4. Generate K/BAN codes through REAPNET functionality

### 2. Web → Mobile Configuration
1. Visit `http://localhost:3000/api/generate-mobileconfig` on iPhone
2. Follow setup instructions
3. Either install configuration profile or add to home screen

### 3. K/BAN → Wallet Pass
1. Obtain K/BAN code from REAPNET processing
2. Use the web interface to generate a wallet pass
3. Pass is automatically downloaded to iPhone
4. Add to Apple Wallet for easy access

## Troubleshooting

### Configuration Profile Issues
- **Unsigned Profile Warning**: Normal for development - use "Add to Home Screen" instead
- **Installation Fails**: Check iOS version compatibility (iOS 12+)
- **Profile Not Trusted**: Go to Settings > General > VPN & Device Management

### Wallet Pass Issues
- **Pass Won't Install**: Ensure certificates are properly configured in `/certs/`
- **Pass Appears Blank**: Check pass.json template and data formatting
- **Updates Not Working**: Verify web service URL and authentication token

### REAPNET Integration Issues
- **REAPNET Won't Load**: Ensure APPLEPAYER server is running on port 3000
- **Data Not Syncing**: Check bridge script and temporary file permissions
- **Mobile Config Not Working**: Verify URL accessibility from mobile device

## Development Notes

### Certificates Required
For production use, you'll need:
- Apple Developer Certificate
- Pass Type ID Certificate
- WWDR Intermediate Certificate

### Environment Variables
```bash
PASS_AUTH_SECRET=your-secret-key
NODE_ENV=development
```

### Testing
```bash
# Test mobile config generation
curl http://localhost:3000/api/reapnet-config

# Test pass generation
curl -X POST http://localhost:3000/api/reapnet-pass \
  -H "Content-Type: application/json" \
  -d '{"kban":"TEST123456"}'
```

## Security Considerations

- Mobile configuration profiles should be signed for production
- Use HTTPS in production environments
- Implement proper authentication for pass generation
- Validate all input data from REAPNET
- Store certificates securely

## Support

For issues with:
- **APPLEPAYER**: Check the main project documentation
- **REAPNET**: Refer to REAPNET desktop application documentation
- **iOS Integration**: Consult Apple's Configuration Profile documentation
- **Wallet Passes**: Review Apple's PassKit documentation

## Version Compatibility

- **iOS**: 12.0 or later
- **REAPNET**: All versions that support localhost:3000
- **Node.js**: 14.0 or later
- **Browsers**: Safari (iOS), Chrome, Firefox, Edge