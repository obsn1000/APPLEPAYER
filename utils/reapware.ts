/// FILE: /utils/reapware.ts
import https from 'https';
import { validateAmidData } from './kban';

export interface ReapwareConfig {
  apiKey: string;
  baseUrl: string;
  merchantId: string;
  environment: 'sandbox' | 'production';
}

export interface AmidData {
  amid: string;
  bank_name?: string;
  account_number?: string;
  bank_code?: string;
  country?: string;
  checksum?: string;
  bban?: string;
  amid_isvalid: string;
  merchant_id?: string;
}

export interface CardProvisioningRequest {
  cardholderName: string;
  primaryAccountNumber: string;
  expirationDate: string;
  cvv?: string;
  merchantId: string;
  deviceId?: string;
}

export interface CardProvisioningResponse {
  success: boolean;
  amid?: AmidData;
  provisioningData?: any;
  error?: string;
}

/**
 * Reapware API client for Apple Pay card provisioning
 */
export class ReapwareClient {
  private config: ReapwareConfig;

  constructor(config: ReapwareConfig) {
    this.config = config;
  }

  /**
   * Provision a card to Apple Pay wallet using Reapware API
   */
  async provisionCard(request: CardProvisioningRequest): Promise<CardProvisioningResponse> {
    try {
      const payload = {
        merchant_id: request.merchantId,
        cardholder_name: request.cardholderName,
        primary_account_number: request.primaryAccountNumber,
        expiration_date: request.expirationDate,
        cvv: request.cvv,
        device_id: request.deviceId || this.generateDeviceId(),
        environment: this.config.environment
      };

      const response = await this.makeRequest('/api/v1/provision-card', 'POST', payload);
      
      if (response.success && response.amid_data) {
        const amidData: AmidData = response.amid_data;
        
        // Validate the AMID data structure
        if (validateAmidData(amidData)) {
          return {
            success: true,
            amid: amidData,
            provisioningData: response.provisioning_data
          };
        } else {
          return {
            success: false,
            error: 'Invalid AMID data received from Reapware'
          };
        }
      }

      return {
        success: false,
        error: response.error || 'Card provisioning failed'
      };

    } catch (error) {
      console.error('Reapware card provisioning error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Validate an existing AMID with Reapware
   */
  async validateAmid(amid: string): Promise<{ valid: boolean; data?: AmidData; error?: string }> {
    try {
      const response = await this.makeRequest('/api/v1/validate-amid', 'POST', { amid });
      
      if (response.success) {
        return {
          valid: true,
          data: response.amid_data
        };
      }

      return {
        valid: false,
        error: response.error || 'AMID validation failed'
      };

    } catch (error) {
      console.error('Reapware AMID validation error:', error);
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get merchant configuration from Reapware
   */
  async getMerchantConfig(): Promise<{ success: boolean; config?: any; error?: string }> {
    try {
      const response = await this.makeRequest('/api/v1/merchant-config', 'GET');
      
      return {
        success: response.success,
        config: response.config,
        error: response.error
      };

    } catch (error) {
      console.error('Reapware merchant config error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Make HTTP request to Reapware API
   */
  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.config.baseUrl);
      const payload = data ? JSON.stringify(data) : undefined;

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'User-Agent': 'ApplePaySDK/1.0.0',
          ...(payload && { 'Content-Length': Buffer.byteLength(payload) })
        }
      };

      const req = https.request(url, options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            resolve(parsedData);
          } catch (parseError) {
            reject(new Error(`Invalid JSON response: ${responseData}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (payload) {
        req.write(payload);
      }
      
      req.end();
    });
  }

  /**
   * Generate a unique device ID for provisioning
   */
  private generateDeviceId(): string {
    return `APPSDK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Create a Reapware client instance with environment configuration
 */
export function createReapwareClient(): ReapwareClient {
  const config: ReapwareConfig = {
    apiKey: process.env.REAPWARE_API_KEY || process.env.KBAN_API_KEY || '',
    baseUrl: process.env.REAPWARE_BASE_URL || 'https://api.reapware.com',
    merchantId: process.env.MERCHANT_ID || 'merchant.APPLEPAYER',
    environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production'
  };

  if (!config.apiKey) {
    throw new Error('Reapware API key not configured. Set REAPWARE_API_KEY or KBAN_API_KEY in environment variables.');
  }

  return new ReapwareClient(config);
}

/**
 * Parse AMID data from various input formats
 */
export function parseAmidInput(input: string): AmidData | null {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(input);
    
    if (validateAmidData(parsed)) {
      return parsed as AmidData;
    }
    
    return null;
  } catch (error) {
    // Not valid JSON
    return null;
  }
}

/**
 * Format AMID data for display
 */
export function formatAmidData(amid: AmidData): string {
  return `
AMID: ${amid.amid}
Bank: ${amid.bank_name || 'N/A'}
Account: ${amid.account_number || 'N/A'}
Bank Code: ${amid.bank_code || 'N/A'}
Country: ${amid.country || 'N/A'}
Status: ${amid.amid_isvalid}
Merchant ID: ${amid.merchant_id || 'N/A'}
  `.trim();
}