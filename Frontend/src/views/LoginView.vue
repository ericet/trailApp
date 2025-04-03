<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in with Steem Keychain
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Use your Steem account to access the Trail App
        </p>
      </div>
      <div class="mt-8">
        <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {{ error }}
        </div>
        <div class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Steem Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="username"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your Steem username"
              />
            </div>
          </div>
          <div>
            <button
              @click="handleLogin"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="!username"
            >
              Sign in with Keychain
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      error: null
    }
  },
  mounted() {
    if (!window.steem_keychain) {
      this.error = 'Please install Steem Keychain extension to continue'
    }
  },
  methods: {
    async handleLogin() {
      if (!this.username) {
        this.error = 'Please enter your Steem username'
        return
      }

      if (!window.steem_keychain) {
        this.error = 'Steem Keychain extension is not installed'
        return
      }

      try {
        // Generate a random string as memo for verification
        const memo = 'login_' + Math.random().toString(36).substring(2, 15)
        
        window.steem_keychain.requestSignBuffer(
          this.username,
          memo,
          'Posting',
          async (response) => {
            if (response.success) {
              try {
                // Send login request to backend
                const loginResponse = await axios.post(`${this.$store.state.api}/auth/login`, {
                  username: this.username,
                  message: memo,
                  signed_message: response.result
                });

                if (loginResponse.data.error) {
                  this.error = loginResponse.data.error;
                  return;
                }

                // Store the user data and token in Vuex store
                this.$store.commit('setUser', {
                  username: this.username,
                  token: loginResponse.data.token,
                  isAdmin: loginResponse.data.isAdmin
                });
                
                // Redirect to dashboard after successful login
                const redirect = this.$route.query.redirect || { name: 'dashboard' }
                this.$router.push(redirect)
              } catch (err) {
                this.error = 'Server error during login';
                console.error('Server login error:', err);
              }
            } else {
              this.error = 'Login failed: ' + response.message
            }
          }
        )
      } catch (err) {
        this.error = 'An error occurred during login'
        console.error('Login error:', err)
      }
    }
  }
}
</script>
