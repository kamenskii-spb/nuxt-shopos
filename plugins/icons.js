import Vue from 'vue'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
  faPaintBrush,
  faGem,
  faSearch,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

// https://fontawesome.com/icons

library.add(faPaintBrush, faGem, faSearch, faChevronRight )

Vue.component('font-awesome-icon', FontAwesomeIcon)
