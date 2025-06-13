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
