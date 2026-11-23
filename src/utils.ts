/**
 * 生成确定性的序列号（演示用）
 */
export function generateSerialNumber(domain: string): string {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    const char = domain.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(16, '0');
}

/**
 * 清理域名输入
 */
export function cleanDomain(domain: string): string {
  return domain.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
}

/**
 * JSON API 响应
 */
export function jsonResponse(data: object, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
