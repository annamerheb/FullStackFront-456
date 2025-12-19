// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

// eslint.config.js
// @ts-check

export default tseslint.config(
  // Ignore patterns
  {
    ignores: ['src/stories/**', 'src/app/dev/**', 'src/mocks/**'],
  },

  // TypeScript / .ts
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettierConfig, // turn off rules that conflict with Prettier
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Angular selector rules (yours)
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      // Run Prettier via ESLint
      'prettier/prettier': 'error',
      // Relax rules for existing codebase
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },

  // Templates / .html
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      prettierConfig, // keep template lint rules from fighting formatting
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Let Prettier format HTML too
      'prettier/prettier': 'error',
      // Relax accessibility rules for existing codebase
      '@angular-eslint/template/label-has-associated-control': 'warn',
      '@angular-eslint/template/no-negated-async': 'warn',
    },
  },
);
