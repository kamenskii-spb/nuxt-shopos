export const actions = {

  async getAll({commit}) {
    try {
      return await this.$axios.$get(`/api/description/`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async getById({commit}, id) {
    try {
      return await this.$axios.$get(`/api/description/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  }

}
