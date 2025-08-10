// This file contains React hooks and is optional
// It will only work if react-i18next and i18next are installed

// Base types - these will work with any string, including generated types
export interface TranslationOptions {
  defaultValue?: string;
  count?: number;
  context?: string;
  replace?: Record<string, unknown>;
  [key: string]: any;
}

// Generic function type that works with any string type
export interface TypedTFunction<T extends string = string> {
  (key: T, options?: TranslationOptions): string;
}

function stripPrefix(key: string): string {
    // Remove the 'l:' prefix if present
    if (key.startsWith('l:')) {
        return key.substring(2);
    }
    return key;
}

// Generic translation function that accepts any string type
export const t: TypedTFunction = ((key: string, options?: TranslationOptions) => {
    try {
        const i18n = require('i18next');
        return i18n.t(stripPrefix(key), options);
    } catch (error) {
        console.warn('i18next not available, returning key as fallback');
        return stripPrefix(key);
    }
}) as TypedTFunction;

// Generic useTranslation hook that works with any string type
export function useTranslation<T extends string = string>(): { t: TypedTFunction<T>; i18n: any } {
    try {
        const { useTranslation: useI18nTranslation } = require('react-i18next');
        const { t: rawT, i18n: i18nInstance } = useI18nTranslation();

        const tFunction: TypedTFunction<T> = (key: T, options?: TranslationOptions) => {
            return rawT(stripPrefix(key), options);
        };

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
