import Cookie from 'cookie';
import Cookies from 'js-cookie';

export const state = () => ({
  cart: [],
  totalPrice: 0,
  typeCart: 'retail',
  cartToken: null
});

export const mutations = {
  setCart(state, cart) {
    state.cart = cart;
    if (!cart || !state.cart.length) {
      state.totalPrice = 0;
    }
  },
  setTotalPrice(state, cart) {
    if (!cart || !cart.length) {
      state.totalPrice = 0
      return
    }
    const t = state.typeCart === 'retail' ? true : false;
    state.totalPrice = Math.floor(
        cart.reduce((sum, elem) => {
          if (t) {
            return sum + elem.price * +elem.quantity;
          } else {
            return sum + elem.wholesalePrice * elem.quantity;
          }
        }, 0)
    );
  },

  setCartToken(state, token) {
    if (!token) return
    state.cartToken = token
    Cookies.set('cart_token', token, {expires: 40})
  },
  removeCartToken(state) {
    Cookies.remove('cart_token')
    state.cartToken = null
  },

  changeCartType(state, data = false) {
    if (!data) {
      state.typeCart = state.typeCart === 'wholesale' ? 'retail' : 'wholesale';
    } else {
      if (data === 'wholesale' || data === 'retail') {
        state.typeCart = data;
      }
    }
  },
};

export const actions = {
  async addToCart({commit, dispatch}, addProduct) {
    const cookies = await dispatch('getCookie')

    if (!cookies['cart_token'] && !this.state.cart.cartToken) {
      const cartToken = Date.now() + Math.random().toString(36).substring(7)
      await commit('setCartToken', cartToken);
    }

    const data = {
      id: addProduct._id,
      quantity: addProduct.quantity,
      cartToken: this.state.cart.cartToken || cookies['cart_token'],
      typeCart: this.state.cart.typeCart,
      userId: this.state.auth.user._id || '',
      userName: this.state.auth.user.name +
      ' ' + this.state.auth.user.lastName || ''
    }


    const cart = await this.$axios.$put(
        `/api/cart/add`, data, {progress: false}
    )

    await commit('setCart', cart)
    await commit('setTotalPrice', cart)
  },
  async remove({commit}, id) {
    const data = {
      id,
      cartToken: this.state.cart.cartToken,
      typeCart: this.state.cart.typeCart
    }

    const cart = await this.$axios.$put(
        `/api/cart/delete`, data, {progress: false}
    )
    await commit('setCart', cart)
    await commit('setTotalPrice', cart);
  },


  async fetchCart({commit}) {
    return this.state.cart.cart
  },

  async search({dispatch, commit}, data) {
    const searchProduct = await this.$axios.$get(
        `/api/product/search?search=${data}`
    );

    return searchProduct;
  },
  async changeQuantity({dispatch, commit}, data) {
    const cookies = await dispatch('getCookie')
    if (!cookies['cart_token']) return

    data.cartToken = cookies['cart_token']
    data.typeCart = this.state.cart.typeCart

    const cart = await this.$axios.$put(
        `/api/cart/edit`, data, {progress: false}
    )
    await commit('setCart', cart)
    await commit('setTotalPrice', cart)
  },


  async setCart({commit, dispatch}) {
    try {
      const cookies = await dispatch('getCookie')
      const cookToken = cookies['cart_token'] || ''
      const cookTypeCart = cookies['typeCart'] || 'retail'
      if ( !cookToken && !this.state.auth.user.cart_token) {
        return
      }

      const data = {
        cartToken: cookToken,
        typeCart: cookTypeCart,
        authUserCartToken: this.state.auth.user.cart_token || ''
      }

      const cart = await this.$axios.$post(`/api/cart/`, data) || []
      await commit('setCartToken', cart.cartToken);
      await commit('changeCartType', cookTypeCart );


      await commit('setTotalPrice', cart.products || [] )
      await commit('setCart', cart.products || [])
    } catch (error) {
      // console.log(error)
    }
  },
  async changeCartType({commit, dispatch}, data) {
    await commit('changeCartType');
    Cookies.set('typeCart', this.state.cart.typeCart, {expires: 40});
    await dispatch('setCart');
    await commit('setTotalPrice', this.state.cart.cart);
  },


  getCookie() {
    const cookieStr = process.browser ?
    document.cookie :
    this.app.context.req.headers.cookie;
    return Cookie.parse(cookieStr || '')
  }
};

export const getters = {
  cart: (state) => state.cart,
  typeCart: (state) => state.typeCart,
  totalPrice: (state) => state.totalPrice,
};


