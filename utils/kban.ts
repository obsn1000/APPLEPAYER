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
 * Validates if a string is a properly formatted pass/code (flexible for reapware)
 * 
 * @param {string} kban - The pass/code to validate
 * @returns {boolean} True if the pass is valid, false otherwise
 * @example
 * validateKban("KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56"); // Returns: true
 * validateKban("some-reapware-pass-123"); // Returns: true (flexible validation)
 * validateKban(""); // Returns: false
 */
export function validateKban(kban: string): boolean {
  if (!kban || typeof kban !== 'string') {
    return false;
  }
  
  // Remove whitespace
  const cleanKban = kban.trim();
  
  // Empty string is invalid
  if (cleanKban.length === 0) {
    return false;
  }
  
  // Check for our standard KBAN format first
  const standardPattern = /^KBAN-[A-Z0-9]{32}$/;
  if (standardPattern.test(cleanKban)) {
    return true;
  }
  
  // For reapware compatibility, accept:
  // - Alphanumeric strings with dashes/underscores
  // - Length between 8 and 64 characters
  // - Various pass formats
  const flexiblePattern = /^[A-Za-z0-9\-_]{8,64}$/;
  if (flexiblePattern.test(cleanKban)) {
    return true;
  }
  
  // Accept hex patterns (common in reapware)
  const hexPattern = /^[A-Fa-f0-9]{16,64}$/;
  if (hexPattern.test(cleanKban)) {
    return true;
  }
  
  // Accept Base64-like patterns
  const base64Pattern = /^[A-Za-z0-9+/]{16,}={0,2}$/;
  if (base64Pattern.test(cleanKban)) {
    return true;
  }
  
  return false;
}
