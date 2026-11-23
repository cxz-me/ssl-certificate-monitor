import type { Env } from './types';
import { checkSSLCertificate } from './certificate';
import { generateHTML } from './html';
import { jsonResponse, cleanDomain } from './utils';
import { SITE_CONFIG } from './config';

/**
 * SSL 证书监控 - Cloudflare Worker 主入口
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // API 接口
    if (path === '/api/check') {
      const domain = url.searchParams.get('domain');
      if (!domain) return jsonResponse({ error: '缺少 domain 参数' }, 400);

      const result = await checkSSLCertificate(cleanDomain(domain));
      return jsonResponse(result);
    }

    // 健康检查
    if (path === '/health') {
      return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // robots.txt
    if (path === '/robots.txt') {
      return new Response(`User-agent: *\nAllow: /\n\nSitemap: https://${SITE_CONFIG.domain}/sitemap.xml`, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // sitemap.xml
    if (path === '/sitemap.xml') {
      return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${SITE_CONFIG.domain}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      });
    }

    // Web 页面
    const domainParam = url.searchParams.get('domain');
    let result;
    if (domainParam) {
      result = await checkSSLCertificate(cleanDomain(domainParam));
    }

    return new Response(generateHTML(domainParam ?? undefined, result), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
