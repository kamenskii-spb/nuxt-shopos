export const state = () => ({
  view: 'grid',
})

export const mutations = {
  setView(state, view) {
    state.view = view
  },
}
export const actions = {

  async fetchRecommend({commit}) {
    try {
      const products = await this.$axios.$get('/api/product/fetchRecommend')
      return products
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async fetchSuperPrice({commit}) {
    try {
      const products = await this.$axios.$get('/api/product/fetchSuperPrice')
      return products
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async fetchStock({commit}) {
    try {
      const products = await this.$axios.$get('/api/product/fetchStock')
      return products
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async fetchNews({commit}, query) {
    try {
      const products = await this.$axios.$get(
          '/api/product/fetchNews', {params: query.getParams}
      )
      return products
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },

}

export const getters = {
  view: (state) => state.view,
}

