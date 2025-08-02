/**
 * @file ua查询工具
 * @author Liam Zhang
 */

'use client';

import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import JsonView from 'react-json-view';

type UAResult = ReturnType<UAParser['getResult']>;

export default function UAPage() {
  const [uaResult, setUaResult] = useState<UAResult | null>(null);

  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getResult();
    setUaResult(result);
  }, []);

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
          {uaResult ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-1 shadow-inner">
              <JsonView
                src={uaResult}
                theme="rjv-default"
                style={{ background: 'transparent', fontSize: '13px' }}
                collapsed={2}
                enableClipboard
                displayObjectSize
                displayDataTypes={false}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-600"></div>
              <span className="ml-3 text-slate-600">加载中...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-center">
          <p className="text-xs text-slate-500">
            Powered by <span className="font-mono text-slate-700">zhangyulin.cn</span>
          </p>
        </div>
      </div>
    </div>
  );
}