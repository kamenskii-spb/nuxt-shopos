export default function({store, redirect}) {
  if (!store.getters['admin/order/orderSuccess']) {
    redirect('/')
  }
}
