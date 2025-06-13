/// FILE: /utils/kban.ts
export function generateKban(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'KBAN-';
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function validateKban(kban: string): boolean {
  const pattern = /^KBAN-[A-Z0-9]{32}$/;
  return pattern.test(kban);
}
async function createPass(kban) {
  try {
    const response = await fetch('/api/pass/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kban })
    });

    if (!response.ok) {
      throw new Error('Failed to generate pass');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kban}.pkpass`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error('Error creating pass:', error);
  }
}
