module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': ['warn'],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-misused-promises': ['off', { checksVoidReturn: false }],
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'no-multi-spaces': ['off', { ignoreEOLComments: true, exceptions: { VariableDeclarator: false, ImportDeclaration: true } }],
    // 'padding-line-between-statements': [
    //  'error',
    //  { blankLine: 'always', prev: '*', next: 'return' },
    //  { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
    //  { blankLine: 'any', prev: 'import', next: 'import' },
    // ],
    'no-else-return': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        pathGroups: [
          {
            pattern: '@**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
  },
};
