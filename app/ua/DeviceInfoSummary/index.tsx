/**
 * @file 设备信息
 * @author v_zhangyulin@baidu.com
 */

// app/ua/DeviceInfoSummary.tsx
'use client';

import { useState, useEffect } from 'react';

export default function DeviceInfoSummary() {
  const [info, setInfo] = useState<{
    viewport: { width: number; height: number };
    screen: { width: number; height: number; ratio: number };
    isMobile: boolean;
    deviceType: string;
    platform: string;
    orientation: string;
  } | null>(null);

  useEffect(() => {
    const updateInfo = () => {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isTablet = /\(iPad|Android.*?(?:Mobile)?[;)][^)]*?AppleWebKit/i.test(navigator.userAgent) && !/(iPhone|Mobile)/.test(navigator.userAgent);

      const type = isTablet ? 'Tablet' : isMobile ? 'Phone' : 'Desktop';

      const orientation =
        typeof window.screen.orientation !== 'undefined'
          ? window.screen.orientation.type
          : 'unknown';

      setInfo({
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        screen: {
          width: screen.width,
          height: screen.height,
          ratio: window.devicePixelRatio,
        },
        isMobile,
        deviceType: type,
        platform: navigator.platform || 'Unknown',
        orientation,
      });
    };

    updateInfo();
    window.addEventListener('resize', updateInfo);
    return () => window.removeEventListener('resize', updateInfo);
  }, []);

  if (!info) {
    return <p className="text-slate-500">加载中...</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* 视口尺寸 */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700">Viewport 尺寸</h3>
        <p className="mt-1 text-lg font-mono text-slate-900">
          {info.viewport.width} × {info.viewport.height}
        </p>
        <p className="mt-1 text-xs text-slate-500">浏览器可见区域</p>
      </div>

      {/* 屏幕分辨率 */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700">屏幕分辨率</h3>
        <p className="mt-1 text-lg font-mono text-slate-900">
          {info.screen.width} × {info.screen.height}
        </p>
        <p className="mt-1 text-xs text-slate-500">设备物理屏幕</p>
      </div>

      {/* 像素比 */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700">设备像素比</h3>
        <p className="mt-1 text-lg font-mono text-slate-900">×{info.screen.ratio}</p>
        <p className="mt-1 text-xs text-slate-500">如：Retina 屏为 2 或 3</p>
      </div>

      {/* 设备类型 */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700">设备类型</h3>
        <p
          className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
            info.deviceType === 'Desktop'
              ? 'bg-blue-100 text-blue-800'
              : info.deviceType === 'Tablet'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {info.deviceType}
        </p>
      </div>

      {/* 操作平台 */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700">操作系统平台</h3>
        <p className="mt-1 font-mono text-sm text-slate-900">{info.platform}</p>
      </div>

      {/* 屏幕方向 */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700">屏幕方向</h3>
        <p className="mt-1 text-sm text-slate-900 capitalize">{info.orientation}</p>
      </div>
    </div>
  );
}