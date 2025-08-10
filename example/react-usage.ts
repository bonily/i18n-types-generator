// Example of using the custom useTranslation hook from i18n-types-generator
// This demonstrates type-safe translation with the generated types

// Import the custom hook and types
// Note: You would import this from 'i18n-types-generator/react' in a real project
import { useTranslation, t } from '../src/react';

// Example React component using the type-safe hook
function MyComponent() {
    // The useTranslation hook returns a type-safe t function
    const { t: translate, i18n } = useTranslation();

    // All these calls are type-safe with autocomplete and error checking
    const welcomeMessage = translate('l:Common.welcome');
    const loginText = translate('l:Auth.login');
    const saveButton = translate('l:Common.buttons.save');
    const errorMessage = translate('l:Auth.errors.invalidCredentials');

    // You can also use the standalone t function
    const helloWorld = t('l:Common.hello.world');
    const forgotPassword = t('l:Auth.forgot.password');

    // With options
    const loadingMessage = translate('l:Common.messages.loading', {
        defaultValue: 'Loading...'
    });

    // This would cause a TypeScript error (uncomment to test):
    // const invalid = translate('l:Common.nonexistent'); // ❌ Type error!
    // const invalid2 = t('l:InvalidNamespace.key'); // ❌ Type error!

    return {
        welcomeMessage,
        loginText,
        saveButton,
        errorMessage,
        helloWorld,
        forgotPassword,
        loadingMessage
    };
}

// Example of a utility function that accepts translation keys
function getLocalizedMessage(key: Parameters<typeof t>[0]) {
    return t(key);
}

// Usage examples
const examples = {
    // These are all type-safe
    welcome: getLocalizedMessage('l:Common.welcome'),
    login: getLocalizedMessage('l:Auth.login'),
    submit: getLocalizedMessage('l:Common.buttons.submit')
};

console.log('React usage examples:', examples);

export { MyComponent, getLocalizedMessage };
