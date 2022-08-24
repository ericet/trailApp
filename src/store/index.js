import { createStore } from 'vuex'
import Config from '@/config/config.js'
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    api: Config.trail_api,
    account: Config.trail_account,
    user: null,
    token: null,
  },
  getters: {
    isAuthenticated: state => !!state.user && !!state.token,
    StateUser: state => state.user,

  },
  mutations: {
    setUser (state, username) {
      state.user = username
    },
    setToken (state, token) {
      state.token = token
    },
    LogOut (state) {
      state.user = null
      state.token = null
    },
  },
  actions: {
    async LogIn ({ commit }, user) {
      commit("setUser", user.get('username'));
      commit("setToken", user.get('token'));
    },
    async LogOut ({ commit }) {
      let user = null;
      commit("logout", user);
    },
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
