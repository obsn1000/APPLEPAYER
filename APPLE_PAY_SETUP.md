# Apple Pay Setup - Complete ✅

## Setup Status: READY FOR VERIFICATION

### ✅ Certificates (All Configured)
- **Location**: `/home/kali/APPLEPAYER/certs/`
- **Apple Pay Certificate**: `apple-pay-cert.pem` (merchant.APPLEPAYER)
- **Private Key**: `apple-pay-key.pem`
- **Apple Root CA**: `apple-root-ca.pem`
- **WWDR Certificate**: `wwdr.pem`

### ✅ Domain Verification (Configured)
- **Location**: `/home/kali/APPLEPAYER/public/.well-known/`
- **File**: `apple-developer-merchantid-domain-association`
- **Domain**: `reapwareapi.cc` (as configured in the association file)
- **Team ID**: `YN229FU2KK`

### ✅ Application Configuration (Updated)
- **Merchant ID**: Updated to `merchant.APPLEPAYER` in the application
- **Configuration File**: `pages/index.js` updated with correct merchant ID

## Verification Steps

### 1. Domain Verification
Apple will verify your domain by accessing:
```
https://reapwareapi.cc/.well-known/apple-developer-merchantid-domain-association
```

### 2. Certificate Verification
Your certificates are properly configured for merchant ID: `merchant.APPLEPAYER`

### 3. Test Apple Pay
Once your domain is live, you can test Apple Pay functionality.

## Next Steps

1. **Deploy your application** to `reapwareapi.cc`
2. **Ensure HTTPS** is properly configured
3. **Test the domain verification** URL
4. **Test Apple Pay** transactions

## Important Notes

- Domain in association file: `reapwareapi.cc`
- Make sure your application is deployed to this exact domain
- HTTPS is required for Apple Pay
- The `.well-known` directory must be accessible via web server

## Files Summary
```
/home/kali/APPLEPAYER/
├── certs/
│   ├── apple-pay-cert.pem      ✅ Apple Pay merchant certificate
│   ├── apple-pay-key.pem       ✅ Private key
│   ├── apple-root-ca.pem       ✅ Apple Root CA
│   └── wwdr.pem               ✅ WWDR certificate
└── public/
    └── .well-known/
        └── apple-developer-merchantid-domain-association  ✅ Domain verification
```

**Status: Ready for deployment and testing! 🚀**