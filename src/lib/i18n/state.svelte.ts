import { translations, type Locale, type Translations } from './dict'

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'zh'
  try {
    const saved = localStorage.getItem('terra_locale')
    if (saved === 'zh' || saved === 'en') {
      return saved
    }
  } catch {
    return 'zh'
  }
  return 'zh'
}

function syncDocumentLang(locale: Locale) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }
}

class I18nManager {
  private _locale = $state<Locale>(getInitialLocale())

  constructor() {
    syncDocumentLang(this._locale)
  }

  get locale(): Locale {
    return this._locale
  }

  setLocale = (newLocale: Locale) => {
    this._locale = newLocale
    syncDocumentLang(newLocale)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('terra_locale', newLocale)
      } catch {
        return
      }
    }
  }

  get t(): Translations {
    return translations[this._locale]
  }
}

export const i18n = new I18nManager()
