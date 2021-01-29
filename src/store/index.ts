import { createStore } from 'vuex'

export default createStore({
  state: {
    userAccount:''
  },
  mutations: {
    setUser(state, val){
      state.userAccount = val
    }
  },
  actions: {
  },
  modules: {
  }
})
