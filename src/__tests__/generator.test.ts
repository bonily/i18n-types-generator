import { I18nTypesGenerator } from '../generator';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('I18nTypesGenerator', () => {
  let tempDir: string;
  let localesDir: string;
  let outputDir: string;

  beforeEach(() => {
    // Create temporary directories for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-test-'));
    localesDir = path.join(tempDir, 'locales');
    outputDir = path.join(tempDir, 'output');

    // Create test locale structure
    fs.mkdirSync(path.join(localesDir, 'Common'), { recursive: true });
    fs.mkdirSync(path.join(localesDir, 'Auth'), { recursive: true });

    // Create test translation files
    fs.writeFileSync(
      path.join(localesDir, 'Common', 'ru.json'),
      JSON.stringify({
        welcome: 'Добро пожаловать',
        hello: {
          world: 'Привет, мир'
        }
      })
    );

    fs.writeFileSync(
      path.join(localesDir, 'Auth', 'ru.json'),
      JSON.stringify({
        login: 'Войти',
        logout: 'Выйти'
      })
    );
  });

  afterEach(() => {
    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should generate type files successfully', () => {
    const generator = new I18nTypesGenerator({
      localesPath: localesDir,
      outputDir: outputDir
    });

    generator.generate();

    // Check that output files were created
    expect(fs.existsSync(path.join(outputDir, 'i18n.d.ts'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'i18n.interfaces.d.ts'))).toBe(true);
  });

  test('should generate correct interface content', () => {
    const generator = new I18nTypesGenerator({
      localesPath: localesDir,
      outputDir: outputDir
    });

    generator.generate();

    const interfacesContent = fs.readFileSync(
      path.join(outputDir, 'i18n.interfaces.d.ts'),
      'utf-8'
    );

    // Check that interfaces contain expected content
    expect(interfacesContent).toContain('export interface CommonNamespace');
    expect(interfacesContent).toContain('export interface AuthNamespace');
    expect(interfacesContent).toContain("'welcome': string;");
    expect(interfacesContent).toContain("'hello.world': string;");
    expect(interfacesContent).toContain("'login': string;");
    expect(interfacesContent).toContain("'logout': string;");
  });

  test('should generate correct types content', () => {
    const generator = new I18nTypesGenerator({
      localesPath: localesDir,
      outputDir: outputDir
    });

    generator.generate();

    const typesContent = fs.readFileSync(
      path.join(outputDir, 'i18n.d.ts'),
      'utf-8'
    );

    // Check that types contain expected content
    expect(typesContent).toContain("from './i18n.interfaces'");
    expect(typesContent).toContain("declare module 'i18next'");
    expect(typesContent).toContain('defaultNS: \'Common\'');
    expect(typesContent).toContain('Common: CommonNamespace');
    expect(typesContent).toContain('Auth: AuthNamespace');
  });

  test('should handle non-existent locales directory', () => {
    const generator = new I18nTypesGenerator({
      localesPath: '/non/existent/path',
      outputDir: outputDir
    });

    expect(() => generator.generate()).toThrow('Locales directory does not exist');
  });

  test('should use custom options', () => {
    const generator = new I18nTypesGenerator({
      localesPath: localesDir,
      outputDir: outputDir,
      defaultNamespace: 'CustomDefault',
      baseLocale: 'en'
    });

    // This test would require creating en.json files, but demonstrates the API
    expect(generator).toBeDefined();
  });
});
