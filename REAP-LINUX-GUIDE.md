# Using ApplePaySDK with reap-linux

This guide explains how to use the ApplePaySDK alongside reap-linux without modifying reap-linux.

## Setup Instructions

1. **Install dependencies**:
   ```
   cd /home/kali/ApplePaySDK
   npm install
   ```

2. **Configure environment variables**:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file with your actual API keys and certificates.

3. **Add required certificates**:
   Place the following certificate files in the `/home/kali/ApplePaySDK/certs` directory:
   - apple-pay-cert.pem
   - apple-pay-key.pem
   - apple-root-ca.pem
   - wwdr.pem
   - signingCert.pem
   - signingKey.pem

## Running the SDK

Start the SDK in development mode:
```
npm run dev
```

This will start a web server on port 3000.

## Using with reap-linux

1. **Run both applications separately**:
   - Keep reap-linux running as normal
   - Run ApplePaySDK on port 3000

2. **Access the ApplePaySDK interface**:
   - Open your web browser to `http://localhost:3000`
   - Use the interface to:
     - Generate K/BAN codes
     - Create Apple Wallet passes
     - Download mobile configuration files

3. **Download generated files**:
   - When you generate a pass or configuration file, it will download to your computer
   - You can then use these files as needed

## Features

### 1. Generate K/BAN Codes
K/BAN codes are unique identifiers that can be used for transactions or user identification.

### 2. Create Apple Wallet Passes
Generate passes that can be added to Apple Wallet on iOS devices.

### 3. Process Apple Pay Payments
Simulate Apple Pay payments (requires proper certificates for production use).

### 4. Generate Mobile Configuration Files
Create configuration files that can be installed on iOS devices.

## Important Notes

- This setup keeps reap-linux completely untouched
- All ApplePaySDK functionality is accessed through your web browser
- No modifications to reap-linux are required
- All generated files are downloaded to your computer and can be used separately