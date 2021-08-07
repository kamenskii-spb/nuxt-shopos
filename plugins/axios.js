export default function ({ $axios, redirect, store }) {

  $axios.interceptors.request.use(request => {
 
    if (store.getters['admin/auth/isAuthenticated'] && !request.headers.common['Authorization']) {
      const token = store.getters['admin/auth/token']
      request.headers.common['Authorization'] = `Bearer ${token}`
    }

    return request
  })

  $axios.onError(error => {
    if (error.response) {
      if (error.response.status === 401) {
        redirect('/admin/login?message=session')
        store.dispatch('admin/auth/logout')
      }

      if (error.response.status === 500) {
        console.error('Server 500 error')
      }
    }
  })
}
