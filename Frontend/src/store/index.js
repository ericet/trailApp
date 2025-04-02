import { createStore } from 'vuex'
import Config from '@/config/config.js'

export default createStore({
  state: {
    steemRpc: Config.steem_rpc,
    api: Config.trail_api,
    account: Config.trail_account,
    user: JSON.parse(localStorage.getItem('user')) || null
  },
  getters: {
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData))
    },
    clearUser(state) {
      state.user = null
      // Remove user data from localStorage
      localStorage.removeItem('user')
    }
  },
  actions: {
    logout({ commit }) {
      commit('clearUser')
    }
  },
  modules: {
  }
})
