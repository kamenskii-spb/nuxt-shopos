export const state = () => ({
  error: null,
  setting: []
})

export const actions = {
  async nuxtServerInit({dispatch, commit}) {
    await dispatch('admin/auth/autoLogin')
    await dispatch('category/fetchTree')
    const setting = await dispatch('admin/setting/fetch');
    if (setting._id) {
      await commit('setSetting', setting)
    }
    await dispatch('page/fetchPages')
  },
  async getSetting({commit, dispatch}) {
    try {
      return this.state.setting
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
}


export const mutations = {
  setError(state, error) {
    state.error = error
  },
  clearError(state) {
    state.error = null
  },
  setSetting(state, setting) {
    state.setting = setting
  }

}

export const getters = {
  error: (state) => state.error,
  setting: (state) => state.setting,
}
