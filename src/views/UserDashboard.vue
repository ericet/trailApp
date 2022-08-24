<template>
  <div>
    <span v-if="isLoggedIn"> Hello! </span>
    <span v-else> Please login </span>
  </div>
</template>
<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
};
</script>
