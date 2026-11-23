export interface Env {
  SSL_KV: KVNamespace;
  SSL_DB: D1Database;
  ENVIRONMENT: string;
}

export interface CertificateInfo {
  domain: string;
  subject: string;
  issuer: string;
  serialNumber: string;
  notBefore: string;
  notAfter: string;
  daysUntilExpiry: number;
  isValid: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
  signatureAlgorithm: string;
  subjectAltNames: string[];
  checkedAt: string;
}

export interface CheckResult {
  success: boolean;
  certificate?: CertificateInfo;
  error?: string;
}
