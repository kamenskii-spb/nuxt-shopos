import Cookies from 'js-cookie'
// import jwtDecode from 'jwt-decode'

export const state = () => ({
  // token: null,
  user: null,
})

export const mutations = {
  setUser(state, user) {
    if (user) {
      state.user = user
    }
  },
  setNewUser(state, user) {
    state.user.name = user.name
    state.user.phome = user.phone
    state.user.address = user.address

    return state.user
  },

}

export const actions = {
  async createUser({commit}, formData) {
    try {
      await this.$axios.$post('/api/auth/admin/create', formData)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },

  async registerCandidate({commit}, formData) {
    try {
      const result = await this.$axios.$post(
          '/api/auth/registerCandidate',
          formData)
      return result
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },

  async registerUser({commit}, condidate) {
    try {
      const result = await this.$axios.$post(
          '/api/auth/registerUser',
          condidate)
      if (result.user) {
        return result
      } else {
        return result
      }
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },

  async editUser({commit}, formData) {
    const user = await this.$axios.$post(
        '/api/auth/admin/updateUser',
        formData)
    commit('setNewUser', user)
    return user
  },


  // setToken({commit}, token) {
  //   this.$axios.setToken(token, 'Bearer')
  //   commit('setToken', token)
  //   Cookies.set('jwt-token', token)
  // },
  logout({commit}) {
    this.$axios.setToken(false)
    commit('clearToken')
    Cookies.remove('jwt-token')
  },
  // autoLogin({dispatch}) {
  //   const cookieStr = process.browser
  //     ? document.cookie
  //     : this.app.context.req.headers.cookie

  //   const cookies = Cookie.parse(cookieStr || '') || {}
  //   const token = cookies['jwt-token']

  //   if (isJWTValid(token)) {
  //     dispatch('setToken', token)
  //   } else {
  //     dispatch('logout')
  //   }
  // }
}

export const getters = {
  isAuthenticated: (state) => Boolean(state.token),
  token: (state) => state.token,
  user: (state) => state.user
}


// function isJWTValid(token) {
//   if (!token) {
//     return false
//   }

//   const jwtData = jwtDecode(token) || {}
//   const expires = jwtData.exp || 0


//   return (new Date().getTime() / 1000) < expires
// }
