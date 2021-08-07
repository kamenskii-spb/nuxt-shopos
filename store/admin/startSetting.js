export const actions = {
  async create({commit, dispatch}, formData) {
    try {
      return
      const newUser = await this.$axios.$post(
          '/api/auth/admin/create', formData)
      dispatch('setSetting', newUser)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async getUsers({commit}, data) {
    try {
      return await this.$axios.$get('/api/user/admin')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async setSetting({commit}, data) {
    try {
      return await this.$axios.$post(`/api/setting/admin/startSetting`, data)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
}
