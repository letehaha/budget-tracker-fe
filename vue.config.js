module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "~@/assets/styles/resources/index.scss";
          @import "~@/assets/styles/index.scss";
        `
      }
    }
  }
};
