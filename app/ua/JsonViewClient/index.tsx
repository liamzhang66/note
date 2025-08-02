'use client';

import { UAParser } from 'ua-parser-js';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 动态导入 react-json-view，并禁用 SSR
const JsonView = dynamic(() => import('react-json-view'), {
  ssr: false,
  loading: () => <p>加载中...</p>,
});

type UAResult = ReturnType<UAParser['getResult']>;

export default function JsonViewClient() {
  const [uaResult, setUaResult] = useState<UAResult | null>(null);

  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getResult();
    setUaResult(result);
  }, []);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-1 shadow-inner">
      <JsonView
        src={uaResult || {}}
        theme="rjv-default"
        style={{ background: 'transparent', fontSize: '13px' }}
        collapsed={2}
        enableClipboard
        displayObjectSize
        displayDataTypes={false}
      />
    </div>
  );
}