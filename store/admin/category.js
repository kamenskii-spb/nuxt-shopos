//  let list = []


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
      fd.append('status', data.status)

      if (data.image) {
        fd.append('image', data.image, data.image.name)
      }
      if (data.parent) {
        fd.append('parent', data.parent)
      }


      return await this.$axios.$post('/api/category/admin', fd)
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
      fd.append('status', data.status)

      if (data.image) {
        fd.append('image', data.image, data.image.name)
      }
      if (data.parent) {
        fd.append('parent', data.parent)
      }

      const id = data.id

      return await this.$axios.$put(`/api/category/admin/${id}`, fd)
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },
  async fetch({
    commit
  }) {
    try {
      return await this.$axios.$get('/api/category/admin')
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

      return await this.$axios.$post('/api/category/admin/remove', data.ids)
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },
  async fetchAdminBySeoUrl({
    commit
  }, id) {
    try {
      return await this.$axios.$get(`/api/category/admin/${id}`)
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },
  async fetchAdminByid({
    commit
  }, id) {
    try {
      return await this.$axios.$get(`/api/category/admin/getById/${id}`)
    } catch (e) {
      commit('setError', e, {
        root: true
      })
      throw e
    }
  },


  async buildTree({ }, array) {
    const map = new Map(array.map((item) => [item._id, item]));
    for (const item of map.values()) {
      if (!map.has(item.parent)) {
        continue;
      }
      const parent = map.get(item.parent);
      parent.children = [...(parent.children || []), item];
    }
    return [...map.values()].filter((item) => !item.parent);
  },

  async breadcrumbListFromCategories({dispatch}, array) {
    const tree = await dispatch('buildTree', array)


    const breadcrumbListFromCategories = [{
      name: ' --- Не выбрано --- ',
      _id: '0'
    }]
    const path = []
    const list = []

    function traverse(node, path) {
      if (!path) path = [];
      if (node.name) {
        path.push({
          name: node.name,
          id: node._id
        });
      }
      list.push(path);
      if (node.children) {
        node.children.forEach((item) => {
          traverse(item, path.slice());
        });
      }
    }


    for (let index = 0; index < tree.length; index++) {
      traverse(tree[index], []);
    }

    for (let index = 0; index < list.length; index++) {
      let path = '';
      let id = '';
      list[index].map((cat) => {
        path = path + ' > ' + cat.name;
        id = cat.id;
      })
      breadcrumbListFromCategories.push({
        name: path.slice(2),
        _id: id
      });
    }
    return breadcrumbListFromCategories
  }


}
