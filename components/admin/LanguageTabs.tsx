'use client'

interface LanguageTabsProps {
  activeLanguage: 'en' | 'ar'
  onLanguageChange: (lang: 'en' | 'ar') => void
}

export default function LanguageTabs({ activeLanguage, onLanguageChange }: LanguageTabsProps) {
  return (
    <div className="flex bg-white/5 p-1 border border-white/10 rounded-xl w-fit">
      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={`px-8 py-2 rounded-lg text-sm font-medium transition-all ${
          activeLanguage === 'en'
            ? 'bg-brand-primary text-brand-dark shadow-md'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => onLanguageChange('ar')}
        className={`px-8 py-2 rounded-lg text-sm font-medium transition-all ${
          activeLanguage === 'ar'
            ? 'bg-brand-primary text-brand-dark shadow-md'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
      >
        العربية (Arabic)
      </button>
    </div>
  )
}
