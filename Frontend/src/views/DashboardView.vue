<template>
  <div v-if="currentUser">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Your Dashboard</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Welcome back, {{ currentUser.username }}!</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Stats Overview -->
      <div class="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-sm font-medium text-gray-600 dark:text-gray-400">Score</h2>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ score || 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-sm font-medium text-gray-600 dark:text-gray-400">Bonus Vote</h2>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ incentive || '0%' }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-sm font-medium text-gray-600 dark:text-gray-400">Effective SP</h2>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ effectiveSP }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Upvotes -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Monthly Upvotes Received</h2>
            <div class="flex items-center space-x-2">
              <input type="month" v-model="selectedMonth" @change="fetchUpvotes" 
                     class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
          </div>
          <div v-if="upvotes.length === 0" class="text-gray-500 dark:text-gray-400 py-4">
            No upvotes found for this month.
          </div>
          <div v-else class="space-y-4">
            <div class="mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total upvotes received this month: {{ upvotes.length }}
              </p>
            </div>
            <div v-for="vote in sortedUpvotes" :key="vote.id" 
                 class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div class="flex justify-between items-start">
                <div>
                  <a :href="'https://steemcn.xyz/@' + vote.voter + '/' + vote.permlink" target="_blank" 
                     class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                     {{ postTitles[`${vote.voter}/${vote.permlink}`] || 'Loading...' }}
                  </a>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Vote Received: {{ vote.voting_weight / 100 }}%
                  </p>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(vote.date_time) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Last 7 Days Posts</h2>
          <div v-if="posts.length === 0" class="text-gray-500 dark:text-gray-400">
            No recent posts found.
          </div>
          <div v-else class="space-y-4">
            <div v-for="post in posts" :key="post.url" 
                 class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <a :href="'https://steemcn.xyz' + post.url" target="_blank" 
                 class="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                {{ post.title }}
              </a>
              <div class="mt-2 flex justify-between items-center text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                  {{ formatDate(post.timestamp) }}
                </span>
                <div class="flex items-center text-gray-500 dark:text-gray-400">
                  <span class="mr-2">{{ post.votes }} Rewards</span>
                  <span>${{ post.payout}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import steem from 'steem';
import axios from 'axios';

export default {
  name: 'DashboardView',
  data() {
    return {
      upvotes: [],
      posts: [],
      postTitles: {},  
      selectedMonth: new Date().toISOString().split('T')[0].slice(0, 7),
      totalPosts: 0,
      totalEarnings: 0,
      totalFollowers: 0,
      score: 0,
      incentive: '',
      effectiveSP: 0,
      loading: true
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
    sortedUpvotes() {
      return this.upvotes.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
    }
  },

  watch: {
    currentUser(newVal) {
      if (!newVal) {
        this.$router.push({ name: 'home' });
      }
    }
  },
  methods: {
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    async getPostTitle(account, permlink) {
      const key = `${account}/${permlink}`;
      if (this.postTitles[key] === undefined) {
        try {
          const post = await steem.api.getContentAsync(account, permlink);
          this.postTitles[key] = post.title || `@${account}'s post`;
        } catch (error) {
          console.error('Error fetching post title:', error);
          this.postTitles[key] = `@${account}'s post`;
        }
      }
      return this.postTitles[key];
    },
    async fetchPostTitles() {
      await Promise.all(
        this.upvotes.map(vote => this.getPostTitle(vote.voter, vote.permlink))
      );
    },
    async fetchUpvotes() {
      try {
        const [year, month] = this.selectedMonth.split('-').map(Number);        
        const response = await axios.get(`${this.$store.state.api}/getUpvotes`, {
          params: {
            year: year,
            month: month
          },
          headers: {
            'Authorization': `Bearer ${this.currentUser.token}`
          }
        });
        this.upvotes = response.data;
        await this.fetchPostTitles(); 
      } catch (error) {
        console.error('Error fetching upvotes:', error);
      }
    },
    async fetchUserHistory() {
      try {
        const username = this.currentUser.username;
        
        // Fetch user's posts
        const posts = await steem.api.getDiscussionsByAuthorBeforeDateAsync(
          username,
          null,
          new Date().toISOString().split('.')[0],
          10
        );
        
        // Get timestamp for 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        this.posts = posts
          .map(post => {
            // Parse payout values, removing ' SBD' or ' STEEM' suffix
            const curatorPayout = parseFloat(post.curator_payout_value.split(' ')[0]) || 0;
            const totalPayout = parseFloat(post.total_payout_value.split(' ')[0]) || 0;
            
            return {
              title: post.title,
              url: `/@${post.author}/${post.permlink}`,
              timestamp: new Date(post.created).getTime(),
              votes: post.net_votes,
              payout: (curatorPayout + totalPayout).toFixed(2)
            };
          })
          .filter(post => post.timestamp >= sevenDaysAgo.getTime());
        
        this.totalPosts = this.posts.length; // Use filtered posts
        this.totalEarnings = this.posts.reduce((sum, post) => 
          sum + parseFloat(post.payout), 0
        ).toFixed(2);

        // Fetch followers count
        const followers = await steem.api.getFollowCountAsync(username);
        this.totalFollowers = followers.follower_count;

        this.loading = false;
      } catch (error) {
        console.error('Error fetching user history:', error);
        this.loading = false;
      }
    },
    async fetchScoreAndIncentive() {
      try {
        const response = await axios.get(`${this.$store.state.api}/getScore?account=${this.currentUser.username}`);
        let votes = response.data.votes;
        let totalVotes = response.data.totalVotes;
        let score = (votes / totalVotes).toFixed(2);
        this.score = `${votes}/${totalVotes}=${score}`;
        let incentive = '';
        if (score >= 0.8) {
          incentive = '+' + ((score - 0.8) * 100).toFixed(2) + '%';
        } else {
          incentive = '-' + ((1 - score) * 100).toFixed(2) + '%';
        }
        this.incentive = incentive;
        this.effectiveSP = (response.data.sp).toFixed(2);
      } catch (error) {
        console.error('Error fetching score and incentive:', error);
      }
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.currentUser) {
        next({ name: 'home' });
      }
    });
  },

  async mounted() {
    if (this.currentUser) {
      await Promise.all([
        this.fetchUpvotes(),
        this.fetchUserHistory(),
        this.fetchScoreAndIncentive()
      ]);
    }
  }
};
</script>
