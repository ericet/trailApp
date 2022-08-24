<template>
  <!-- Header links -->
  <div
    :class="isOpen ? 'block' : 'hidden'"
    class="m-0 sm:ml-4 mt-5 sm:mt-3 sm:flex p-5 sm:p-0 justify-center items-center shadow-lg sm:shadow-none"
  >
    <router-link
      to="/"
      class="duration-200 font-general-medium block text-left text-lg font-medium text-primary-dark dark:text-white hover:text-indigo-600 dark:hover:text-indigo-300 sm:mx-4 mb-2 sm:py-2"
      aria-label="Home"
      >{{ $t('nav.home') }}</router-link
    >
    <router-link
      to="/daily"
      class="duration-200 font-general-medium block text-left text-lg font-medium text-primary-dark dark:text-ternary-light hover:text-indigo-600 dark:hover:text-indigo-300 sm:mx-4 mb-2 sm:py-2"
      aria-label="Daily Votes"
      >{{ $t('nav.daily') }}</router-link
    >
    <router-link
      to="/missing"
      class="duration-200 font-general-medium block text-left text-lg font-medium text-primary-dark dark:text-ternary-light hover:text-indigo-600 dark:hover:text-indigo-300 sm:mx-4 mb-2 sm:py-2"
      aria-label="Missing Votes"
      >{{ $t('nav.missing') }}</router-link
    >
    <router-link
      to="/join"
      class="duration-200 font-general-medium block text-left text-lg font-medium text-primary-dark dark:text-ternary-light hover:text-indigo-600 dark:hover:text-indigo-300 sm:mx-4 mb-2 sm:py-2"
      aria-label="Join"
      >{{ $t('nav.join') }}</router-link
    >
    <span v-if="!isLoggedIn">
      <router-link
        to="/login"
        class="duration-200 font-general-medium block text-left text-lg font-medium text-primary-dark dark:text-ternary-light hover:text-indigo-600 dark:hover:text-indigo-300 sm:mx-4 mb-2 sm:py-2"
        aria-label="Login"
        >Login</router-link
      >
    </span>
    <span v-else>
      <a @click="logout">Logout</a>
    </span>
  </div>
</template>

<script>
export default {
  props: ['showModal', 'isOpen'],
  data() {
    return {
      activeMenu: '',
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch('LogOut');
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="css" scoped>
.active-link {
  color: rgb(79 70 229);
  border-bottom: 3px solid rgb(79 70 229);
}
</style>
