export const state = () => ({
  pages: [],
})

export const mutations = {
  setPages(state, pages) {
    state.pages = pages
  },
}

export const actions = {
  async fetchPages({commit}) {
    try {
      const pages = await this.$axios.$get(`/api/page/admin/`) || []
      commit('setPages', pages)
    } catch (e) {
      console.log(e)
    }
  },

}

export const getters = {
  pages: (state) => state.pages,
}
