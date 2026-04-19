export type ProjectType = 'design' | 'programming' | 'applications';

export type ProjectFilterType = 'design' | 'programming';

export function normalizeProjectType(value: unknown): ProjectType {
  if (typeof value !== 'string') return 'design';
  const normalized = value.trim().toLowerCase();

  if (
    normalized === 'applications' ||
    normalized === 'application' ||
    normalized === 'apps' ||
    normalized === 'app' ||
    normalized === 'mobile app' ||
    normalized === 'mobile' ||
    normalized === 'تطبيقات' ||
    normalized === 'تطبيق' ||
    normalized === 'موبايل'
  ) {
    return 'applications';
  }

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
  if (type === 'applications') {
    return isArabic ? 'تطبيقات' : 'Applications';
  }
  if (type === 'programming') {
    return isArabic ? 'برمجة' : 'Programming';
  }
  return isArabic ? 'تصميم' : 'Design';
}

export function getProjectFilterType(type: ProjectType): ProjectFilterType {
  if (type === 'applications') {
    return 'programming';
  }
  return type;
}
