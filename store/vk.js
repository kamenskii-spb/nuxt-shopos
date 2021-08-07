import Cookie from 'cookie'
import Cookies from 'js-cookie'


export const state = () => ({
  marketToken: '',
  client_id: '',
  client_secret: '',
  group_id: '',
  redirect_uri: ''
})

export const mutations = {
 async setVkMarket(state, vkMarket) {
  state.marketToken   = vkMarket.token || ''
  state.client_id     = vkMarket.client_id || ''
  state.client_secret = vkMarket.client_secret || ''
  state.redirect_uri  = vkMarket.redirect_uri || ''
  state.group_id  = vkMarket.group_id || ''
  return state
  }
 
  
}

export const actions = {
 async setVkMarketSetting({commit}, form) {

    const vkMarket = await this.$axios.$post(`/api/vk/admin/setToken`,form)
    await commit('setVkMarket', vkMarket)
    return vkMarket
  },

   async getVkMarketSetting({commit}) {
    const vkMarket = await this.$axios.$post(`/api/vk/admin/getVkMarketSetting`)
    await commit('setVkMarket', vkMarket)
    return vkMarket
  },

     async deleteVkMarketSetting({commit}) {
    const vkMarket = await this.$axios.$post(`/api/vk/admin/deleteVkMarketSetting`)
    await commit('setVkMarket', vkMarket)
    return vkMarket
  }
  
}

export const getters = {
  vkMarketSetting: state => {
  	const vkmt = {
  	token: state.marketToken,
    client_id: state.client_id,
    client_secret: state.client_secret,
    redirect_uri: state.redirect_uri,
    group_id: state.group_id
  	}
  	return vkmt
  }
}



