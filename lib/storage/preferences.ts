/**
 * Accessibility Preferences Persistence Module
 * Member C — Platform / Data Engineer (V2 Accessibility)
 */

export interface AccessibilityPreferences {
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  simplifiedLanguage: boolean;
  autoReadAloud: boolean;
}

const PREFERENCES_STORAGE_KEY = 'visart_accessibility_prefs';

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  simplifiedLanguage: false,
  autoReadAloud: false,
};

export function getStoredPreferences(): AccessibilityPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveStoredPreferences(prefs: Partial<AccessibilityPreferences>): AccessibilityPreferences {
  const current = getStoredPreferences();
  const updated = { ...current, ...prefs };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save accessibility preferences:', e);
    }
  }
  return updated;
}
