export function isArabicLocale(locale: string) {
  return locale === 'ar';
}

export function getLocaleDateFormat(locale: string) {
  return isArabicLocale(locale) ? 'ar-EG' : 'en-US';
}

export function localizedValue(
  item: Record<string, unknown> | null | undefined,
  baseName: string,
  locale: string,
  fallback = ''
) {
  if (!item) {
    return fallback;
  }

  const enValue = item[`${baseName}_en`];
  const arValue = item[`${baseName}_ar`];

  const preferred = isArabicLocale(locale) ? arValue : enValue;
  const secondary = isArabicLocale(locale) ? enValue : arValue;

  if (typeof preferred === 'string' && preferred.trim().length > 0) {
    return preferred;
  }

  if (typeof secondary === 'string' && secondary.trim().length > 0) {
    return secondary;
  }

  return fallback;
}
