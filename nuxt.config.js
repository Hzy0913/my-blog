const webpack = require('webpack')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'binlive',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'keywords', content: 'binlive博客 vue ssr blog,前端开发,前端,web开发,node,vue,react,webpack,git' },
      { hid: 'description', name: 'description', content: 'binlive博客 vue ssr blog,前端开发,前端,web开发,node,vue,react,webpack,git' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#44C1B8', height: '4px' },
  vender:[
    'element-ui', 'axios', '~untils/index.js'
  ],
  css: [
    'element-ui/lib/theme-chalk/index.css',
    {src: '@/style/style.css', lang: 'css'}
  ],
  plugins: [
    { src: '~plugins/element-ui', ssr: true }
  ],
  /*
  ** Build configuration
  */
  build: {
    build: {
      vendor: ['element-ui', 'axios', 'Button', 'Input', 'Tabs', 'Message', 'TabPane', 'Row', 'Col', 'Loading', 'Notification', 'Icon']
    },
    analyze: false,
    plugins: [
      new webpack.ContextReplacementPlugin(
        /highlight\.js\/lib\/languages$/,
        new RegExp(`^./(${['javascript', 'css', 'php', 'sql', 'python', 'bash'].join('|')})$`),
      )
    ],
    babel: {
      plugins: [['component', [{
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }]]],
      comments: true
    },
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: [
    ['/api', { target: 'http://localhost:3080' }]
  ]
}
