export type ProjectType = 'design' | 'programming';

export function normalizeProjectType(value: unknown): ProjectType {
  if (typeof value !== 'string') return 'design';
  const normalized = value.trim().toLowerCase();

  if (
    normalized === 'programming' ||
    normalized === 'development' ||
    normalized === 'dev' ||
    normalized === 'coding' ||
    normalized === 'code' ||
    normalized === 'برمجة' ||
    normalized === 'تطوير'
  ) {
    return 'programming';
  }

  return 'design';
}

export function getProjectTypeLabel(type: ProjectType, locale: string): string {
  const isArabic = locale === 'ar';
  if (type === 'programming') {
    return isArabic ? 'برمجة' : 'Programming';
  }
  return isArabic ? 'تصميم' : 'Design';
}
