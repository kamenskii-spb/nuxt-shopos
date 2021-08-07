export const state = () => ({
  serachDialog: false,
  loginDialog: false,
  cartChangeDialog: false,
  drawer: false
});


export const mutations = {
  setDialog(state, data) {
    const dialog = data.dialog
    const value = data.value
    if (state[dialog] !== undefined) {
      state[dialog] = !!value
    }
  },
  closeAll(state, from = false) {
    if (!from) return

    for (let index = 0; index < Object.keys(state).length; index++) {
      const element = Object.keys(state)[index];
      state[element] = false
    }
  }
}
export const getters = {
  serachDialog: (state) => state.serachDialog,
  loginDialog: (state) => state.loginDialog,
  cartChangeDialog: (state) => state.cartChangeDialog,
  drawer: (state) => state.drawer
};

