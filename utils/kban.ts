/// FILE: /utils/kban.ts
import crypto from 'crypto';

/**
 * Generates a new K/BAN (Key/Bank Account Number) code using cryptographically secure random generation
 * 
 * @returns {string} A new K/BAN code in the format KBAN-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * @example
 * const kban = generateKban();
 * // Returns: "KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56"
 */
export function generateKban(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'KBAN-';
  const randomBytes = crypto.randomBytes(32);
  
  for (let i = 0; i < 32; i++) {
    const randomIndex = randomBytes[i] % chars.length;
    result += chars[randomIndex];
  }
  
  return result;
}

/**
 * Validates if a string is a properly formatted K/BAN code
 * 
 * @param {string} kban - The K/BAN code to validate
 * @returns {boolean} True if the K/BAN is valid, false otherwise
 * @example
 * validateKban("KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56"); // Returns: true
 * validateKban("invalid"); // Returns: false
 */
export function validateKban(kban: string): boolean {
  const pattern = /^KBAN-[A-Z0-9]{32}$/;
  return pattern.test(kban);
}
