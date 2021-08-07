import Vue from 'vue'

import DateFilter from '@/common/date.filter'
import VueCurrencyFilter from 'vue-currency-filter'


Vue.filter('date', DateFilter)
Vue.use(VueCurrencyFilter,
    {
      symbol: 'р.',
      thousandsSeparator: '.',
      fractionCount: 2,
      fractionSeparator: ',',
      symbolPosition: 'after',
      symbolSpacing: true
    })
// Vue.directive('lazyload', lazyload)


