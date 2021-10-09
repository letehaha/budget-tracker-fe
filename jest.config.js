module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    // process *.vue files with vue-jest
    '^.+\\.vue$': require.resolve('vue-jest'),
    '.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    require.resolve('jest-transform-stub'),
    '^.+\\.jsx?$': require.resolve('babel-jest'),
    '^.+\\.js?$': require.resolve('babel-jest'),
    '^.+\\.md?$': require.resolve('markdown-loader-jest'),
  },
  transformIgnorePatterns: ['/node_modules/'],
  // support the same @ -> src alias mapping in source code
  moduleNameMapper: {
    '^@/(.*svg)(\\?inline)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|scss|less)$': 'identity-obj-proxy',
  },
  // serializer for snapshots
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/cypress/'],
  // https://github.com/facebook/jest/issues/6766
  testURL: 'http://localhost/',
  testEnvironment: 'jsdom',
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
  globals: {
    NODE_ENV: 'test',
  },
};
