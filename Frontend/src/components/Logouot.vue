<template>
    <div class="flex justify-center">
      <button
        @click="logout()"
        class="px-6 py-2 text-white bg-blue-600 rounded shadow"
        type="button"
      >
        Logout
      </button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        localStorage.removeItem('token');
        this.isOpen = false;
        console.log('Navigating to home page...');
        localStorage.setItem('shouldRefresh', 'true'); // Set the flag for refresh
        this.$router.push({ name: 'home' }); // Use the actual route name 'home'
      },
    },
  };
  </script>
  