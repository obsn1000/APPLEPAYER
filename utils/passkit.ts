import Passbook from 'passbook';
import fs from 'fs';
import path from 'path';

// Path to certificates
const certPath = path.resolve('./certs');

// Load certificates once at module level
const CERTS = {
  wwdr: fs.readFileSync(path.join(certPath, 'wwdr.pem')),
  signerCert: fs.readFileSync(path.join(certPath, 'signingCert.pem')),
  signerKey: fs.readFileSync(path.join(certPath, 'signingKey.pem'))
};

// Get configuration from environment variables or use defaults
const TEAM_ID = process.env.APPLE_TEAM_ID || 'REPLACE_WITH_YOUR_TEAM_ID';
const PASS_TYPE_ID = process.env.PASS_TYPE_ID || 'pass.com.reap.card';
const CERT_PASSPHRASE = process.env.CERT_PASSPHRASE || '';
const ORG_NAME = process.env.ORGANIZATION_NAME || 'APPLEPAYER';

// Create a template for generating passes
const template = new Passbook({
  model: path.join(process.cwd(), 'assets/pass'),
  certificates: {
    wwdr: CERTS.wwdr,
    signerCert: CERTS.signerCert,
    signerKey: CERTS.signerKey,
    signerKeyPassphrase: CERT_PASSPHRASE
  },
  overrides: {
    serialNumber: `applepayer-${Date.now()}`,
    teamIdentifier: TEAM_ID,
    passTypeIdentifier: PASS_TYPE_ID
  }
});

/**
 * Generates an Apple Wallet pass for a given K/BAN code
 * 
 * @param {string} kban - The K/BAN code to include in the pass
 * @returns {Promise<Buffer>} A promise that resolves to the generated .pkpass file as a Buffer
 * @throws {Error} If pass generation fails
 */
export async function generatePass(kban: string): Promise<Buffer> {
  try {
    // Validate input
    if (!kban || typeof kban !== 'string') {
      throw new Error('Invalid K/BAN provided');
    }
    
    // Create a unique serial number for this pass using the found ID format
    const serialNumber = `e5fdab-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    // Create the pass with the provided K/BAN and AMID details
    const pass = template.createPass({
      serialNumber,
      description: `${ORG_NAME} Wallet K/BAN`,
      organizationName: ORG_NAME,
      logoText: 'K/BAN',
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(0, 0, 0)',
      generic: {
        primaryFields: [{ 
          key: 'kban', 
          label: 'K/BAN', 
          value: kban 
        }],
        secondaryFields: [
          { 
            key: 'amid', 
            label: 'AMID', 
            value: 'M32662659-1976148969917405' 
          },
          { 
            key: 'account', 
            label: 'ACCOUNT', 
            value: '8969917405' 
          }
        ],
        auxiliaryFields: [
          { 
            key: 'bank_code', 
            label: 'BANK CODE', 
            value: 'M32' 
          },
          { 
            key: 'status', 
            label: 'STATUS', 
            value: 'Valid' 
          }
        ]
      },
      // Add a QR code containing the K/BAN
      barcode: {
        message: kban,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1',
        altText: kban
      },
      // Add AMID and banking details to userInfo for programmatic access
      userInfo: {
        amid: 'M32662659-1976148969917405',
        bank_name: '',
        account_number: '8969917405',
        bank_code: 'M32',
        country: '',
        checksum: '',
        bban: '',
        amid_isvalid: 'Valid',
        merchant_id: 'merchant.com.yourcompany.store',
        kban: kban,
        pass_id: 'pass.com.reap.card::e5fdab'
      }
    });

    // Generate the pass and return it as a Buffer
    return await pass.generate();
  } catch (error) {
    console.error('Error generating pass:', error);
    throw new Error(`Failed to generate pass: ${error.message}`);
  }
}
