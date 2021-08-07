export const actions = {
  async update({commit}, data) {
    try {
      const fd = new FormData()

      fd.append('shopName', data.shopName)
      fd.append('metaTitle', data.metaTitle)
      fd.append('metaDescription', data.metaDescription)
      fd.append('metaKeywords', data.metaKeywords)
      fd.append('email', data.email)
      fd.append('largeImageSizeWidth', data.largeImageSizeWidth)
      fd.append('largeImageSizeHeight', data.largeImageSizeHeight)
      fd.append('popupImageSizeWidth', data.popupImageSizeWidth)
      fd.append('popupImageSizeHeight', data.popupImageSizeHeight)
      fd.append('listImageSizeWidth', data.listImageSizeWidth)
      fd.append('listImageSizeHeight', data.listImageSizeHeight)
      fd.append('additionalImageSizeWidth', data.additionalImageSizeWidth)
      fd.append('additionalImageSizeHeight', data.additionalImageSizeHeight)


      return await this.$axios.$put(`/api/setting/admin/`, fd)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async fetch({commit}) {
    try {
      return await this.$axios.$get('/api/setting/admin')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async imagesClear({commit}) {
    try {
      return await this.$axios.$post('/api/setting/admin/imageClear')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
}
