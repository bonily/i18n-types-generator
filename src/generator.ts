import fs from 'fs';
import path from 'path';

export interface GeneratorOptions {
  localesPath: string;
  outputDir: string;
  defaultNamespace?: string;
  baseLocale?: string;
}

export interface TranslationTree {
  [key: string]: string | TranslationTree;
}

export interface NamespaceTranslations {
  [namespace: string]: TranslationTree;
}

export class I18nTypesGenerator {
  private options: Required<GeneratorOptions>;

  constructor(options: GeneratorOptions) {
    this.options = {
      defaultNamespace: 'Common',
      baseLocale: 'ru',
      ...options
    };
  }

  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    } else {
      console.log(`Directory exists: ${dir}`);
    }
  }

  private parseJsonFile(filePath: string): TranslationTree {
    try {
      console.log(`Parsing JSON file: ${filePath}`);
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error parsing JSON file ${filePath}: ${error}`);
      return {};
    }
  }

  private generateTypeInterface(tree: TranslationTree, prefix = ''): string[] {
    return Object.entries(tree).map(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        return this.generateTypeInterface(value, fullKey).join('\n');
      }
      return `  '${fullKey}': string;`;
    });
  }

  private generateNamespaceTypes(translations: NamespaceTranslations): string {
    const namespaceInterfaces = Object.entries(translations).map(([ns, tree]) => {
      const interfaceContent = this.generateTypeInterface(tree).join('\n');
      return `export interface ${ns}Namespace {\n${interfaceContent}\n}`;
    });

    return namespaceInterfaces.join('\n\n');
  }

  private aggregateMetaTranslations(metaPath: string): TranslationTree {
    const translations: TranslationTree = {};

    try {
      const subdirs = fs.readdirSync(metaPath, { withFileTypes: true }).filter(dir => dir.isDirectory());

      for (const subdir of subdirs) {
        const subdirName = subdir.name;
        const jsonPath = path.join(metaPath, subdirName, `${this.options.baseLocale}.json`);

        if (fs.existsSync(jsonPath)) {
          console.log(`Processing Meta subdirectory: ${subdirName}`);
          translations[subdirName] = this.parseJsonFile(jsonPath);
        }
      }

      return translations;
    } catch (error) {
      console.error(`Error processing Meta directory: ${error}`);
      return {};
    }
  }

  private collectTranslations(): NamespaceTranslations {
    console.log('Processing namespace directories...');
    const translations: NamespaceTranslations = {};
    
    const namespaceDirs = fs.readdirSync(this.options.localesPath, { withFileTypes: true })
      .filter(dir => dir.isDirectory());

    for (const dir of namespaceDirs) {
      const ns = dir.name;
      const jsonPath = path.join(this.options.localesPath, ns, `${this.options.baseLocale}.json`);
      const tsPath = path.join(this.options.localesPath, ns, `${this.options.baseLocale}.ts`);

      if (fs.existsSync(jsonPath)) {
        // Simple pattern: direct ru.json file
        translations[ns] = this.parseJsonFile(jsonPath);
      } else if (fs.existsSync(tsPath) && ns === 'Meta') {
        // Complex pattern: Meta folder with TypeScript aggregation
        console.log(`Processing Meta namespace with subdirectories...`);
        const metaTranslations = this.aggregateMetaTranslations(path.join(this.options.localesPath, ns));

        // Add Meta as a single namespace containing all subdirectories
        translations[ns] = metaTranslations;
      }
    }

    return translations;
  }

  private generateInterfacesFile(translations: NamespaceTranslations): string {
    const namespaceTypes = this.generateNamespaceTypes(translations);
    
    return `/* eslint-disable */
// AUTO-GENERATED FILE. DO NOT EDIT.

${namespaceTypes}
`;
  }

  private generateTypesFile(translations: NamespaceTranslations): string {
    const allNamespaces = Object.keys(translations).join(' | ');

    return `// AUTO-GENERATED FILE. DO NOT EDIT.
import {
${Object.keys(translations)
    .map(ns => `  ${ns}Namespace,`)
    .join('\n')}
} from './i18n.interfaces';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: '${this.options.defaultNamespace}';
    resources: {
      ${Object.keys(translations)
          .map(ns => `${ns}: ${ns}Namespace`)
          .join(';\n      ')};
    };
  }
}

export type TranslationNamespace = ${allNamespaces};

type StaticTranslationKey = ${Object.keys(translations)
        .map(ns => `| \`l:${ns}.\${keyof ${ns}Namespace}\``)
        .join('\n')};

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
  interface UseTranslationResponse<Ns extends Namespace = DefaultNamespace> {
    t: (key: TranslationKey, options?: TranslationOptions) => string;
    i18n: typeof i18n;
    ready: boolean;
  }
  
  export function useTranslation<Ns extends Namespace = DefaultNamespace>(
    ns?: Ns | Ns[],
    options?: UseTranslationOptions<Ns>
  ): UseTranslationResponse<Ns>;
}

export interface TypedTFunction {
  (key: TranslationKey, options?: TranslationOptions): string;
}

// Module augmentation for i18n-types-generator hooks
declare module 'i18n-types-generator/hooks' {
  interface TypedTFunction<T extends string = string> {
    (key: T, options?: TranslationOptions): string;
  }
  
  const t: TypedTFunction<StaticTranslationKey>;
  
  function useTranslation<T extends string = StaticTranslationKey>(): { 
    t: TypedTFunction<T>; 
    i18n: any 
  };
}

declare module 'i18n-types-generator/react' {
  interface TypedTFunction<T extends string = string> {
    (key: T, options?: TranslationOptions): string;
  }
  
  const t: TypedTFunction<StaticTranslationKey>;
  
  function useTranslation<T extends string = StaticTranslationKey>(): { 
    t: TypedTFunction<T>; 
    i18n: any 
  };
}
`;
  }

  public generate(): void {
    console.log('Starting type generation...');
    
    if (!fs.existsSync(this.options.localesPath)) {
      throw new Error(`Locales directory does not exist: ${this.options.localesPath}`);
    }

    const translations = this.collectTranslations();

    if (Object.keys(translations).length === 0) {
      console.log('⚠️ No translation files found.');
      return;
    }

    this.ensureDirectoryExists(this.options.outputDir);

    const interfacesContent = this.generateInterfacesFile(translations);
    const typesContent = this.generateTypesFile(translations);

    const interfacesPath = path.join(this.options.outputDir, 'i18n.interfaces.d.ts');
    const typesPath = path.join(this.options.outputDir, 'i18n.d.ts');

    console.log(`Writing interfaces file: ${interfacesPath}`);
    fs.writeFileSync(interfacesPath, interfacesContent, 'utf-8');

    console.log(`Writing types file: ${typesPath}`);
    fs.writeFileSync(typesPath, typesContent, 'utf-8');

    const filesExist = fs.existsSync(typesPath) && fs.existsSync(interfacesPath);
    if (filesExist) {
      console.log('✅ Generated type files successfully');
    } else {
      console.error('❌ Failed to create type files');
      throw new Error('Failed to create type files');
    }
  }
}
