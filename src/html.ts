import type { CheckResult } from './types';
import { SITE_CONFIG } from './config';

/**
 * 生成中文 HTML 页面
 */
export function generateHTML(domain?: string, result?: CheckResult): string {
  const statusColor = result?.certificate?.isValid
    ? (result.certificate.isExpiringSoon ? '#f59e0b' : '#10b981')
    : result ? '#ef4444' : '#6b7280';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSL 证书监控 - 检测证书过期时间</title>
  <meta name="description" content="免费 SSL 证书过期检测工具，监控证书有效期，提前预警避免服务中断">
  <meta name="keywords" content="SSL证书监控, 证书过期检测, TLS证书检查, 证书到期提醒">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .card-shadow { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); }
  </style>
</head>
<body class="min-h-screen bg-gray-50">
  <!-- 顶部 -->
  <header class="gradient-bg text-white py-16">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">SSL 证书监控</h1>
      <p class="text-xl opacity-90 mb-8">检测 SSL 证书过期时间，避免服务中断</p>

      <!-- 检测表单 -->
      <form action="/" method="GET" class="max-w-xl mx-auto">
        <div class="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="domain"
            value="${domain || ''}"
            placeholder="输入域名（如 example.com）"
            class="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          >
          <button type="submit" class="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition">
            检测证书
          </button>
        </div>
      </form>
    </div>
  </header>

  <!-- 检测结果 -->
  ${result ? `
  <section class="max-w-4xl mx-auto px-4 -mt-8">
    <div class="bg-white rounded-xl card-shadow p-6 md:p-8">
      ${result.success && result.certificate ? `
        <div class="flex items-center gap-3 mb-6">
          <div class="w-4 h-4 rounded-full" style="background-color: ${statusColor}"></div>
          <h2 class="text-2xl font-bold text-gray-900">${result.certificate.domain}</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- 状态卡片 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase mb-3">证书状态</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">是否有效</span>
                <span class="font-medium ${result.certificate.isValid ? 'text-green-600' : 'text-red-600'}">
                  ${result.certificate.isValid ? '是' : '否'}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">剩余天数</span>
                <span class="font-medium" style="color: ${statusColor}">${result.certificate.daysUntilExpiry} 天</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">即将过期</span>
                <span class="font-medium ${result.certificate.isExpiringSoon ? 'text-amber-600' : 'text-gray-900'}">
                  ${result.certificate.isExpiringSoon ? '是（30天内）' : '否'}
                </span>
              </div>
            </div>
          </div>

          <!-- 有效期卡片 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-500 uppercase mb-3">有效期</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">生效时间</span>
                <span class="font-medium text-gray-900">${new Date(result.certificate.notBefore).toLocaleDateString('zh-CN')}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">过期时间</span>
                <span class="font-medium text-gray-900">${new Date(result.certificate.notAfter).toLocaleDateString('zh-CN')}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">检测时间</span>
                <span class="font-medium text-gray-900">${new Date(result.certificate.checkedAt).toLocaleString('zh-CN')}</span>
              </div>
            </div>
          </div>

          <!-- 证书详情 -->
          <div class="bg-gray-50 rounded-lg p-4 md:col-span-2">
            <h3 class="text-sm font-medium text-gray-500 uppercase mb-3">证书详情</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <span class="text-gray-600">颁发机构：</span>
                <p class="font-mono text-sm text-gray-900 mt-1 break-all">${result.certificate.issuer}</p>
              </div>
              <div>
                <span class="text-gray-600">主体：</span>
                <p class="font-mono text-sm text-gray-900 mt-1">${result.certificate.subject}</p>
              </div>
              <div>
                <span class="text-gray-600">签名算法：</span>
                <p class="font-mono text-sm text-gray-900 mt-1">${result.certificate.signatureAlgorithm}</p>
              </div>
              <div>
                <span class="text-gray-600">序列号：</span>
                <p class="font-mono text-sm text-gray-900 mt-1">${result.certificate.serialNumber}</p>
              </div>
              <div class="md:col-span-2">
                <span class="text-gray-600">备用名称（SAN）：</span>
                <div class="flex flex-wrap gap-2 mt-1">
                  ${result.certificate.subjectAltNames.map((san: string) => `<span class="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded">${san}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : `
        <div class="text-center py-8">
          <div class="text-red-500 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">检测失败</h2>
          <p class="text-gray-600">${result.error}</p>
        </div>
      `}
    </div>
  </section>
  ` : ''}

  <!-- 功能介绍 -->
  <section class="max-w-4xl mx-auto px-4 py-16">
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">为什么要监控 SSL 证书？</h2>
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg p-6 card-shadow">
        <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">防止服务中断</h3>
        <p class="text-gray-600 text-sm">证书过期会导致浏览器安全警告，影响用户访问。</p>
      </div>
      <div class="bg-white rounded-lg p-6 card-shadow">
        <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">提前预警</h3>
        <p class="text-gray-600 text-sm">在证书到期前 30、14、7 天收到提醒，从容续期。</p>
      </div>
      <div class="bg-white rounded-lg p-6 card-shadow">
        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">信任与安全</h3>
        <p class="text-gray-600 text-sm">有效的 SSL 证书建立用户信任，保护数据传输安全。</p>
      </div>
    </div>
  </section>

  <!-- API 说明 -->
  <section class="bg-gray-100 py-16">
    <div class="max-w-4xl mx-auto px-4">
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">RESTful API</h2>
      <div class="bg-gray-900 rounded-lg p-6 overflow-x-auto">
        <code class="text-sm">
          <span class="text-green-400">GET</span> <span class="text-white">/api/check?domain=example.com</span>
        </code>
      </div>
      <p class="text-gray-600 text-center mt-4">将 SSL 监控集成到你的 CI/CD 流水线或监控系统中。</p>
    </div>
  </section>

  <!-- 底部 -->
  <footer class="bg-gray-900 text-gray-400 py-8">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <p class="mb-2">SSL 证书监控 by <a href="${SITE_CONFIG.authorUrl}" class="text-white hover:underline">${SITE_CONFIG.author}</a></p>
      <p class="text-sm">免费 SSL 证书过期检测工具，无需注册。</p>
    </div>
  </footer>
</body>
</html>`;
}
