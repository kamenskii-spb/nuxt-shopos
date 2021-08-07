

export const actions = {
  async fetch({commit}, query) {
    try {
      return await this.$axios.$get('/api/user/admin', {params: query.getParams})
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async getById({commit}, userId) {
    try {
      const user = await this.$axios.$post('/api/auth/admin/getById', {userId})
      return user
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async  rememberPassword({commit}, email) {
    if (!email) {
      return false
    }
    const res = await this.$axios.$post('/api/user/rememberPassword', {email})

    return res
  },
  async  updatePassword({commit}, data) {
    if (!data) {
      return false
    }
    const res = await this.$axios.$post('/api/user/updatePassword', data)

    return res
  },
  async fetchCount() {
    try {
      return await this.$axios.$get('/api/user/admin/count')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },

}
