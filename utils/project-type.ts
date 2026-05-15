export type ProjectType = 'design' | 'programming' | 'applications' | 'ui_design' | 'branding' | 'ux_research';

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

  if (
    normalized === 'ui_design' ||
    normalized === 'ui/ux' ||
    normalized === 'ui design' ||
    normalized === 'تصميم واجهات'
  ) {
    return 'ui_design';
  }

  if (
    normalized === 'branding' ||
    normalized === 'brand' ||
    normalized === 'هوية بصرية' ||
    normalized === 'هوية'
  ) {
    return 'branding';
  }

  if (
    normalized === 'ux_research' ||
    normalized === 'ux research' ||
    normalized === 'أبحاث تجربة المستخدم' ||
    normalized === 'أبحاث'
  ) {
    return 'ux_research';
  }

  return 'design';
}

export function getProjectTypeLabel(type: ProjectType, locale: string): string {
  const isArabic = locale === 'ar';
  if (type === 'applications') return isArabic ? 'تطبيقات' : 'Applications';
  if (type === 'programming') return isArabic ? 'برمجة' : 'Programming';
  if (type === 'ui_design') return isArabic ? 'تصميم واجهات' : 'UI Design';
  if (type === 'branding') return isArabic ? 'هوية بصرية' : 'Branding';
  if (type === 'ux_research') return isArabic ? 'أبحاث تجربة المستخدم' : 'UX Research';
  return isArabic ? 'تصميم' : 'Design';
}

export function getProjectRoleLabel(type: ProjectType, locale: string): string {
  const isArabic = locale === 'ar';
  if (type === 'design' || type === 'ui_design' || type === 'branding') {
    return isArabic ? 'مصمم' : 'Designer';
  }
  if (type === 'ux_research') {
    return isArabic ? 'باحث تجربة مستخدم' : 'UX Researcher';
  }
  return isArabic ? 'مصمم ومطور' : 'Designer & Developer';
}

export function getProjectFilterType(type: ProjectType): ProjectFilterType {
  if (type === 'applications') {
    return 'programming';
  }
  // ui_design, branding, ux_research fall under design filter
  if (type === 'ui_design' || type === 'branding' || type === 'ux_research') {
    return 'design';
  }
  return type;
}
