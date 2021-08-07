export default function({store, redirect}) {
  if (!store.getters['admin/auth/isAuthenticated'] ||
  !store.getters['auth/user']._id) {
    redirect('/login')
  }
}
