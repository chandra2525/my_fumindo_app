const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // publicPath: '/',
  publicPath: process.env.NODE_ENV === 'production' ? process.env.BASE_URL : '/',
  // publicPath: process.env.NODE_ENV === 'production' ? '/var/www/my_fumindo_app/frontendweb/dist/' : '/',
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
  devServer: {
    allowedHosts: ['my.fumindo.com']
  },
  productionSourceMap: false,  // Nonaktifkan source maps untuk mengurangi ukuran build
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  transpileDependencies: true
})
// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   publicPath: '/',
//   // publicPath: process.env.NODE_ENV === 'production' ? process.env.BASE_URL : '/',

//   pluginOptions: {
//     i18n: {
//       locale: 'en',
//       fallbackLocale: 'en',
//       localeDir: 'locales',
//       enableInSFC: false
//     }
//   },
//   transpileDependencies: true
// })
