import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

function mergeMessages(
  base: Record<string, unknown>,
  localized: Record<string, unknown>
): Record<string, unknown> {
  const merged = { ...base };

  Object.entries(localized).forEach(([key, value]) => {
    const baseValue = merged[key];

    if (
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue) &&
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      merged[key] = mergeMessages(
        baseValue as Record<string, unknown>,
        value as Record<string, unknown>
      );
      return;
    }

    merged[key] = value;
  });

  return merged;
}

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  const enMessages = (await import('../messages/en.json')).default;
  const localeMessages =
    locale === 'en'
      ? enMessages
      : mergeMessages(
          enMessages as Record<string, unknown>,
          (await import(`../messages/${locale}.json`)).default as Record<string, unknown>
        );

  return {
    locale,
    messages: localeMessages
  };
});
