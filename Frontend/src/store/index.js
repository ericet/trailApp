import { createStore } from 'vuex'
import Config from '@/config/config.js'

export default createStore({
  state: {
    steemRpc: Config.steem_rpc,
    api: Config.trail_api,
    account: Config.trail_account
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
