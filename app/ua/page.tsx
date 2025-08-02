/**
 * @file ua查询工具
 * @author Liam Zhang
 */

// app/ua/page.tsx
import JsonViewClient from './JsonViewClient'; // 这个组件是客户端的

export default function UAPage() {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-5">
          <h1 className="text-2xl font-bold text-slate-800">🔍 UA 信息查询工具</h1>
          <p className="mt-1 text-sm text-slate-600">
            检测你的浏览器、操作系统、设备等详细信息
          </p>
        </div>

        {/* User Agent Bar */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
          <p className="text-sm">
            <span className="font-medium text-slate-700">User-Agent:</span>{' '}
            <code className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-800">
              {userAgent}
            </code>
          </p>
        </div>

        {/* JSON View */}
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-700">📊 详细解析结果</h2>
          <JsonViewClient />
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-center">
          <p className="text-xs text-slate-500">
            Powered by <span className="font-mono text-slate-700">ua-parser-js</span> & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}