export const state = () => ({
  orderSuccess: null
})

export const mutations = {
  setOrderSuccess(state, order) {
    state.orderSuccess = order.order
  },
  clearOrderSuccess(state) {
    state.orderSuccess = null
  }
}


export const actions = {
  async create({commit, dispatch}, data) {
    try {
      const cookies = await dispatch('cart/getCookie', [], {root: true})
      if (! cookies['cart_token']) return
      data.cartToken = cookies['cart_token']
      const order = await this.$axios.$post(`/api/order/admin/create`, data)
      if (order._id) {
        await commit('cart/setCart', [], {root: true})
        await commit('setOrderSuccess', order)
        await commit('cart/removeCartToken', null, {root: true})
        await dispatch('admin/auth/autoLogin', null, {root: true})
        return order
      }
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async fetchAll({}, query) {
    const orders = await this.$axios.$get(
        `/api/order/admin`, {params: query.getParams})
    orders.map((o) => {
      switch (o.status) {
        case 'Ожидание':
          o.type = 'warning'
          break;
        case 'Завершен':
          o.type = 'success'
          break;
        case 'В обработке':
          o.type = 'info'
          break;
        default:
          o.type = 'error'
      }
    })
    return orders
  },
  async fetch({}, id) {
    const order = await this.$axios.$get(`/api/order/admin/fetchById/${id}`)
    return order
  },
  async fetchCount() {
    const count = await this.$axios.$post(`/api/order/admin/count`)
    return count
  },
  async changeStatus({}, data) {
    await this.$axios.$post(`/api/order/admin/changeStatus`, data)
  }
}

export const getters = {
  orderSuccess: (state) => state.orderSuccess
}
