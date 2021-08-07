import Cookie from 'cookie'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'

export const state = () => ({
  token: null
})

export const mutations = {
  setToken(state, token) {
    state.token = token
  },
  clearToken(state) {
    state.token = null
  }
}

export const actions = {
  async login({commit, dispatch}, formData) {
    try {
      const result = await this.$axios.$post('/api/auth/admin/login', formData)

      if (result.token) {
        dispatch('setToken', result.token)
        commit('auth/setUser', result.user, {root: true})
        dispatch('cart/setCart', null, {root: true})
        return ''
      } else {
        return result.message
      }
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async createUser({commit}, formData) {
    try {
      await this.$axios.$post('/api/auth/admin/create', formData)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },

  setToken({commit}, token) {
    this.$axios.setToken(token, 'Bearer')
    commit('setToken', token)
    Cookies.set('jwt-token', token)
  },
  logout({commit}) {
    this.$axios.setToken(false)
    commit('clearToken')
    commit('auth/setUser', {}, {root: true})
    Cookies.remove('jwt-token')
  },
  async autoLogin({dispatch, commit}) {
    const cookieStr = process.browser ?
      document.cookie :
      this.app.context.req.headers.cookie

    const cookies = Cookie.parse(cookieStr || '') || {}
    const token = cookies['jwt-token']

    if (isJWTValid(token)) {
      dispatch('setToken', token)
      const userId = getUserIdByToken(token)
      const user = await this.$axios.$post('/api/auth/admin/getById', {userId})
      commit('auth/setUser', user, {root: true})
    } else {
      dispatch('logout')
    }
  },
}

function isJWTValid(token) {
  if (!token) {
    return false
  }

  const jwtData = jwtDecode(token) || {}
  const expires = jwtData.exp || 0
  // console.log(jwtData)
  return (new Date().getTime() / 1000) < expires
}


function getUserIdByToken(token) {
  if (!token) {
    return false
  }
  const jwtData = jwtDecode(token) || {}
  return jwtData.userId
}


export const getters = {
  isAuthenticated: (state) => Boolean(state.token),
  token: (state) => state.token
}
