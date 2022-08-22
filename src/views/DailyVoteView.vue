<template>
  <div class="min-h-screen py-5">
    <div class="overflow-x-auto w-full">
      <select
        class="mx-auto max-w-4xl w-1/4 block p-2 mb-6 text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        @change="getListByDate($event)"
      >
        <option :value="date" v-for="date in options" :key="date">
          {{ date }}
        </option>
      </select>
      <table
        class="mx-auto max-w-4xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-hidden"
      >
        <thead class="bg-gray-900">
          <tr class="text-white text-left">
            <th class="font-semibold text-sm uppercase px-6 py-4"><i data-feather="user" class="m-1"></i></th>
            <th
              @click="sort('name')"
              class="font-semibold text-sm uppercase px-6 py-4"
            >
              STEEM ID
            </th>
            <th
              @click="sort('sp')"
              class="font-semibold text-sm uppercase px-6 py-4"
            >
              STEEM Power
            </th>
            <th
              @click="sort('score')"
              class="font-semibold text-sm uppercase px-6 py-4 text-center"
            >
              Score
            </th>
            <th
              @click="sort('incentive')"
              class="font-semibold text-sm uppercase px-6 py-4 text-center"
            >
              Incentive
            </th>
            <th
              @click="sort('hasVoted')"
              class="font-semibold text-sm uppercase px-6 py-4 text-center"
            >
              Voted
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="member in sortedMembers"
            :key="member.name"
            :class="member.hasVoted ? 'bg-teal-100' : ''"
          >
            <td class="px-6 py-4">
              <div class="inline-flex w-10 h-10">
                <a :href="'https://steem.buzz/@' + member.name" target="_blank">
                  <img
                    class="w-10 h-10 object-cover rounded-full"
                    alt="User avatar"
                    v-bind:src="
                      'https://steemitimages.com/u/' +
                      member.name +
                      '/avatar/small'
                    "
                  />
                </a>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <div>
                  <p>{{ member.name }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="">{{ member.sp }}</p>
            </td>
            <td class="px-6 py-4 text-center">
              {{ member.score }}
            </td>
            <td class="px-6 py-4 text-center">
              {{ member.incentive }}
            </td>
            <td v-if="member.hasVoted" class="px-6 py-4 text-center">
              <a
                :href="
                  'https://steem.buzz/@' + member.name + '/' + member.permlink
                "
                class="text-sky-600"
                >Link</a
              >
            </td>
            <td v-else class="px-6 py-4 text-center">No</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import feather from 'feather-icons';

export default {
   mounted() {
    feather.replace();
    this.setup();
  },
  updated() {
    feather.replace();
  },
  data() {
    return {
      voteList: [],
      options: [],
      currentSort: 'hasVoted',
      currentSortDir: 'desc',
    };
  },
  computed: {
    sortedMembers() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.voteList.sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === 'desc') modifier = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    },
  },
  methods: {
    async setup(){
      this.getDateOptions();
      this.voteList = await this.getDailyVoteList(new Date());
    },
    sort(s) {
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }
      this.currentSort = s;
    },
    getDailyVoteList(date) {
      return new Promise((resolve, reject) => {
        const url = `${this.$store.state.api}/getList?date=${date}`;
        axios
          .get(url)
          .then((response) => {
            if (response.status == 200) {
              let data = response.data;
              let voteList = [];
              for (let d of data) {
                let hasVoted = d.permlink === null ? false : true;
                let score = (d.votes / d.totalVotes).toFixed(2);
                let incentive = '';
                if (score >= 0.8) {
                  incentive = '+' + ((score - 0.8) * 100).toFixed(2) + '%';
                } else {
                  incentive = '-' + ((1 - score) * 100).toFixed(2) + '%';
                }
                voteList.push({
                  name: d.account,
                  sp: d.sp,
                  hasVoted: hasVoted,
                  permlink: d.permlink,
                  score: `${d.votes}/${d.totalVotes}=${score}`,
                  incentive: incentive,
                });
              }
              resolve(voteList);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    async getListByDate(event) {
      let date = event.target.value;
      let d = new Date(date);
      d.toLocaleDateString('en-US', { timeZone: 'Asia/Shanghai' });
      this.voteList = [];
      this.voteList = await this.getDailyVoteList(d);
    },
    formatDate(date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    },
    getDateOptions() {
      let date = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
      });
      let curr = new Date(date);
      let first = curr.getDate();
      for (let i = 0; i < 7; i++) {
        let next = new Date(curr.getTime());
        next.setDate(first - i);
        this.options.push(this.formatDate(next.toString()));
      }
    },
  },
};
</script>
