# i18n Types Generator

A CLI tool for generating TypeScript types from i18next translation files. This tool automatically creates type-safe interfaces for your internationalization files, ensuring type safety when using i18next with TypeScript.

## Features

-   🔧 **Automatic Type Generation**: Creates TypeScript interfaces from your translation JSON files
-   🌍 **i18next Integration**: Full compatibility with i18next and react-i18next
-   📁 **Flexible Structure**: Supports both simple and complex directory structures
-   🎯 **Type Safety**: Ensures compile-time safety for translation keys
-   🚀 **CLI Tool**: Easy to integrate into your build process
-   📦 **Zero Dependencies**: Minimal runtime dependencies

## Installation

```bash
# Install globally
npm install -g i18n-types-generator

# Or install as dev dependency
npm install --save-dev i18n-types-generator
```

## Quick Start (No Installation Required)

If you don't want to install the package globally, you can use `npx` to run it directly:

```bash
# Create a configuration file
npx i18n-types-generator init

# Generate types
npx i18n-types-generator

# Generate with custom options
npx i18n-types-generator --locales ./src/locales --output ./types
```

## Usage

### Configuration File

Create a configuration file to customize the behavior:

```bash
# If installed globally
i18n-types-gen init

# If using npx (recommended for beginners)
npx i18n-types-generator init

# Create config file at custom location
npx i18n-types-generator init --output my-config.js
```

The tool automatically detects your project type and creates the appropriate config file format:

**For CommonJS projects** (creates `i18n-types.config.js`):

```javascript
module.exports = {
    // Path to your locales directory
    localesPath: "./src/locales",

    // Output directory for generated types
    outputDir: "./types",

    // Default namespace for i18next
    defaultNamespace: "Common",

    // Base locale to use for type generation
    baseLocale: "ru",
};
```

**For ES Module projects** (creates `i18n-types.config.mjs`):

```javascript
export default {
    // Path to your locales directory
    localesPath: "./src/locales",

    // Output directory for generated types
    outputDir: "./types",

    // Default namespace for i18next
    defaultNamespace: "Common",

    // Base locale to use for type generation
    baseLocale: "ru",
};
```

**Manual format selection:**

```bash
# Force CommonJS format
npx i18n-types-generator init --output i18n-types.config.cjs

# Force ES Module format
npx i18n-types-generator init --output i18n-types.config.mjs

# Auto-detect based on project type
npx i18n-types-generator init
```

### CLI Usage

**With npx (no installation required):**

```bash
# Use config file (auto-detected)
npx i18n-types-generator

# Use specific config file
npx i18n-types-generator --config ./my-config.js

# Override config with CLI options
npx i18n-types-generator --locales ./src/locales --output ./types

# With verbose output
npx i18n-types-generator --verbose
```

**If installed globally:**

```bash
# Use config file (auto-detected)
i18n-types-gen

# Use specific config file
i18n-types-gen --config ./my-config.js

# Override config with CLI options
i18n-types-gen --locales ./src/locales --output ./types

# With verbose output
i18n-types-gen --verbose
```

### CLI Options

-   `-c, --config <path>` - Path to config file
-   `-l, --locales <path>` - Path to locales directory (overrides config)
-   `-o, --output <path>` - Output directory for generated types (overrides config)
-   `-d, --default-namespace <name>` - Default namespace (overrides config)
-   `-b, --base-locale <locale>` - Base locale to use for type generation (overrides config)
-   `--verbose` - Enable verbose logging

### CLI Commands

**With npx:**

-   `npx i18n-types-generator` - Generate types using config file or default options
-   `npx i18n-types-generator init` - Create a default configuration file

**If installed globally:**

-   `i18n-types-gen` - Generate types using config file or default options
-   `i18n-types-gen init` - Create a default configuration file

### Programmatic Usage

```typescript
import { I18nTypesGenerator } from "i18n-types-generator";

const generator = new I18nTypesGenerator({
    localesPath: "./src/locales",
    outputDir: "./types",
    defaultNamespace: "Common",
    baseLocale: "en",
});

generator.generate();
```

