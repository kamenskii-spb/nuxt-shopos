

export const state = () => ({
  categoriesTree: [],
  categories: [],
  categoryActiv: '',
  categoryBreadcrumbs: []
})

export const mutations = {
  setCategoriesTree(state, categoriesTree) {
    state.categoriesTree = categoriesTree
  },
  setCategories(state, categories) {
    state.categories = categories
  },
  setCategoryActiv(state, id) {
    state.categoryActiv = id
  },
  setBreadcrumbs(state, category) {
    if (category.text ) {
      state.categoryBreadcrumbs.unshift(category)
    }
  },
  clearBreadcrumbs(state) {
    state.categoryBreadcrumbs = []
  },


}

export const actions = {

  async fetchTree({commit, dispatch}) {
    try {
      const categories = await this.$axios.$get(
          '/api/category/admin/getCategories')

      commit('setCategories', categories)

      const categoriesTree = await dispatch(
          'admin/category/buildTree', categories, {root: true})

      commit('setCategoriesTree', categoriesTree)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async fetchCategory({commit, getters}, query) {
    try {
      const category = await this.$axios.$get(
          `/api/category/admin/${query.id}`,
          {params: query.getParams}
      )
      if (!category) {
        return null
      }


      let lvl2cat = false;
      let sCategory =
          (await getters['categoriesTree'].find((c) => {
            if (typeof c.children !== 'undefined' && c.children.length) {
              const scat = c.children.find((cat) => {
                if (cat.seoUrl === category.seoUrl) {
                  return cat;
                }
              });

              if (scat) {
                lvl2cat = scat;
                return scat;
              }
            }
            if (c.seoUrl === category.seoUrl) {
              return c;
            }
          })) || [];

      if (lvl2cat) {
        sCategory = lvl2cat;
      }
      category.sCategory = sCategory
      return category
    } catch (e) {
      console.log(e)
      throw e
    }
  },
  async activeCategory({commit}, id) {
    try {
      commit('setCategoryActiv', id)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async getBreadcrumbs({commit, dispatch}, category) {
    try {
      const breadcrumbs = {
        text: category.name,
        href: category._id,
        seoUrl: category.seoUrl,
        disabled: true
      }
      commit('setBreadcrumbs', breadcrumbs)
      if (category.parent) {
        const parent = this.state.category.categories.find(
            (c) => c._id === category.parent
        )
        if (parent) {
          await dispatch('getBreadcrumbs', parent)
        }
      }
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },
  async clearBreadcrumbs({commit}) {
    commit('clearBreadcrumbs')
  },


}


export const getters = {
  categoriesTree: (state) => state.categoriesTree,
  categoryActiv: (state) => state.categoryActiv,
  categoryBreadcrumbs: (state) => state.categoryBreadcrumbs,
  categories: (state) => state.categories
}
