/// FILE: /pages/api/provision-card.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiKey } from '../../utils/auth';
import { createReapwareClient, CardProvisioningRequest } from '../../utils/reapware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Require API key for security
  if (!requireApiKey(req, res)) return;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    cardholderName,
    primaryAccountNumber,
    expirationDate,
    cvv,
    deviceId
  }: CardProvisioningRequest = req.body;

  // Validate required fields
  if (!cardholderName || !primaryAccountNumber || !expirationDate) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['cardholderName', 'primaryAccountNumber', 'expirationDate']
    });
  }

  // Validate card number format (basic validation)
  const cleanCardNumber = primaryAccountNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleanCardNumber)) {
    return res.status(400).json({
      error: 'Invalid card number format'
    });
  }

  // Validate expiration date format (MM/YY or MM/YYYY)
  if (!/^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/.test(expirationDate)) {
    return res.status(400).json({
      error: 'Invalid expiration date format. Use MM/YY or MM/YYYY'
    });
  }

  try {
    // Create Reapware client
    const reapwareClient = createReapwareClient();

    // Prepare provisioning request
    const provisioningRequest: CardProvisioningRequest = {
      cardholderName,
      primaryAccountNumber: cleanCardNumber,
      expirationDate,
      cvv,
      merchantId: process.env.MERCHANT_ID || 'merchant.APPLEPAYER',
      deviceId
    };

    // Call Reapware API to provision the card
    const result = await reapwareClient.provisionCard(provisioningRequest);

    if (result.success) {
      // Log successful provisioning
      console.log('Card provisioned successfully:', {
        amid: result.amid?.amid,
        merchantId: result.amid?.merchant_id,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        success: true,
        message: 'Card provisioned successfully',
        amid: result.amid,
        provisioningData: result.provisioningData
      });
    } else {
      console.error('Card provisioning failed:', result.error);
      res.status(400).json({
        success: false,
        error: result.error || 'Card provisioning failed'
      });
    }

  } catch (error) {
    console.error('Card provisioning error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during card provisioning',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}