import type { CertificateInfo, CheckResult } from './types';
import { generateSerialNumber } from './utils';

/**
 * 检测域名的 SSL 证书
 * 注意：当前为演示实现，实际证书信息为模拟数据
 * 生产环境需要接入真实的 TLS 证书解析
 */
export async function checkSSLCertificate(domain: string): Promise<CheckResult> {
  try {
    // 发起 HEAD 请求检测连通性
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    await fetch(`https://${domain}`, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'manual',
    });

    clearTimeout(timeoutId);

    // 模拟证书信息（实际应从 TLS 握手中提取）
    const now = new Date();
    const notBefore = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const notAfter = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const daysUntilExpiry = Math.floor((notAfter.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

    const certificateInfo: CertificateInfo = {
      domain,
      subject: `CN=${domain}`,
      issuer: "CN=Let's Encrypt Authority X3, O=Let's Encrypt, C=US",
      serialNumber: generateSerialNumber(domain),
      notBefore: notBefore.toISOString(),
      notAfter: notAfter.toISOString(),
      daysUntilExpiry,
      isValid: daysUntilExpiry > 0,
      isExpired: daysUntilExpiry <= 0,
      isExpiringSoon: daysUntilExpiry > 0 && daysUntilExpiry <= 30,
      signatureAlgorithm: 'SHA256-RSA',
      subjectAltNames: [domain, `www.${domain}`],
      checkedAt: now.toISOString(),
    };

    return { success: true, certificate: certificateInfo };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}
