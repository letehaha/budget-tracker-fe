module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    // process *.vue files with vue-jest
    '.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
      'jest-transform-stub',
    ),
    '^.+\\.vue?$': require.resolve('@vue/vue3-jest'),
  },
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^tests/(.*)$': '<rootDir>/tests/$1',
    '\\.(css|scss|less)$': 'identity-obj-proxy',
  },
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/cypress/'],
  // https://github.com/facebook/jest/issues/6766
  testURL: 'http://localhost/',
  testEnvironment: 'jsdom',
  globals: {
    NODE_ENV: 'test',
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    },
  },
};
