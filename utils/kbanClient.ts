/**
 * Client-side utilities for K/BAN operations
 */

/**
 * Creates an Apple Wallet pass for a given K/BAN code
 * 
 * @param {string} kban - The K/BAN code to create a pass for
 * @param {string} [apiKey] - Optional API key for authentication
 * @returns {Promise<void>} A promise that resolves when the pass is created and downloaded
 * @throws {Error} If the pass creation fails
 */
export async function createPass(kban: string, apiKey?: string): Promise<void> {
  try {
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    // Add API key if provided
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }
    
    const response = await fetch('/api/pass/create', {
      method: 'POST',
      headers,
      body: JSON.stringify({ kban })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to generate pass (${response.status})`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kban}.pkpass`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error creating pass:', error);
    throw error;
  }
}

/**
 * Validates a K/BAN code on the client side
 * 
 * @param {string} kban - The K/BAN code to validate
 * @returns {boolean} True if the K/BAN format is valid
 */
export function validateKbanClient(kban: string): boolean {
  const pattern = /^KBAN-[A-Z0-9]{32}$/;
  return pattern.test(kban);
}