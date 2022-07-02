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

    config.module.rules.delete('svg')

    config.module
      .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  },
};
