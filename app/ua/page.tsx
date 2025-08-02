/**
 * @file ua查询工具
 * @author Liam Zhang
 */

'use client';

import { useEffect, useState, type FC } from 'react';
import { UAParser } from 'ua-parser-js';
import JsonView from 'react-json-view';
// import 'react-json-view/'; // 如果使用轻量版才需要，react-json-view 不需要

const UAPage: FC = () => {
  const [uaResult, setUaResult] = useState<any>(null);

  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getResult(); // 获取完整 UA 信息
    setUaResult(result);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔍 UA 信息查询工具</h1>
      <p><strong>当前 User-Agent:</strong> {navigator?.userAgent || 'Unknown'}</p>

      <h2>📊 详细解析结果</h2>
      {uaResult ? (
        <JsonView
          src={uaResult}
          theme="rjv-default"
          style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}
          collapsed={2}
          enableClipboard
          displayDataTypes={false}
          displayObjectSize
        />
      ) : (
        <p>加载中...</p>
      )}
    </div>
  );
};

export default UAPage;