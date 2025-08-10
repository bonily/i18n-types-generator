// This file exports React hooks and utilities
// It's separate from the main index to avoid requiring react-i18next as a dependency

export { useTranslation, t, useI18nTranslation } from './hooks';
export type { 
  TranslationKey, 
  TranslationOptions, 
  TypedTFunction, 
  TranslationNamespace 
} from './types';
