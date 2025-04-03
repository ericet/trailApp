<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Panel</h2>
    
    <!-- Search Form -->
    <div class="mb-8">
      <form @submit.prevent="searchPosts" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter Steem username"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ loading ? 'Searching...' : 'Search Posts' }}
        </button>
      </form>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>

    <!-- Results Table -->
    <div v-if="posts.length > 0" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="post in posts" :key="post.permlink">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ post.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ formatDate(post.created) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button
                v-if="!post.hasVoted"
                @click="showVotingWeightModal(post)"
                :disabled="loading"
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
              >
                Add to Pending
              </button>
              <span v-else class="text-gray-500 dark:text-gray-400">
                Already Voted
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading && searched" class="text-center text-gray-500 dark:text-gray-400 py-4">
      No posts found
    </div>

    <!-- Voting Weight Modal -->
    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="hideModal"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  Set Voting Weight
                </h3>
                <div class="mt-4">
                  <label for="votingWeight" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Voting Weight (%)</label>
                  <input
                    type="number"
                    id="votingWeight"
                    v-model="votingWeight"
                    min="0.01"
                    max="100"
                    step="0.01"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="addToPending"
              :disabled="loading"
            >
              {{ loading ? 'Adding...' : 'Add to Pending' }}
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="hideModal"
            >
              Cancel
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
  name: 'AdminView',
  data() {
    return {
      username: '',
      votingWeight: 100,
      posts: [],
      loading: false,
      error: null,
      searched: false,
      showModal: false,
      selectedPost: null
    };
  },
  methods: {
    isValidAccount(username) {
      return new Promise((resolve) => {
        window.steem.api.getAccounts([username], (err, result) => {
          if (err) resolve(false);
          resolve(result && result.length > 0);
        });
      });
    },
    hasVoted(votes) {
      for (let vote of votes) {
        if (vote.voter === 'cn-trail') {
          return true;
        }
      }
      return false;
    },
    getPosts(username) {
      return new Promise((resolve, reject) => {
        const start = new Date();
        start.setDate(start.getDate() - 7); // Last 7 days

        window.steem.api.getDiscussionsByBlog({ tag: username, limit: 100 }, (err, result) => {
          if (!err) {
            const posts = [];
            for (let blog of result) {
              const created = new Date(blog.created + 'Z').getTime();
              if (
                created > start.getTime() && // Get posts newer than 7 days ago
                username === blog.author
              ) {
                const hasVoted = this.hasVoted(blog.active_votes, username);
                posts.push({
                  title: blog.title,
                  permlink: blog.permlink,
                  created: blog.created,
                  hasVoted
                });
              }
            }
            resolve(posts);
          } else {
            reject(err);
          }
        });
      });
    },
    async searchPosts() {
      this.loading = true;
      this.error = null;
      this.posts = [];
      
      try {
        const isValid = await this.isValidAccount(this.username);
        if (!isValid) {
          this.error = 'Invalid Steem account';
          return;
        }

        this.posts = await this.getPosts(this.username);
        this.searched = true;
        
        if (this.posts.length === 0) {
          this.error = 'No posts found in the last 7 days';
        }
      } catch (error) {
        this.error = error.message || 'Failed to search posts';
      } finally {
        this.loading = false;
      }
    },
    showVotingWeightModal(post) {
      this.selectedPost = post;
      this.showModal = true;
    },
    hideModal() {
      this.showModal = false;
      this.selectedPost = null;
      this.votingWeight = 100;
    },
    async addToPending() {
      if (!this.selectedPost) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        await axios.post(`${this.$store.state.api}/addToPending`, {
          account: this.username,
          permlink: this.selectedPost.permlink,
          votingWeight: this.votingWeight
        }, {
          headers: { Authorization: this.$store.state.user.token }
        });
        
        // Remove the post from the list
        this.posts = this.posts.filter(p => p.permlink !== this.selectedPost.permlink);
        this.hideModal();
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to add post to pending';
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr + 'Z');
      return date.toLocaleString();
    }
  }
};
</script>
