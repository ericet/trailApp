<template>
  <div class="flex justify-center">
    <button
      @click="openLoginModal()"
      class="px-6 py-2 text-white bg-blue-600 rounded shadow"
      type="button"
    >
      Login
    </button>

    <div
      v-show="isOpen"
      class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
    >
      <div class="max-w-md w-full bg-white rounded-md shadow-xl overflow-hidden">
        <div class="bg-blue-600 py-6 px-6 text-white">
          <h2 class="text-2xl font-bold mb-2">Welcome</h2>
          <p class="text-sm">Log in to your account to access the dashboard</p>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">Username</label>
            <input
              v-model="username"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-600"
              placeholder="Username"
            />
          </div>
          <div class="flex justify-end">
            <button
              @click="isOpen = false"
              class="px-4 py-2 mr-2 text-blue-800 border border-blue-600 rounded hover:bg-blue-100"
            >
              Cancel
            </button>
            <button
              @click="login"
              class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isOpen: false, // Add isOpen property here
      username: '',
    };
  },
  methods: {
    openLoginModal() {
      this.isOpen = true;
    },
    async login() {
      let username = this.username;
      if (this.username !== '') {
        try {
          const message = '' + Date.now();
          window.steem_keychain.requestSignBuffer(
            username,
            message,
            'Posting',
            async (r) => {
              if (r.success) {
                try {
                  const {
                    data: { token },
                  } = await axios.post('http://localhost:5000/login', {
                    username,
                    message,
                    signed_message: r.result,
                  });
                  console.log(token);
                  localStorage.setItem('token', token);
                  localStorage.setItem('shouldRefresh', 'true');
                  this.$router.push({ name: 'user' });
                } catch (e) {
                  console.log(e);
                }
              }
            }
          );
        } catch (error) {
          console.error('Login failed:', error);
        }
      }
      this.isOpen = false;
    },
  },
};
</script>
