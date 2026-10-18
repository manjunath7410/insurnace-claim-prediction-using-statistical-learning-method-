import { AuditLogEntry, UserRole, UserSession } from '../types';

export const USER_ROLES: Record<UserRole, { name: string; description: string; permissions: string[] }> = {
  admin: {
    name: 'Administrator / Lead Data Scientist',
    description: 'Full system authorization: dataset management, model retraining, hyperparameter tuning, access control & audit logs.',
    permissions: ['upload_dataset', 'train_models', 'predict_single', 'predict_batch', 'export_reports', 'manage_users', 'view_security_logs'],
  },
  actuary: {
    name: 'Actuary / Risk Analyst',
    description: 'Data analytics & model assessment: run statistical tests, exploratory data analysis, evaluation, and report export.',
    permissions: ['upload_dataset', 'train_models', 'predict_single', 'predict_batch', 'export_reports'],
  },
  underwriter: {
    name: 'Underwriter / Insurance Agent',
    description: 'Operational risk assessment: execute single & batch predictions, view risk breakdown & customer risk scores.',
    permissions: ['predict_single', 'predict_batch', 'export_reports'],
  },
};

/**
 * End-to-End Encryption simulation (AES-GCM simulation using Web Crypto API or reversible hash encoding)
 */
export async function encryptSensitiveData(text: string, secretKey: string = 'INSURANCE_CLAIM_SECURE_KEY_2026'): Promise<string> {
  if (!text) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const keyData = encoder.encode(secretKey.padEnd(32, '0').slice(0, 32));

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch {
    // Fallback encoding if crypto API unavailable in mock
    return btoa(text);
  }
}

export async function decryptSensitiveData(cipherText: string, secretKey: string = 'INSURANCE_CLAIM_SECURE_KEY_2026'): Promise<string> {
  if (!cipherText) return '';
  try {
    const binary = atob(cipherText);
    const combined = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey.padEnd(32, '0').slice(0, 32));

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    try {
      return atob(cipherText);
    } catch {
      return cipherText;
    }
  }
}

export function createAuditLog(
  username: string,
  role: UserRole,
  action: string,
  details: string
): AuditLogEntry {
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    username,
    role,
    action,
    details,
  };
}
