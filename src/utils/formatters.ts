/**
 * Safe numeric formatters preventing React 19 NaN child render warnings
 */

export function safeNum(val: any, decimals?: number, fallback: string = '-'): string {
  if (val === null || val === undefined) return fallback;
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num) || !isFinite(num)) return fallback;
  if (decimals !== undefined) {
    return num.toFixed(decimals);
  }
  return num.toLocaleString();
}

export function safeDisplay(val: any, fallback: string = '-'): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'number') {
    return isNaN(val) || !isFinite(val) ? fallback : String(val);
  }
  const s = String(val);
  return s === 'NaN' || s === 'undefined' || s === 'null' ? fallback : s;
}

export function safePct(val: any, decimals: number = 1, fallback: string = '0.0%'): string {
  if (val === null || val === undefined) return fallback;
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num) || !isFinite(num)) return fallback;
  return `${(num * 100).toFixed(decimals)}%`;
}

export function safeInt(val: any, fallback: string = '0'): string {
  if (val === null || val === undefined) return fallback;
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num) || !isFinite(num)) return fallback;
  return Math.round(num).toLocaleString();
}

export function safeInputNumber(val: any, fallback: number = 0): number {
  if (val === null || val === undefined || val === '') return fallback;
  const num = typeof val === 'number' ? val : Number(val);
  return isNaN(num) ? fallback : num;
}
