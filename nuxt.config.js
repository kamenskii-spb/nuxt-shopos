/* eslint-disable max-len */
const colors = require('vuetify/es5/util/colors').default
const axios = require('axios')
const keys = require('./server/keys')
const isDev = !(process.env.NODE_ENV === 'production')


module.exports = {
  mode: 'universal',
  head: {
    htmlAttrs: {
      lang: 'ru'
    },
    titleTemplate: '%s | оптом и в розницу интернет-магазин бестгифт',
    title: 'Сувениры и подарки | оптом и в розницу интернет-магазин бестгифт',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {
        hid: 'description',
        name: 'description',
        content: 'Качественные и оригинальные сувениры оптом и в розницу. Прямые поставки из Китая'},
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'купить, оптом'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#ccc'},
  /*
  ** Global CSS
  */
  css: [
    '@/theme/index.scss'
  ],

  env: {
    appName: 'Бестгифт'
  },
  server: {
    host: isDev ? 'localhost' : 'nuxt-eshop.herokuapp.com',
    port: isDev ? 3000 : 80,
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/globals',
    '@/plugins/axios',
    {src: '@/plugins/sticky-sidebar.js', mode: 'client'},
    {src: '@/plugins/icons.js', mode: 'client'},
    {src: '@/plugins/ckeditor4-wysiwyg.js', mode: 'client'}
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap',
    '@nuxtjs/component-cache'
  ],


  sitemap: {
    hostname: keys.baseURL,
    exclude: [
      '/admin/**'
    ],
    async  routes() {
      const category = await axios.get(`${keys.baseURL}/api/category/admin`)
          .then((res) => res.data.map((category) => '/category/' + category.seoUrl))
      const product = await axios.get(`${keys.baseURL}/api/product/admin`)
          .then((res) => res.data.map((product) => '/product/' + product.seoUrl))
      const routs = await category.concat(product)
      return routs
    },
  },


  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  axios: {
    baseURL:  keys.baseURL,
    proxy: true
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    // vendor: ['axios'],
    // extend(config, ctx) {
    // }
  }
}
