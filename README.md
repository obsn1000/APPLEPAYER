# ApplePaySDK

This SDK provides integration with Apple Pay for web applications, allowing you to validate merchant sessions, create Apple Wallet passes, generate K/BAN codes, and create mobile configuration files.

![ApplePaySDK Demo](https://example.com/applepaysdk-demo.png)

## Features

- **Apple Pay Integration**: Validate merchant sessions and process Apple Pay payments
- **Apple Wallet Passes**: Create and distribute passes for Apple Wallet
- **K/BAN Generation**: Generate and validate secure K/BAN codes
- **Mobile Configuration**: Create and distribute mobile configuration files
- **REAPNET Integration**: Seamless integration with REAPNET desktop application
- **Security**: Implements rate limiting and secure API authentication
- **Modern UI**: Clean, responsive interface with proper error handling

## Prerequisites

- Node.js 14.x or higher
- Apple Developer Account with Apple Pay and Wallet capabilities
- Valid Apple Pay and Wallet certificates

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/applepaysdk.git
   cd applepaysdk
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy the `.env.example` file to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your specific configuration:
   ```
   # API Authentication
   KBAN_API_KEY=your_api_key_here
   
   # Apple Pay Merchant Configuration
   MERCHANT_ID=merchant.your.domain
   MERCHANT_NAME=Your Company Name
   INITIATIVE_CONTEXT=your-domain.com
   
   # Apple Wallet Pass Configuration
   CERT_PASSPHRASE=your_cert_passphrase
   APPLE_TEAM_ID=your_apple_team_id
   PASS_TYPE_ID=pass.your.domain
   
   # Organization Information
   ORGANIZATION_NAME=Your Company Name
   ORGANIZATION_DOMAIN=your-domain.com
   CONFIG_NAME=Your Configuration Name
   
   # Development Settings
   NODE_ENV=development
   ```

4. **Set up certificates**:
   Place the following certificates in the `certs` directory:
   - `apple-pay-cert.pem` - Your Apple Pay merchant certificate
   - `apple-pay-key.pem` - Your Apple Pay merchant private key
   - `apple-root-ca.pem` - Apple Root CA certificate
   - `wwdr.pem` - Apple Worldwide Developer Relations certificate
   - `signingCert.pem` - Your Pass Type ID certificate
   - `signingKey.pem` - Your Pass Type ID private key

## Running the SDK

### Development mode:
```bash
npm run dev
```
This will start the development server at `http://localhost:3000`.

### Production mode:
```bash
npm run build
npm start
```

## API Documentation

### Authentication

All API endpoints require authentication using an API key. Include the API key in the request headers:

```
X-API-Key: your_api_key_here
```

### Rate Limiting

The API implements rate limiting to prevent abuse. Clients are limited to 100 requests per 15-minute window.

### Endpoints

#### Apple Pay Merchant Validation

```
POST /api/validate-merchant
```

Validates an Apple Pay merchant session.

**Request Body**:
```json
{
  "validationURL": "https://apple-pay-gateway.apple.com/paymentservices/validatemerchant/..."
}
```

**Response**:
```json
{
  "merchantSession": { ... }
}
```

#### K/BAN Generation

```
POST /api/kban/generate
```

Generates a new K/BAN code.

**Response**:
```json
{
  "kban": "KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56",
  "timestamp": "2023-05-01T12:34:56.789Z"
}
```

#### K/BAN Validation

```
POST /api/kban/validate
```

Validates a K/BAN code.

**Request Body**:
```json
{
  "kban": "KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56"
}
```

**Response**:
```json
{
  "valid": true
}
```

#### Apple Wallet Pass Creation

```
POST /api/pass/create
```

Creates an Apple Wallet pass for a given K/BAN.

**Request Body**:
```json
{
  "kban": "KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56"
}
```

**Response**: Binary `.pkpass` file

#### Mobile Configuration Generation

```
GET /api/generate-mobileconfig
```

Generates a mobile configuration file.

**Response**: Binary `.mobileconfig` file

## Using with reap-linux

You can use this SDK alongside reap-linux without modifying reap-linux:

1. Run this SDK as a separate service
2. Access it through your web browser
3. Generate passes or process payments
4. Download the generated files to your computer

## Security Considerations

- Always use HTTPS in production
- Keep your API keys and certificates secure
- Regularly rotate your API keys
- Monitor API usage for suspicious activity

## Troubleshooting

### Common Issues

1. **Certificate errors**: Ensure your certificates are in PEM format and have the correct permissions
2. **API key errors**: Verify your API key is correctly set in the `.env` file
3. **Apple Pay validation errors**: Ensure your domain is registered with Apple Pay and your certificates are valid

### Logs

Check the server logs for detailed error information:

```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Apple Developer Documentation
- Next.js Framework
- Passbook library for pass generation

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
