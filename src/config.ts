import fs from 'fs';
import path from 'path';

export interface I18nConfig {
  localesPath: string;
  outputDir: string;
  defaultNamespace?: string;
  baseLocale?: string;
}

export interface ConfigFileOptions extends I18nConfig {
  // Additional config file specific options can be added here
  watch?: boolean;
  exclude?: string[];
}

const DEFAULT_CONFIG: I18nConfig = {
  localesPath: './src/locales',
  outputDir: './types',
  defaultNamespace: 'Common',
  baseLocale: 'ru'
};

const CONFIG_FILE_NAMES = [
  'i18n-types.config.js',
  'i18n-types.config.json',
  '.i18n-types.config.js',
  '.i18n-types.config.json'
];

export function findConfigFile(startDir: string = process.cwd()): string | null {
  let currentDir = startDir;
  
  while (currentDir !== path.dirname(currentDir)) {
    for (const configFileName of CONFIG_FILE_NAMES) {
      const configPath = path.join(currentDir, configFileName);
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }
    currentDir = path.dirname(currentDir);
  }
  
  return null;
}

export function loadConfig(configPath?: string): I18nConfig {
  let config = { ...DEFAULT_CONFIG };
  
  // If no config path provided, try to find one
  if (!configPath) {
    configPath = findConfigFile() || undefined;
  }
  
  if (configPath && fs.existsSync(configPath)) {
    try {
      console.log(`Loading config from: ${configPath}`);
      
      if (configPath.endsWith('.json')) {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const fileConfig = JSON.parse(configContent) as ConfigFileOptions;
        config = { ...config, ...fileConfig };
      } else if (configPath.endsWith('.js')) {
        // Clear require cache to allow hot reloading
        delete require.cache[require.resolve(configPath)];
        const fileConfig = require(configPath) as ConfigFileOptions;
        config = { ...config, ...fileConfig };
      }
    } catch (error) {
      console.warn(`Warning: Could not load config file ${configPath}: ${error}`);
    }
  }
  
  return config;
}

export function createDefaultConfigFile(outputPath: string = 'i18n-types.config.js'): void {
  const configContent = `module.exports = {
  // Path to your locales directory
  localesPath: './src/locales',
  
  // Output directory for generated types
  outputDir: './types',
  
  // Default namespace for i18next
  defaultNamespace: 'Common',
  
  // Base locale to use for type generation
  baseLocale: 'ru',
  
  // Watch for changes (future feature)
  // watch: false,
  
  // Exclude certain namespaces or files (future feature)
  // exclude: ['internal']
};
`;

  fs.writeFileSync(outputPath, configContent, 'utf-8');
  console.log(`Created config file: ${outputPath}`);
}
