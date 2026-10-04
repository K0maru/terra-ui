import { translations, type Locale, type Translations } from './dict'

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = localStorage.getItem('terra_locale')
    if (saved === 'zh' || saved === 'en') {
      return saved
    }
  } catch {
    // ignore security/localStorage errors
  }
  return 'en'
}

class I18nManager {
  private _locale = $state<Locale>(getInitialLocale())

  get locale(): Locale {
    return this._locale
  }

  setLocale = (newLocale: Locale) => {
    this._locale = newLocale
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('terra_locale', newLocale)
      } catch {
        // ignore
      }
    }
  }

  get t(): Translations {
    return translations[this._locale]
  }
}

export const i18n = new I18nManager()
