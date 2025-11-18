const { DefinePlugin } = require('webpack');

module.exports = {
  transpileDependencies: true,

  configureWebpack: {
    plugins: [
      new DefinePlugin({
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true)
      })
    ]
  },

  devServer: {
    port: 8081, // 🔥 프론트 포트 명확히 지정
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 🔥 백엔드 주소
        changeOrigin: true
       
      }
    }
  }
};
