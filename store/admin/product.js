export const state = () => ({
  products: [],
});

export const mutations = {
  shangeSelected(state, idx) {
    if (idx !== -1) state.products[idx].selected = !state.products[idx].selected
  },
  changePrice(state, data) {
    const idx = state.products.findIndex((p) => p._id === data.id)
    if (idx !== -1) {
      data.type === 'retail' ?
      (state.products[idx].price = data.price) :
      (state.products[idx].wholesalePrice = data.price)
    }
  },
  changeStatus(state, data) {
    const idx = state.products.findIndex((p) => p._id === data.id)
    if (idx !== -1) {
      state.products[idx].status = data.status
    }
  },
  setProducts(state, products) {
    state.products = products
  },
  addProduct(state, product) {
    state.products.unshift(product)
  },
  removeProduct(state, id) {
    const idx = state.products.findIndex((p) => p._id === id)
    if (idx !== -1) state.products.splice(idx, 1)
  },
  changeProduct(state, product) {
    const idx = state.products.findIndex((p) => p._id === product._id)
    if (idx !== -1) state.products[idx] = product
  }
}

export const actions = {
  async create({
    commit
  }, data) {
    try {
      const fd = new FormData()
      fd.append('name', data.name)
      fd.append('description', data.description)
      fd.append('metaTitle', data.metaTitle)
      fd.append('metaDescription', data.metaDescription)
      fd.append('metaKeywords', data.metaKeywords)
      fd.append('sortOrder', data.sortOrder)
      fd.append('model', data.model)
      fd.append('price', data.price)
      fd.append('wholesalePrice', data.wholesalePrice)
      fd.append('minimum', data.minimum)
      fd.append('status', data.status)
      fd.append('recommend', data.recommend)
      fd.append('superPrice', data.superPrice)
      fd.append('stock', data.stock)
      fd.append('size', data.size)
      fd.append('tempateDescription', data.tempateDescription)
      fd.append('tags', data.tags)
      fd.append('wholesale', data.wholesale)
      fd.append('retail', data.retail)
      fd.append('newPrice', data.newPrice)


      if (data.images.length > 0) {
        for (let index = 0; index < data.images.length; index++) {
          fd.append('images', data.images[index], data.images[index].name);
        }
      }


      const categoriesId = []
      data.selectCategoty.forEach((category) => {
        categoriesId.push(category._id)
      });

      fd.append('selectCategoty', categoriesId)


      return await this.$axios.$post('/api/product/admin', fd)
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },
  async fetch({
    commit, state
  }) {
    try {
      if (!state.products.length) {
        const products = await this.$axios.$get('/api/product/admin')
        if (products.length) {
          products.map((p) => {
            p.selected = false;
          });
        }
        commit('setProducts', products)
        return products
      } else {
        return state.products
      }
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },
  async fetchAdminById({
    commit
  }, id) {
    try {
      return await this.$axios.$get(`/api/product/admin/${id}`)
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },
  async update({
    commit
  }, data) {
    try {
      const fd = new FormData()
      fd.append('name', data.name)
      fd.append('description', data.description)
      fd.append('metaTitle', data.metaTitle)
      fd.append('metaDescription', data.metaDescription)
      fd.append('metaKeywords', data.metaKeywords)
      fd.append('sortOrder', data.sortOrder)
      fd.append('model', data.model)
      fd.append('price', data.price)
      fd.append('wholesalePrice', data.wholesalePrice)
      fd.append('minimum', data.minimum)
      fd.append('status', data.status)
      fd.append('recommend', data.recommend)
      fd.append('superPrice', data.superPrice)
      fd.append('stock', data.stock)
      fd.append('categoriesForClear', data.categoriesForClear)
      fd.append('size', data.size)
      fd.append('tempateDescription', data.tempateDescription)
      fd.append('tags', data.tags)
      fd.append('wholesale', data.wholesale)
      fd.append('retail', data.retail)
      fd.append('newPrice', data.newPrice)

      const id = data.id

      if (data.images.length > 0) {
        await this.$axios.$post(`/api/product/admin/removeImagesSrc/${id}`)

        for (let index = 0; index < data.images.length; index++) {
          if (typeof data.images[index] === 'object') {
            const fdImg = new FormData()
            fdImg.append('image', data.images[index], data.images[index].name)

            await this.$axios.$put(
                `/api/product/admin/addImageFile/${id}`, fdImg)
          } else {
            const src = data.images[index]
            await this.$axios.$put(
                `/api/product/admin/addImageSrc/${id}`, {src})
          }
        }
      }

      const categoriesId = []
      data.selectCategoty.forEach((category) => {
        categoriesId.push(category._id)
      });

      fd.append('selectCategoty', categoriesId)

      return await this.$axios.$put(`/api/product/admin/${id}`, fd)
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },
  async remove({
    commit
  }, data) {
    try {
      const fd = new FormData()
      fd.append('ids', data.ids)
      await this.$axios.$post('/api/product/admin/remove', data.ids)
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },
  async removeImagebByImageId({
    commit
  }, data) {
    try {
      const imgId = data._id
      const name = data.src
      const id = data.productId

      await this.$axios.$post(
          `/api/product/admin/removeImagebByImageId/${id}`,
          {imgId, name})
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },
  async changePrice({
    commit
  }, data) {
    try {
      await this.$axios.$put(`/api/product/admin/changePrice`, data)
      commit('changePrice', data)
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },

  async changeStatus({
    commit
  }, data) {
    try {
      await this.$axios.$put(`/api/product/admin/changeStatus`, data)
          .then(() => {
            commit('changeStatus', data)
          })
      return
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },

}

export const getters = {
  getProducts: (state) => state.ptoducts,
};
