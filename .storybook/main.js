const path = require('path');

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            additionalData: `
              @import "@/styles/resources/index.scss";
            `,
          }
        }
      ],
    })

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, "../src"),
      '~': path.resolve(__dirname, "../src"),
    }

    return config
  },
  framework: "@storybook/vue3"
}
