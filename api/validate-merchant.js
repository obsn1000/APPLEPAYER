import fs from 'fs';
import path from 'path';
import https from 'https';

export default async function handler(req, res) {
  const { validationURL } = JSON.parse(req.body);

  const options = {
    cert: fs.readFileSync(path.resolve('certs/apple-pay-cert.pem')),
    key: fs.readFileSync(path.resolve('certs/apple-pay-key.pem')),
    ca: fs.readFileSync(path.resolve('certs/apple-root-ca.pem')),
  };

  const postData = JSON.stringify({
    merchantIdentifier: 'merchant.APPLEPAYER',
    displayName: 'APPLEPAYER',
    initiative: 'web',
    initiativeContext: 'reapwareapi.cc'
  });

  const request = https.request({
    hostname: new URL(validationURL).hostname,
    path: new URL(validationURL).pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
    cert: options.cert,
    key: options.key,
    ca: options.ca,
  }, (appleRes) => {
    let data = '';
    appleRes.on('data', chunk => data += chunk);
    appleRes.on('end', () => {
      res.status(200).json(JSON.parse(data));
    });
  });

  request.on('error', (err) => {
    console.error(err);
    res.status(500).send('Merchant validation failed');
  });

  request.write(postData);
  request.end();
}
