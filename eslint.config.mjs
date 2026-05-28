import globals from 'globals';
import pluginjs from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default [
    {
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    pluginjs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['./gen/*.{js,ts}'],
        files: ['**/*.{ts,mjs,ts}'],
        plugins: {
            prettier
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    tabWidth: 4,
                    trailingComma: 'all',
                    bracketSpacing: true,
                    printWidth: 120
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^ignore',
                    ignoreRestSiblings: true,
                },
            ],
            'eol-last': ['error', 'always'],
            indent: ['error', 4, { SwitchCase: 1 }],
            'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
            'max-lines-per-function': ['error', 30],
            'object-curly-spacing': ['error', 'always'],
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'quote-props': ['error', 'consistent-as-needed'],
            'sort-imports': [
                'error',
                { memberSyntaxSortOrder: ['single', 'all', 'multiple', 'none'], allowSeparatedGroups: true },
            ],
        },
    },
];
