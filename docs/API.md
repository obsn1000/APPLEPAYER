# ApplePaySDK API Documentation

This document provides detailed information about the ApplePaySDK API endpoints, request/response formats, and authentication requirements.

## Authentication

All API endpoints require authentication using an API key. Include the API key in the request headers:

```
X-API-Key: your_api_key_here
```

You can obtain an API key by setting the `KBAN_API_KEY` environment variable in your `.env` file.

## Rate Limiting

The API implements rate limiting to prevent abuse. Clients are limited to 100 requests per 15-minute window. When rate limits are exceeded, the API will respond with a `429 Too Many Requests` status code.

Rate limit headers are included in all API responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1620000000
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request:

- `200 OK`: The request was successful
- `400 Bad Request`: The request was invalid or missing required parameters
- `401 Unauthorized`: Authentication failed
- `405 Method Not Allowed`: The HTTP method is not supported for this endpoint
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: An error occurred on the server

Error responses include a JSON object with error details:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## API Endpoints

### Apple Pay Merchant Validation

```
POST /api/validate-merchant
```

Validates an Apple Pay merchant session.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "validationURL": "https://apple-pay-gateway.apple.com/paymentservices/validatemerchant/..."
}
```

#### Response

**Success (200 OK):**
```json
{
  "merchantSession": {
    "merchantSessionIdentifier": "...",
    "nonce": "...",
    "merchantIdentifier": "...",
    "domainName": "...",
    "displayName": "...",
    "signature": "...",
    "validationURL": "...",
    "expiresAt": 1234567890
  }
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Invalid request body",
  "message": "Missing validationURL parameter"
}
```

### K/BAN Generation

```
POST /api/kban/generate
```

Generates a new K/BAN code.

#### Request

**Headers:**
```
Content-Type: application/json
X-API-Key: your_api_key_here
```

#### Response

**Success (200 OK):**
```json
{
  "kban": "KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56",
  "timestamp": "2023-05-01T12:34:56.789Z"
}
```

**Error (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid API key"
}
```

### K/BAN Validation

```
POST /api/kban/validate
```

Validates a K/BAN code.

#### Request

**Headers:**
```
Content-Type: application/json
X-API-Key: your_api_key_here
```

**Body:**
```json
{
  "kban": "KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56"
}
```

#### Response

**Success (200 OK):**
```json
{
  "valid": true
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Invalid input",
  "message": "Invalid K/BAN format"
}
```

### Apple Wallet Pass Creation

```
POST /api/pass/create
```

Creates an Apple Wallet pass for a given K/BAN.

#### Request

**Headers:**
```
Content-Type: application/json
X-API-Key: your_api_key_here
```

**Body:**
```json
{
  "kban": "KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56"
}
```

#### Response

**Success (200 OK):**
Binary `.pkpass` file with the following headers:
```
Content-Type: application/vnd.apple.pkpass
Content-Disposition: attachment; filename=KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56.pkpass
```

**Error (400 Bad Request):**
```json
{
  "error": "Invalid K/BAN format",
  "message": "The provided K/BAN does not match the required format"
}
```

### Mobile Configuration Generation

```
GET /api/generate-mobileconfig
```

Generates a mobile configuration file.

#### Request

**Headers:**
```
X-API-Key: your_api_key_here
```

#### Response

**Success (200 OK):**
Binary `.mobileconfig` file with the following headers:
```
Content-Type: application/x-apple-aspen-config
Content-Disposition: attachment; filename=applepayer-config.mobileconfig
```

## Client-Side Integration

### Apple Pay Button

To integrate the Apple Pay button on your website:

```javascript
// Check if Apple Pay is available
if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
  // Show Apple Pay button
  document.getElementById('apple-pay-button').style.display = 'block';
}

// Handle Apple Pay button click
document.getElementById('apple-pay-button').addEventListener('click', () => {
  const request = {
    countryCode: 'US',
    currencyCode: 'USD',
    supportedNetworks: ['visa', 'masterCard'],
    merchantCapabilities: ['supports3DS'],
    total: {
      label: 'Your Company Name',
      amount: '10.00'
    }
  };

  const session = new ApplePaySession(3, request);

  session.onvalidatemerchant = async (event) => {
    try {
      const response = await fetch('/api/validate-merchant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ validationURL: event.validationURL })
      });
      
      if (!response.ok) {
        throw new Error('Merchant validation failed');
      }
      
      const merchantSession = await response.json();
      session.completeMerchantValidation(merchantSession);
    } catch (error) {
      console.error('Merchant validation error:', error);
      session.abort();
    }
  };

  session.onpaymentauthorized = async (event) => {
    try {
      // Process the payment with your payment processor
      // ...
      
      session.completePayment(ApplePaySession.STATUS_SUCCESS);
    } catch (error) {
      console.error('Payment error:', error);
      session.completePayment(ApplePaySession.STATUS_FAILURE);
    }
  };

  session.begin();
});
```

### Generating K/BAN Codes

To generate a K/BAN code from your client-side application:

```javascript
async function generateKban() {
  try {
    const response = await fetch('/api/kban/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-Key': 'your_api_key_here'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate K/BAN');
    }
    
    const data = await response.json();
    return data.kban;
  } catch (error) {
    console.error('Error generating K/BAN:', error);
    throw error;
  }
}
```

### Creating Apple Wallet Passes

To create an Apple Wallet pass for a K/BAN:

```javascript
function createPass(kban) {
  // Create an iframe to handle the download
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = `/api/pass/create?kban=${kban}`;
  document.body.appendChild(iframe);
  
  // Remove the iframe after download starts
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
}
```

## Webhook Integration

The ApplePaySDK does not currently support webhooks. All API interactions are synchronous.

## Security Recommendations

1. **Use HTTPS**: Always use HTTPS in production to encrypt API requests and responses.
2. **Secure API Keys**: Store API keys securely and never expose them in client-side code.
3. **Validate Input**: Always validate user input before sending it to the API.
4. **Implement CSP**: Use Content Security Policy to prevent XSS attacks.
5. **Regular Updates**: Keep the SDK and its dependencies up to date.

## Changelog

### v1.0.0 (2023-05-01)

- Initial release
- Apple Pay merchant validation
- K/BAN generation and validation
- Apple Wallet pass creation
- Mobile configuration generation

## Support

For support, please open an issue on the GitHub repository or contact the maintainers directly.