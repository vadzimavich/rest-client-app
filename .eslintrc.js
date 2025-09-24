module.exports = {
  root: true,

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict',
    'next/core-web-vitals',
    'prettier',
  ],

  globals: {
    React: 'readonly',
  },

  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.d.ts', '**/*.test.ts', '**/*.test.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrors: 'none',
          },
        ],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-extraneous-class': 'off',

        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',

        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
      },
    },
  ],

  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'next-env.d.ts',
    'coverage/',
    'src/test-utils/test-utils.tsx',
  ],

  settings: {
    react: {
      version: 'detect',
    },
  },
};