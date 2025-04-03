<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <nav class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-gray-800 dark:text-white">STEEM Trail</router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link v-if="isAuthenticated" to="/dashboard" class="nav-link" active-class="active-nav-link">Dashboard</router-link>
              <router-link to="/" class="nav-link" active-class="active-nav-link">Home</router-link>
              <router-link to="/daily" class="nav-link" active-class="active-nav-link">Daily Votes</router-link>
              <router-link to="/missing" class="nav-link" active-class="active-nav-link">Missing Votes</router-link>
              <router-link to="/join" class="nav-link" active-class="active-nav-link">FAQ</router-link>
            </div>
          </div>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <button v-if="!isAuthenticated" @click="login" class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Login
              </button>
              <div v-else class="relative inline-block text-left">
                <button @click="toggleDropdown" type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="options-menu" aria-expanded="true" aria-haspopup="true">
                  {{ username }}
                  <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                <div v-if="showDropdown" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-600 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div class="py-1" role="none">
                    <button @click="logout" class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white" role="menuitem">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="py-10">
      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      showDropdown: false,
      clickOutsideHandler: null
    }
  },
  computed: {
    ...mapState({
      username: state => state.user?.username
    }),
    isAuthenticated() {
      return !!this.username
    }
  },
  methods: {
    ...mapActions(['logout']),
    login() {
      this.$router.push('/login')
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    }
  },
  created() {
    const handleClickOutside = (event) => {
      if (this.showDropdown && !event.target.closest('#options-menu')) {
        this.showDropdown = false
      }
    }
    document.addEventListener('click', handleClickOutside)
    this.clickOutsideHandler = handleClickOutside
  },
  unmounted() {
    if (this.clickOutsideHandler) {
      document.removeEventListener('click', this.clickOutsideHandler)
    }
  }
}
</script>

<style>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300;
}

.active-nav-link {
  @apply border-b-2 border-indigo-500 text-gray-900 dark:text-white;
}
</style>
