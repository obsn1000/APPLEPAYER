# ApplePaySDK

This SDK provides integration with Apple Pay for web applications.

## Features

- Validate merchant sessions
- Add cards to Apple Wallet
- Generate K/BAN codes
- Create mobile configuration files

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   KBAN_API_KEY=your_api_key_here
   CERT_PASSPHRASE=your_cert_passphrase
   APPLE_TEAM_ID=your_apple_team_id
   PASS_TYPE_ID=your_pass_type_id
   ```

3. Make sure you have the required certificates in the `certs` directory:
   - apple-pay-cert.pem
   - apple-pay-key.pem
   - apple-root-ca.pem
   - wwdr.pem
   - signingCert.pem
   - signingKey.pem

## Running the SDK

### Development mode:
```
npm run dev
```

### Production mode:
```
npm run build
npm start
```

## Using with reap-linux

You can use this SDK alongside reap-linux without modifying reap-linux:

1. Run this SDK as a separate service
2. Access it through your web browser
3. Generate passes or process payments
4. Download the generated files to your computer

## API Endpoints

- `/api/validate-merchant` - Validate Apple Pay merchant sessions
- `/api/kban/generate` - Generate a new K/BAN code
- `/api/kban/validate` - Validate a K/BAN code
- `/api/pass/create` - Create an Apple Wallet pass
- `/api/generate-mobileconfig` - Generate a mobile configuration file

## Demo

Open your browser to `http://localhost:3000` to see a demo of the SDK in action.

--- README.md
+++ README.md
@@ -6,13 +6,62 @@
 
 - Validate merchant sessions
 - Add cards to Apple Wallet
+- Generate K/BAN codes
+- Create mobile configuration files
 
 ## Setup
 
-1. Clone the repository.
-2. Install dependencies.
-3. Run the server.
+1. Install dependencies:
+   ```
+   npm install
+   ```
 
-## Usage
+2. Create a `.env` file with the following variables:
+   ```
+   KBAN_API_KEY=your_api_key_here
+   CERT_PASSPHRASE=your_cert_passphrase
+   APPLE_TEAM_ID=your_apple_team_id
+   PASS_TYPE_ID=your_pass_type_id
+   ```
 
-Include the SDK in your project and follow the examples in `public/index.html`.
+3. Make sure you have the required certificates in the `certs` directory:
+   - apple-pay-cert.pem
+   - apple-pay-key.pem
+   - apple-root-ca.pem
+   - wwdr.pem
+   - signingCert.pem
+   - signingKey.pem
+
+## Running the SDK
+
+### Development mode:
+```
+npm run dev
+```
+
+### Production mode:
+```
+npm run build
+npm start
+```
+
+## Using with reap-linux
+
+You can use this SDK alongside reap-linux without modifying reap-linux:
+
+1. Run this SDK as a separate service
+2. Access it through your web browser
+3. Generate passes or process payments
+4. Download the generated files to your computer
+
+## API Endpoints
+
+- `/api/validate-merchant` - Validate Apple Pay merchant sessions
+- `/api/kban/generate` - Generate a new K/BAN code
+- `/api/kban/validate` - Validate a K/BAN code
+- `/api/pass/create` - Create an Apple Wallet pass
+- `/api/generate-mobileconfig` - Generate a mobile configuration file
+
+## Demo
+
+Open your browser to `http://localhost:3000` to see a demo of the SDK in action.
