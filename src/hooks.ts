// This file contains React hooks and is optional
// It will only work if react-i18next and i18next are installed

// Define types here to avoid circular dependencies
export interface TranslationOptions {
  defaultValue?: string;
  count?: number;
  context?: string;
  replace?: Record<string, unknown>;
  [key: string]: any;
}

export type TranslationKey = string;

export interface TypedTFunction {
  (key: TranslationKey, options?: TranslationOptions): string;
}

function stripPrefix(key: TranslationKey | string): string {
    // Remove the 'l:' prefix if present
    if (typeof key === 'string' && key.startsWith('l:')) {
        return key.substring(2);
    }
    return key;
}

// Type-safe translation function
export const t: TypedTFunction = ((key: TranslationKey | string, options?: TranslationOptions) => {
    try {
        const i18n = require('i18next');
        return i18n.t(stripPrefix(key), options);
    } catch (error) {
        console.warn('i18next not available, returning key as fallback');
        return stripPrefix(key);
    }
}) as TypedTFunction;

// Type-safe useTranslation hook
export function useTranslation() {
    try {
        const { useTranslation: useI18nTranslation } = require('react-i18next');
        const { t: rawT, i18n: i18nInstance } = useI18nTranslation();

        const tFunction = ((key: TranslationKey | string, options?: TranslationOptions) => {
            return rawT(stripPrefix(key), options);
        }) as TypedTFunction;

        return { t: tFunction, i18n: i18nInstance };
    } catch (error) {
        throw new Error('react-i18next is required to use useTranslation hook. Please install it: npm install react-i18next i18next');
    }
}

// Re-export original useTranslation if available
export function useI18nTranslation() {
    try {
        const { useTranslation } = require('react-i18next');
        return useTranslation();
    } catch (error) {
        throw new Error('react-i18next is required. Please install it: npm install react-i18next i18next');
    }
}