## Directory Structure

The tool supports two directory structures:

### Simple Structure

```
src/locales/
├── Common/
│   └── en.json
├── Auth/
│   └── en.json
└── Dashboard/
    └── en.json
```

### Complex Structure (Meta namespace)

```
src/locales/
├── Common/
│   └── en.json
├── Auth/
│   └── en.json
└── Meta/
    ├── Users/
    │   └── en.json
    ├── Products/
    │   └── en.json
    └── Orders/
        └── en.json
```

## Generated Files

The tool generates two files in your output directory:

### `i18n.interfaces.d.ts`

Contains the namespace interfaces:

```typescript
export interface CommonNamespace {
    welcome: string;
    "hello.world": string;
}

export interface AuthNamespace {
    login: string;
    logout: string;
}
```

### `i18n.d.ts`

Contains the main type definitions and module declarations:

```typescript
import { CommonNamespace, AuthNamespace } from "./i18n.interfaces";

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "Common";
        resources: {
            Common: CommonNamespace;
            Auth: AuthNamespace;
        };
    }
}

export type TranslationKey = `l:Common.${keyof CommonNamespace}` | `l:Auth.${keyof AuthNamespace}`;
```

## Integration with TypeScript Projects

1. Add the generated types to your TypeScript configuration:

```json
{
    "compilerOptions": {
        "typeRoots": ["./types", "./node_modules/@types"]
    }
}
```

2. Use with standard react-i18next (basic type safety):

```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
    const { t } = useTranslation();

    // Basic type safety through i18next module augmentation
    // TypeScript knows about namespaces but not specific keys
    return <div>{t("welcome", { ns: "Common" })}</div>;
}
```

3. Use the enhanced type-safe hooks (full type safety):

```typescript
// Import the enhanced hooks from the package for full type safety
import { useTranslation, t } from "i18n-types-generator/react";

function MyComponent() {
    const { t } = useTranslation();

    // Fully type-safe with autocomplete - no type assertions needed!
    return <div>{t("l:Common.welcome")}</div>;
}

// Or use the standalone t function with automatic type safety
const message = t("l:Auth.login");
```

**Important Note**:

-   **Standard react-i18next**: Gets basic type safety through i18next module augmentation (knows namespaces, not specific keys)
-   **Enhanced hooks**: Get full type safety with autocomplete for your exact translation keys using the `l:Namespace.key` format
-   The generated types include module augmentation that enhances our package's types with your specific translation keys

## Package.json Scripts

Add to your `package.json`:

```json
{
    "scripts": {
        "types:i18n": "npx i18n-types-generator",
        "i18n:watch": "nodemon --watch src/locales -e json --exec \"npm run types:i18n\"",
        "build": "npm run types:i18n && tsc"
    },
    "devDependencies": {
        "nodemon": "^3.0.0"
    }
}
```

**Note:** If you have the package installed globally, you can use `"types:i18n": "i18n-types-gen"` instead.

### Development Workflow

For automatic type generation during development:

```bash
# Install nodemon for file watching
npm install --save-dev nodemon

# Run the watch script
npm run i18n:watch
```

This will automatically regenerate types whenever you modify your translation JSON files, providing a smooth development experience with always up-to-date TypeScript definitions.

## Example Translation Files

### Common/en.json

```json
{
    "welcome": "Welcome",
    "hello": {
        "world": "Hello World"
    },
    "buttons": {
        "save": "Save",
        "cancel": "Cancel"
    }
}
```

### Auth/en.json

```json
{
    "login": "Login",
    "logout": "Logout",
    "register": "Register",
    "forgot": {
        "password": "Forgot Password"
    }
}
```

This will generate types like:

```typescript
export interface CommonNamespace {
    welcome: string;
    "hello.world": string;
    "buttons.save": string;
    "buttons.cancel": string;
}

export interface AuthNamespace {
    login: string;
    logout: string;
    register: string;
    "forgot.password": string;
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/yourusername/i18n-types-generator).
