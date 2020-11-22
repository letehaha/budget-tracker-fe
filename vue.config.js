module.exports = {
  devServer: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "~@/assets/styles/resources/index.scss";
        `,
      },
    },
  },
};
