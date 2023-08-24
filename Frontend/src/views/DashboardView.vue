<template>
  <div class="min-h-screen py-5">
    <div class="overflow-x-auto w-full">
      <table
        class="mx-auto max-w-4xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-hidden"
      >
        <thead class="bg-gray-900">
          <tr class="text-white text-left">
            <th class="font-semibold text-sm uppercase px-6 py-4">Voter</th>
            <th class="font-semibold text-sm uppercase px-6 py-4">Permlink</th>
            <th class="font-semibold text-sm uppercase px-6 py-4">
              Voting Weight
            </th>
            <th class="font-semibold text-sm uppercase px-6 py-4">Date Time</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(entry, index) in userInfo" :key="index">
            <td class="px-6 py-4">
              {{ entry.voter }}
            </td>
            <td class="px-6 py-4">
              {{ entry.permlink }}
            </td>
            <td class="px-6 py-4">
              {{ entry.voting_weight }}
            </td>
            <td class="px-6 py-4">
              {{ entry.date_time }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    beforeRouteEnter(to, from, next) {
    if (localStorage.getItem('shouldRefresh')) {
      localStorage.removeItem('shouldRefresh'); // Remove the flag
      next((vm) => {
        // Refresh the page
        location.reload();
      });
    } else {
      next();
    }
  },
  data() {
    return {
      userInfo: null,
    };
  },
  created() {
    this.fetchUserInfo();
  },
  methods: {
    async fetchUserInfo() {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await axios.get(
            'http://localhost:5000/getVotedPosts',
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          this.userInfo = response.data;
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        }
      }
    },
  },
};
</script>

<style>
/* Add your styling here */
</style>
