'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { sendContactEmail } from '@/app/actions/contact';

export default function ContactForm() {
  const t = useTranslations('ContactForm');
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await sendContactEmail(formData);

    if (result.success) {
      setStatus({ type: 'success', message: result.message || t('success') });
      form.reset();
    } else {
      setStatus({ type: 'error', message: result.error || t('error') });
    }

    setIsPending(false);
  }

  return (
    <div className="surface-panel rounded-[1.9rem] p-6 sm:p-8">
      <div className="mb-6">
        <span className="eyebrow mb-4">{t('eyebrow')}</span>
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{t('title')}</h3>
        <p className="mt-3 text-base leading-7 text-slate-300">{t('subtitle')}</p>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {status ? (
          <div
            role="status"
            className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-4 text-sm ${
              status.type === 'success'
                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                : 'border-rose-400/20 bg-rose-400/10 text-rose-200'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            )}
            <p>{status.message}</p>
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-300">
              {t('name')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={isPending}
              placeholder={t('namePlaceholder')}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-white placeholder:text-slate-500 disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-300">
              {t('email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isPending}
              placeholder={t('emailPlaceholder')}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-white placeholder:text-slate-500 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium text-slate-300">
            {t('subject')}
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            disabled={isPending}
            placeholder={t('subjectPlaceholder')}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-white placeholder:text-slate-500 disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-slate-300">
            {t('message')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            disabled={isPending}
            placeholder={t('messagePlaceholder')}
            className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-white placeholder:text-slate-500 disabled:opacity-60"
          />
        </div>

        <button type="submit" disabled={isPending} className="btn btn-primary w-full justify-center py-4 text-sm sm:text-base">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t('sending')}
            </>
          ) : (
            t('submit')
          )}
        </button>
      </form>
    </div>
  );
}
