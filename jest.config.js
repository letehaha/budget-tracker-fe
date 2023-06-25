module.exports = {
  preset: 'ts-jest',
  verbose: true,
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    // process *.vue files with vue-jest
    '.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
      'jest-transform-stub',
    ),
    '^.+\\.vue?$': require.resolve('@vue/vue3-jest'),
    '^.+\\.ts?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    }],
  },
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^tests/(.*)$': '<rootDir>/tests/$1',
    '\\.(css|scss|less)$': 'identity-obj-proxy',
    // Jest doesn't work with lodash-es directly. This option will replace
    // lodash-es with the commonjs version during testing runtime.
    '^lodash-es$': 'lodash',
  },
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/cypress/'],
  // https://github.com/facebook/jest/issues/6766
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  testEnvironment: 'jsdom',
  globals: {
    NODE_ENV: 'test',
  },
};
