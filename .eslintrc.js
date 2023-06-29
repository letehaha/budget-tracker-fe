module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2020,
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],

  ignorePatterns: ['cypress/**/*', 'cypress.config.ts'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    // 'plugin:vue/vue3-essential',
    // 'plugin:vue/vue3-recommended',
    // '@vue/airbnb',
    // '@vue/typescript/recommended',
  ],

  plugins: [
    // required to lint *.vue files
    'vue',
    'react-refresh',
    '@typescript-eslint',
  ],

  settings: {
    'import/resolver': {
      typescript: {},
    },
  },

  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 1,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-empty': ['error', {
      allowEmptyCatch: true,
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
      ],
    }],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'import/extensions': 'off',
    'import/no-named-as-default': 'off',
    'import/prefer-default-export': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-unresolved': ['error', {
      ignore: ['.svg'],
    }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-unused-vars': 'off',
    'no-useless-catch': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'arrow-body-style': 'warn',
    'func-names': [1, 'as-needed'],
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'arrow-parens': 'off',
    'vue/no-v-for-template-key': 'off',
    'no-restricted-syntax': 'off',
    'global-require': 'off',
    'no-plusplus': 'off',
    'max-len': 'off',
    'prefer-destructuring': 'off',
    'vue/max-len': ['warn', {
      code: 100,
      template: 100,
      tabWidth: 2,
      comments: 100,
      ignorePattern: '',
      ignoreComments: false,
      ignoreTrailingComments: false,
      ignoreUrls: false,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreHTMLAttributeValues: false,
      ignoreHTMLTextContents: false,
    }],
    'vue/no-unused-components': 'warn',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error', {
      allow: ['state', 'getters'],
    }],
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/no-autofocus': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vue/component-definition-name-casing': [1, 'kebab-case'],
    'vue/no-deprecated-router-link-tag-prop': 'warn',
  },
};
