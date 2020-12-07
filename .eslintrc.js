module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 1,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
      ],
    }],
    'import/extensions': ['error', {
      svg: 'never',
    }],
    'no-unused-vars': 'warn',
    'arrow-body-style': 'warn',
    'import/no-named-as-default': 'off',
    'func-names': [1, 'as-needed'],
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'arrow-parens': 'off',
    'vue/no-v-for-template-key': 'off',
    'import/prefer-default-export': 'off',
    'import/no-dynamic-require': 'off',
    'import/extensions': ['error', {
      svg: 'never',
    }],
    'no-restricted-syntax': 'off',
    'global-require': 'off',
    'no-plusplus': 'off',
    'max-len': 'off',
    'vue/max-len': ['warn', {
      'code': 80,
      'template': 80,
      'tabWidth': 2,
      'comments': 100,
      'ignorePattern': '',
      'ignoreComments': false,
      'ignoreTrailingComments': false,
      'ignoreUrls': false,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreRegExpLiterals': true,
      'ignoreHTMLAttributeValues': false,
      'ignoreHTMLTextContents': false,
    }],
    'vue/no-unused-components': 'warn',
    'import/no-unresolved': ['error', {
      ignore: ['\.svg']
    }],
    'no-shadow': ['error', {
      'allow': ['state'],
    }],
  },
}
