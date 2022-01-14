module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    // to get rid of babel warning when running Storybook
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
  ],
};
