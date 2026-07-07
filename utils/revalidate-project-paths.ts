import { revalidatePath } from 'next/cache'

const PUBLIC_LOCALES = ['en', 'ar'] as const

export function revalidateProjectPaths(slug?: string | null) {
  for (const locale of PUBLIC_LOCALES) {
    revalidatePath(`/${locale}`)
    revalidatePath(`/${locale}/projects`)

    if (slug) {
      revalidatePath(`/${locale}/projects/${slug}`)
    }
  }

  revalidatePath('/sitemap.xml')
}
