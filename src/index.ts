export { I18nTypesGenerator } from './generator';
export type { 
  GeneratorOptions, 
  TranslationTree, 
  NamespaceTranslations 
} from './generator';

export { loadConfig, createDefaultConfigFile, findConfigFile } from './config';
export type { I18nConfig, ConfigFileOptions } from './config';

// Export only the non-generated types from ./types
// TranslationKey and TranslationNamespace should be imported from generated files
export type { 
  TranslationOptions, 
  TypedTFunction
} from './types';
