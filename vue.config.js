module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    https: false,
    host: "localhost",
    port: 8088,
    proxy: {
      [process.env.VUE_APP_BAES_API]: {
        target: process.env.VUE_APP_SERVICE_URL,
        changOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BAES_API]: ""
        }
      }
    }
  }
};
