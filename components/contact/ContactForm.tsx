'use client';

import { useState, useRef, useId } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { sendContactEmail } from '@/app/actions/contact';

type FieldErrors = { name?: string; email?: string; message?: string };

function validateFields(
  name: string,
  email: string,
  message: string,
  t: (k: string) => string
): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = t('errorNameRequired');
  else if (name.trim().length > 100) errors.name = t('errorNameTooLong');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) errors.email = t('errorEmailRequired');
  else if (!emailRegex.test(email.trim())) errors.email = t('errorEmailInvalid');

  if (!message.trim()) errors.message = t('errorMessageRequired');
  else if (message.trim().length > 5000) errors.message = t('errorMessageTooLong');

  return errors;
}

export default function ContactForm() {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('ContactForm');
  const uid = useId();

  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Client-side validation first
    const errors = validateFields(name, email, message, t);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Focus first error field
      if (errors.name) nameRef.current?.focus();
      else if (errors.email) emailRef.current?.focus();
      else if (errors.message) messageRef.current?.focus();
      return;
    }

    setFieldErrors({});
    setIsPending(true);
    setStatus(null);

    try {
      const result = await sendContactEmail(formData);
      if (result.success) {
        setStatus({ type: 'success', message: result.message || t('success') });
        form.reset();
      } else {
        setStatus({ type: 'error', message: result.error || t('error') });
      }
    } catch {
      setStatus({ type: 'error', message: t('error') });
    } finally {
      setIsPending(false);
      // Move focus to status message
      setTimeout(() => statusRef.current?.focus(), 100);
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full rounded-2xl border px-4 py-3.5 text-white placeholder:text-slate-500 bg-slate-950/70 transition-colors duration-150 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8df6c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] ${
      hasError
        ? 'border-rose-400/60 bg-rose-950/20'
        : 'border-white/10 hover:border-white/20'
    }`;

  return (
    <div className={`surface-panel rounded-[1.9rem] p-6 sm:p-8 ${isArabic ? 'text-right' : ''}`}>
      <div className="mb-6">
        <span className="eyebrow mb-4">{t('eyebrow')}</span>
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{t('title')}</h3>
        <p className="mt-3 text-base leading-7 text-slate-300">{t('subtitle')}</p>
      </div>

      {/* Global status message — receives focus after submission */}
      <div aria-live="polite" aria-atomic="true">
        {status ? (
          <div
            ref={statusRef}
            role={status.type === 'error' ? 'alert' : 'status'}
            tabIndex={-1}
            className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-4 text-sm focus-visible:outline-none ${isArabic ? 'flex-row-reverse' : ''} ${
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

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor={`${uid}-name`} className="text-sm font-medium text-slate-300">
              {t('name')} <span className="text-rose-400" aria-hidden="true">*</span>
            </label>
            <input
              ref={nameRef}
              id={`${uid}-name`}
              name="name"
              type="text"
              dir={isArabic ? 'rtl' : 'ltr'}
              required
              disabled={isPending}
              placeholder={t('namePlaceholder')}
              aria-required="true"
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? `${uid}-name-error` : undefined}
              className={inputClass(!!fieldErrors.name)}
            />
            {fieldErrors.name ? (
              <p id={`${uid}-name-error`} role="alert" className="flex items-center gap-1.5 text-xs text-rose-300">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor={`${uid}-email`} className="text-sm font-medium text-slate-300">
              {t('email')} <span className="text-rose-400" aria-hidden="true">*</span>
            </label>
            <input
              ref={emailRef}
              id={`${uid}-email`}
              name="email"
              type="email"
              dir="ltr"
              required
              disabled={isPending}
              placeholder={t('emailPlaceholder')}
              aria-required="true"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? `${uid}-email-error` : undefined}
              className={inputClass(!!fieldErrors.email)}
            />
            {fieldErrors.email ? (
              <p id={`${uid}-email-error`} role="alert" className="flex items-center gap-1.5 text-xs text-rose-300">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {fieldErrors.email}
              </p>
            ) : null}
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-subject`} className="text-sm font-medium text-slate-300">
            {t('subject')}
          </label>
          <input
            id={`${uid}-subject`}
            name="subject"
            type="text"
            dir={isArabic ? 'rtl' : 'ltr'}
            disabled={isPending}
            placeholder={t('subjectPlaceholder')}
            className={inputClass(false)}
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-message`} className="text-sm font-medium text-slate-300">
            {t('message')} <span className="text-rose-400" aria-hidden="true">*</span>
          </label>
          <textarea
            ref={messageRef}
            id={`${uid}-message`}
            name="message"
            rows={6}
            dir={isArabic ? 'rtl' : 'ltr'}
            required
            disabled={isPending}
            placeholder={t('messagePlaceholder')}
            aria-required="true"
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? `${uid}-message-error` : undefined}
            className={`${inputClass(!!fieldErrors.message)} resize-none`}
          />
          {fieldErrors.message ? (
            <p id={`${uid}-message-error`} role="alert" className="flex items-center gap-1.5 text-xs text-rose-300">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {fieldErrors.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="btn btn-primary w-full justify-center py-4 text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
        >
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
