const { DefinePlugin } = require('webpack'); // DefinePlugin 임포트 추가

module.exports = {
  transpileDependencies: true,

  // Webpack 설정 추가
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true)
      })
    ]
  },

  // 프록시 설정
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버 URL
        changeOrigin: true,
        pathRewrite: { '^/api': '' } // /api로 시작하는 요청을 백엔드에 전달
      }
    }
  }
};