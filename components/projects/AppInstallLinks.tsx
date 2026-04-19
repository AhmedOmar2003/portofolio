'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';

type AppInstallLinksProps = {
  isArabic: boolean;
  androidUrl?: string;
  iosUrl?: string;
};

function shortenUrl(url: string, max = 48) {
  if (url.length <= max) return url;
  return `${url.slice(0, max).trimEnd()}...`;
}

export default function AppInstallLinks({ isArabic, androidUrl, iosUrl }: AppInstallLinksProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);

  const appLinks = [
    { key: 'android', label: isArabic ? 'نسخة Android' : 'Android Demo', url: androidUrl },
    { key: 'ios', label: isArabic ? 'نسخة iOS' : 'iOS Demo', url: iosUrl },
  ].filter((item): item is { key: string; label: string; url: string } => Boolean(item.url && item.url.trim().length > 0));

  const handleCopy = async (key: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedKey(key);
      setCopiedMessage(
        isArabic
          ? 'تم النسخ. افتح الرابط على أي متصفح (مثل Chrome) ثم ثبّت التطبيق عندك.'
          : 'Copied. Open the link in a browser (e.g. Chrome) and install the app.'
      );

      setTimeout(() => {
        setCopiedKey(null);
        setCopiedMessage(null);
      }, 1800);
    } catch {
      setCopiedMessage(isArabic ? 'تعذّر نسخ الرابط، انسخه يدويًا.' : 'Could not copy automatically. Please copy it manually.');
      setTimeout(() => setCopiedMessage(null), 1800);
    }
  };

  if (appLinks.length === 0) return null;

  return (
    <div className={`mt-6 w-full ${isArabic ? 'text-right' : ''}`}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        {isArabic ? 'النسخة التجريبية للتطبيق' : 'App Demo'}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {appLinks.map((item) => (
          <div key={item.key} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-[#8df6c8]"
            >
              {item.label}
              <ArrowUpRight className={`h-3.5 w-3.5 ${isArabic ? 'rtl-flip' : ''}`} aria-hidden="true" />
            </a>

            <div className={`mt-3 flex items-center gap-2 ${isArabic ? 'justify-end' : ''}`}>
              <code dir="ltr" className="max-w-[220px] truncate rounded-md bg-black/30 px-2 py-1 text-[0.72rem] text-slate-300">
                {shortenUrl(item.url)}
              </code>
              <button
                type="button"
                onClick={() => void handleCopy(item.key, item.url)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/12 bg-white/[0.03] px-2 py-1 text-xs text-slate-200 transition hover:border-white/25 hover:text-white"
              >
                {copiedKey === item.key ? <Check className="h-3.5 w-3.5 text-[#8df6c8]" /> : <Copy className="h-3.5 w-3.5" />}
                {isArabic ? 'نسخ' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {isArabic
          ? 'انسخ اللينك وافتحه على أي متصفح (مثال: Chrome) وثبّت التطبيق عندك.'
          : 'Copy the link, open it in any browser (e.g. Chrome), then install the app.'}
      </p>

      {copiedMessage ? <p className="mt-2 text-xs text-[#8df6c8]">{copiedMessage}</p> : null}
    </div>
  );
}
