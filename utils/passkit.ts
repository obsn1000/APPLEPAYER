import Passbook from 'passbook';
import fs from 'fs';
import path from 'path';

const certPath = path.resolve('./certs');

const template = new Passbook({
  model: path.join(process.cwd(), 'assets/pass'),
  certificates: {
    wwdr: fs.readFileSync(path.join(certPath, 'wwdr.pem')),
    signerCert: fs.readFileSync(path.join(certPath, 'signingCert.pem')),
    signerKey: fs.readFileSync(path.join(certPath, 'signingKey.pem')),
    signerKeyPassphrase: process.env.CERT_PASSPHRASE
  },
  overrides: {
    serialNumber: `reap-${Date.now()}`,
    teamIdentifier: process.env.APPLE_TEAM_ID,
    passTypeIdentifier: process.env.PASS_TYPE_ID
  }
});

export async function generatePass(kban: string) {
  const pass = template.createPass({
    description: 'Reapware Wallet K/BAN',
    organizationName: 'Reapware',
    logoText: 'K/BAN',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(0, 0, 0)',
    generic: {
      primaryFields: [{ key: 'kban', label: 'K/BAN', value: kban }],
      auxiliaryFields: [{ key: 'status', label: 'STATUS', value: 'ACTIVE' }]
    },
    barcode: {
      message: kban,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1'
    }
  });

  return await pass.generate();
}
