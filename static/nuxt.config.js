const colors = require('vuetify/es5/util/colors').default
const axios = require('axios')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - '+ 'cувениры и игрушки оптом',
    title: process.env.npm_package_name || '',
    script: [
      { src: 'https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver', body: true },

    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
 loading: { color: '#EF6C00' },
   /*
  ** Global CSS
  */
 css: [
  '@/theme/index.scss'
],

env: {
  appName: 'Citiopt'
},
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/globals',
    '@/plugins/axios',
    { src: '@/plugins/lightbox', mode: 'client' },
    { src: '@/plugins/number-input', mode: 'client' },
    // { src: '@/plugins/yandex-metrika', mode: 'client' },
    { src: '@/plugins/vue2-editor', mode: 'client' },
    { src: '@/plugins/draggable', mode: 'client' },
    { src: '@/plugins/scrollbar', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap'
  ],



  sitemap: {
    exclude: [
      '/secret',
      '/admin/**'
    ],
  async  routes () {
    
      
      const category =  await axios.get('https://kartin100.herokuapp.com/api/category/admin')
            .then(res => res.data.map(category => '/category/' + category.seoUrl))

      const product =  await axios.get('https://kartin100.herokuapp.com/api/product/admin')
                .then(res => res.data.map(product => '/product/' + product.seoUrl))  

      const routs  = await category.concat(product)

       return routs
        },
    // routes () {
    //   return axios.get('https://bestgift.herokuapp.com/api/product/admin')
    //     .then(res => res.data.map(product => '/product/' + product.seoUrl))
    // },

  },

  

  // sitemap: {
  //   routes () {
  //     return axios.get('https://bestgift.herokuapp.com/api/category/admin')
  //       .then(res => res.data.map(category => '/category/' + category.seoUrl))
  //   }
  // },






  
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
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
    baseURL: process.env.BASE_URL || 'http://localhost:3000'
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
