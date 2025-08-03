// app/ua/DiagnosticInfo.tsx
'use client';

import { useState, useEffect } from 'react';

export default function DiagnosticInfo() {
  const [diagnosis, setDiagnosis] = useState<any>(null);

  useEffect(() => {
    const checkDiagnosis = () => {
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      const isAndroid = /Android/.test(ua);

      // 1. meta viewport
      const meta = document.querySelector('meta[name="viewport"]');
      const metaContent = meta ? meta.getAttribute('content') : null;

      // 2. visual viewport（关键！判断是否缩放）
      const visualViewportScale = 'visualViewport' in window ? window.visualViewport?.scale || 1 : 1;

      // 3. 内容是否溢出
      const documentWidth = document.documentElement.scrollWidth;
      const viewportWidth = window.innerWidth;
      const isContentOverflow = documentWidth > viewportWidth * 1.05; // 容差 5%

      // 4. 检查最小 input 字体（iOS 会放大 <16px 的输入框）
      let smallestInputFont = Infinity;
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach((el) => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        if (fontSize < smallestInputFont) smallestInputFont = fontSize;
      });
      if (smallestInputFont === Infinity) smallestInputFont = 0;

      // 5. iOS 版本提取
      let iosVersion = null;
      if (isIOS) {
        const match = ua.match(/OS (\d+)_(\d+)_?(\d*)/);
        if (match) {
          iosVersion = `${match[1]}.${match[2]}.${match[3] || '0'}`;
        }
      }

      // 6. 辅助功能启发式：如果页面被放大且字体很小，可能是“更大字体”模式
      const prefersLargeText = isIOS && visualViewportScale > 1.3 && smallestInputFont < 16;

      return {
        timestamp: new Date().toISOString(),
        isIOS,
        isAndroid,
        iosVersion,
        devicePixelRatio: window.devicePixelRatio,
        reportedDPR: window.devicePixelRatio,
        viewport: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          visualViewportScale, // 1.0 = 正常，>1.0 = 被放大
        },
        screen: {
          width: screen.width,
          height: screen.height,
        },
        layout: {
          documentScrollWidth: document.documentElement.scrollWidth,
          bodyClientWidth: document.body?.clientWidth || 0,
          isContentOverflow,
        },
        metaViewport: metaContent,
        text: {
          smallestInputFont,
          prefersLargeText,
        },
        environment: {
          href: location.href,
          referrer: document.referrer,
        },
        warnings: getWarnings({
          visualViewportScale,
          isContentOverflow,
          smallestInputFont,
          metaContent,
          isIOS,
        }),
      };
    };

    const getWarnings = (data: any) => {
      const warns = [];

      if (data.visualViewportScale > 1.1) {
        warns.push('⚠️ 页面已被放大（缩放级别: ' + data.visualViewportScale.toFixed(2) + '）');
      }

      if (!data.metaContent || !data.metaContent.includes('width=device-width')) {
        warns.push('❌ 缺少或无效的 meta viewport 标签');
      }

      if (data.isContentOverflow) {
        warns.push('⚠️ 页面内容超出视口，可能触发自动缩放');
      }

      if (data.isIOS && typeof data.smallestInputFont === 'number' && data.smallestInputFont < 16) {
        warns.push(`⚠️ iOS 设备：输入框字体 ${data.smallestInputFont}px < 16px，可能触发自动放大`);
      }

      if (data.prefersLargeText) {
        warns.push('ℹ️ 检测到可能启用了“更大字体”辅助功能');
      }

      return warns;
    };

    const update = () => setDiagnosis(checkDiagnosis());
    update();

    window.addEventListener('resize', update);
    window.addEventListener('scroll', update);
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', update);
      window.visualViewport?.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
      if ('visualViewport' in window) {
        window.visualViewport?.removeEventListener('resize', update);
        window.visualViewport?.removeEventListener('scroll', update);
      }
    };
  }, []);

  if (!diagnosis) {
    return <p className="text-slate-500">诊断中...</p>;
  }

  return (
    <div className="space-y-6">
      {/* 警告信息 */}
      {diagnosis.warnings.length > 0 && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <h3 className="text-sm font-bold text-red-800 mb-2">🚨 检测到潜在问题</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {diagnosis.warnings.map((w: string, i: number) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 缩放级别 */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-700">页面缩放级别</h3>
          <p className="mt-1 text-lg font-mono text-slate-900">
            ×{diagnosis.viewport.visualViewportScale.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{diagnosis.viewport.visualViewportScale > 1.1 ? '被放大' : '正常'}</p>
        </div>

        {/* meta viewport */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-700">Meta Viewport</h3>
          <p className="mt-1 text-xs font-mono text-slate-900 leading-tight">
            {diagnosis.metaViewport || '未设置'}
          </p>
        </div>

        {/* 内容溢出 */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-700">内容是否溢出</h3>
          <p
            className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
              diagnosis.layout.isContentOverflow
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {diagnosis.layout.isContentOverflow ? '是' : '否'}
          </p>
        </div>

        {/* 最小输入字体 */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-700">最小输入框字体</h3>
          <p className="mt-1 text-lg font-mono text-slate-900">
            {diagnosis.text.smallestInputFont > 0
              ? `${diagnosis.text.smallestInputFont}px`
              : '未知'}
          </p>
        </div>

        {/* iOS 版本 */}
        {diagnosis.isIOS && (
          <div className="rounded-lg border bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-700">iOS 版本</h3>
            <p className="mt-1 text-lg font-mono text-slate-900">{diagnosis.iosVersion}</p>
          </div>
        )}

        {/* 设备类型 */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-700">设备类型</h3>
          <p className="mt-1 text-lg font-mono text-slate-900">
            {diagnosis.isIOS ? 'iOS' : diagnosis.isAndroid ? 'Android' : 'Desktop'}
          </p>
        </div>
      </div>
    </div>
  );
}