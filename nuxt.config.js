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
      { hid: 'binlive vue ssr blog,前端开发,前端,web开发,node,vue,react,webpack,git', name: 'binlive vue ssr blog,前端开发,前端,web开发,node,vue,react,webpack,git', content: 'binlive vue ssr blog,前端开发,前端,web开发,node,vue,react,webpack,git' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  vender:[
    'element-ui', 'axios'
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
