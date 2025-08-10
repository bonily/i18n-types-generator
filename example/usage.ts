// This file demonstrates how to use the generated types
// Note: This is just an example - you would need to install i18next and react-i18next to actually run this

import { TranslationKey, TranslationOptions } from './types/i18n';

// Example of using the generated types with i18next
function exampleUsage() {
  // These are all type-safe translation keys
  const validKeys: TranslationKey[] = [
    'l:Common.welcome',
    'l:Common.hello.world',
    'l:Common.buttons.save',
    'l:Auth.login',
    'l:Auth.forgot.password',
    'l:Auth.form.email'
  ];

  console.log('Valid translation keys:', validKeys);

  // Example function that accepts only valid translation keys
  function translate(key: TranslationKey, options?: TranslationOptions): string {
    // In a real app, this would use i18next's t function
    return `Translation for: ${key}`;
  }

  // These will work (type-safe)
  const welcome = translate('l:Common.welcome');
  const loginButton = translate('l:Auth.login');
  const saveButton = translate('l:Common.buttons.save', { defaultValue: 'Save' });

  console.log(welcome);
  console.log(loginButton);
  console.log(saveButton);

  // This would cause a TypeScript error (uncomment to test):
  // const invalid = translate('l:Common.nonexistent'); // ❌ Type error!

  return {
    welcome,
    loginButton,
    saveButton
  };
}

// Example with React component (pseudo-code)
interface Props {
  translationKey: TranslationKey;
  options?: TranslationOptions;
}

function TypeSafeTranslation({ translationKey, options }: Props) {
  // In a real React app with react-i18next:
  // const { t } = useTranslation();
  // return <span>{t(translationKey, options)}</span>;
  
  return `<span>${translationKey}</span>`;
}

// Usage examples
const examples = [
  TypeSafeTranslation({ translationKey: 'l:Common.welcome' }),
  TypeSafeTranslation({ translationKey: 'l:Auth.login' }),
  TypeSafeTranslation({ 
    translationKey: 'l:Common.messages.loading',
    options: { defaultValue: 'Loading...' }
  })
];

console.log('Component examples:', examples);

export { exampleUsage, TypeSafeTranslation };
