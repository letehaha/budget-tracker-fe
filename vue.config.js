const path = require('path');

module.exports = {
  devServer: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "~@/styles/resources/index.scss";
        `,
      },
    },
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('shared-types', path.resolve(__dirname, './shared-types'));
  },
};
