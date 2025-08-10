#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { I18nTypesGenerator } from './generator';
import { loadConfig, createDefaultConfigFile } from './config';

const program = new Command();

program
  .name('i18n-types-gen')
  .description('Generate TypeScript types from i18next translation files')
  .version('1.0.0');

program
  .option('-c, --config <path>', 'Path to config file')
  .option('-l, --locales <path>', 'Path to locales directory (overrides config)')
  .option('-o, --output <path>', 'Output directory for generated types (overrides config)')
  .option('-d, --default-namespace <name>', 'Default namespace (overrides config)')
  .option('-b, --base-locale <locale>', 'Base locale to use for type generation (overrides config)')
  .option('--verbose', 'Enable verbose logging', false)
  .action((options) => {
    try {
      // Load config file first
      const config = loadConfig(options.config);
      
      // Override config with CLI options if provided
      const finalConfig = {
        localesPath: options.locales ? path.resolve(process.cwd(), options.locales) : path.resolve(process.cwd(), config.localesPath),
        outputDir: options.output ? path.resolve(process.cwd(), options.output) : path.resolve(process.cwd(), config.outputDir),
        defaultNamespace: options.defaultNamespace || config.defaultNamespace,
        baseLocale: options.baseLocale || config.baseLocale
      };

      if (options.verbose) {
        console.log('Configuration:');
        console.log(`  Locales path: ${finalConfig.localesPath}`);
        console.log(`  Output directory: ${finalConfig.outputDir}`);
        console.log(`  Default namespace: ${finalConfig.defaultNamespace}`);
        console.log(`  Base locale: ${finalConfig.baseLocale}`);
        console.log('');
      }

      const generator = new I18nTypesGenerator(finalConfig);
      generator.generate();
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Add init command to create config file
program
  .command('init')
  .description('Create a default configuration file')
  .option('-o, --output <path>', 'Output path for config file', 'i18n-types.config.js')
  .action((options) => {
    try {
      createDefaultConfigFile(options.output);
    } catch (error) {
      console.error('Error creating config file:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
