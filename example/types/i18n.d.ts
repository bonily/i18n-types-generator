// AUTO-GENERATED FILE. DO NOT EDIT.
import {
  AuthNamespace,
  CommonNamespace,
} from './i18n.interfaces';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'Common';
    resources: {
      Auth: AuthNamespace;
      Common: CommonNamespace;
    };
  }
}

export type TranslationNamespace = Auth | Common;

type StaticTranslationKey = | `l:Auth.${keyof AuthNamespace}`
| `l:Common.${keyof CommonNamespace}`;

export type TranslationKey = StaticTranslationKey;

export interface TranslationOptions {
  defaultValue?: string;
  count?: number;
  context?: string;
  replace?: Record<string, unknown>;
  [key: string]: any;
}

declare module 'i18next' {
  interface TFunction {
    (key: string, options?: TranslationOptions): string;
  }
}

declare module 'react-i18next' {
  export interface UseTranslationResponse {
    t: (key: TranslationKey, options?: TranslationOptions) => string;
    i18n: typeof i18n;
  }
}

export interface TypedTFunction {
  (key: TranslationKey, options?: TranslationOptions): string;
}
