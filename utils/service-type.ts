export type ServiceType = 'full_design_development' | 'ux_ui_design';

export function normalizeServiceType(value: unknown): ServiceType {
  if (typeof value !== 'string') return 'full_design_development';
  const normalized = value.trim().toLowerCase();

  if (
    normalized === 'ux_ui_design' ||
    normalized === 'ux_ui' ||
    normalized === 'ui_ux' ||
    normalized === 'ui/ux' ||
    normalized === 'ux/ui' ||
    normalized === 'design' ||
    normalized === 'تصميم' ||
    normalized === 'تصميم ux/ui' ||
    normalized === 'ux ui'
  ) {
    return 'ux_ui_design';
  }

  return 'full_design_development';
}

export function getServiceTypeLabel(type: ServiceType, locale: string): string {
  const isArabic = locale === 'ar';
  if (type === 'ux_ui_design') {
    return isArabic ? 'تصميم UX / UI' : 'UX / UI Design';
  }
  return isArabic ? 'برمجة كاملة بالتصميم' : 'Full Design & Development';
}
