<template>
  <div class="min-h-screen py-5">
    <div class="overflow-x-auto w-full">
      <TrailSummary
        :trailMembers="trailMembers"
        :trailVp="trailVp"
        :multipier="multipier"
      />
      <table
        class="mx-auto max-w-4xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-hidden"
      >
        <thead class="bg-gray-900">
          <tr class="text-white text-left">
            <th class="font-semibold text-sm uppercase px-6 py-4">#</th>
            <th class="font-semibold text-sm uppercase px-6 py-4">
              <i data-feather="user" class="m-1"></i>
            </th>
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
              @click="sort('vp')"
              class="font-semibold text-sm uppercase px-6 py-4 text-center"
            >
              Voting Power
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(member, index) in sortedMembers" :key="member.name">
            <td class="px-6 py-4">
              <p class="text-2xl">{{ index + 1 }}</p>
            </td>
            <td class="px-6 py-4">
              <div class="inline-flex w-10 h-10">
                <a :href="'https://steemcn.xyz/@' + member.name" target="_blank">
                  <img
                    class="w-10 h-10 object-cover rounded-full"
                    v-bind:src="
                      'https://steemitimages.com/u/' +
                      member.name +
                      '/avatar/small'
                    "
                    onerror="this.src='https://icon-library.com/images/default-user-icon/default-user-icon-20.jpg'"
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
              {{ getPercentage(member.vp) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { api } from 'steem';
import axios from 'axios';
import feather from 'feather-icons';

import TrailSummary from '../components/TrailSummary.vue';
export default {
  mounted() {
    api.setOptions({ url: this.$store.state.steemRpc });
    feather.replace();
    this.setup();
  },
  updated() {
    feather.replace();
  },
  data() {
    return {
      trailMembers: [],
      trailVp: 0,
      multipier: 0,
      currentSort: 'sp',
      currentSortDir: 'desc',
    };
  },
  computed: {
    sortedMembers() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.trailMembers.sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === 'desc') modifier = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    },
  },
  methods: {
    sort(s) {
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }
      this.currentSort = s;
    },
    getPercentage(number) {
      return (number / 100).toFixed(2) + '%';
    },
    async setup() {
      const [followers, spv, vp, multipier] = await Promise.all([
        this.getFollowersList(this.$store.state.account),
        this.getSpv(),
        this.getVp(this.$store.state.account),
        this.getMultipier(),
      ]);
      this.trailMembers = await this.getAuthorizedList(followers, spv);
      this.trailVp = vp / 100;
      this.multipier = multipier;
    },
    getFollowersList(account) {
      return new Promise((resolve, reject) => {
        let followersList = [];
        api.getFollowers(account, '', 'blog', 500, (err, result) => {
          if (!err && result.length > 1) {
            for (let res of result) {
              followersList.push(res.follower);
            }
            resolve(followersList);
          } else {
            reject(err);
          }
        });
      });
    },
    getSpv() {
      return new Promise((resolve, reject) => {
        api.getDynamicGlobalProperties((err, result) => {
          if (!err) {
            let spv =
              result.total_vesting_fund_steem.replace(' STEEM', '') /
              result.total_vesting_shares.replace(' VESTS', '');
            resolve(spv);
          } else {
            console.log(err);
            reject(err);
          }
        });
      });
    },
    getVp(account) {
      return new Promise((resolve, reject) => {
        api.getAccounts([account], (err, result) => {
          if (result != undefined && !err) {
            let vp = this.getVPHF20(result[0]);
            resolve(vp);
          } else {
            reject(err);
          }
        });
      });
    },
    getVPHF20(account) {
      var totalShares =
        parseFloat(account.vesting_shares) +
        parseFloat(account.received_vesting_shares) -
        parseFloat(account.delegated_vesting_shares) -
        parseFloat(account.vesting_withdraw_rate);
      var elapsed = Date.now() / 1000 - account.voting_manabar.last_update_time;
      var maxMana = totalShares * 1000000;
      // 432000 sec = 5 days
      var currentMana =
        parseFloat(account.voting_manabar.current_mana) +
        (elapsed * maxMana) / 432000;
      if (currentMana > maxMana) {
        currentMana = maxMana;
      }
      var currentManaPerc = (currentMana * 100) / maxMana;
      return Math.round(currentManaPerc * 100);
    },
    getDailyVoteList(date) {
      const url = `${this.$store.state.api}/getList?date=${date}`;
      axios.get(url).then((response) => {
        if (response.status == 200) {
          let data = response.data;
          for (let d of data) {
            this.upvoteList.push({
              account: d.account,
              sp: d.sp,
              hasVoted: d.hasVoted,
              permlink: d.permlink,
            });
          }
        }
      });
    },
    getAuthorizedList(accounts, spv) {
      return new Promise((resolve, reject) => {
        api.getAccounts(accounts, (err, result) => {
          let authorizedList = [];
          if (!err) {
            for (let account of result) {
              let account_auths = account.posting.account_auths;
              for (let app of account_auths) {
                if (app[0] === this.$store.state.account) {
                  let sp =
                    (Number(account.received_vesting_shares.split(' ')[0]) -
                      Number(account.delegated_vesting_shares.split(' ')[0]) +
                      Number(account.vesting_shares.split(' ')[0])) *
                    spv;
                  let vp = this.getVPHF20(account);
                  authorizedList.push({
                    name: account.name,
                    sp: Number(sp.toFixed(3)),
                    vp: Number(vp.toFixed(2)),
                  });
                }
              }
              resolve(authorizedList);
            }
          } else {
            reject(err);
          }
        });
      });
    },
    getMultipier() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.$store.state.api}/getSettings`)
          .then((res) => {
            resolve(10 + res.data[0].current_multipier);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
  components: { TrailSummary },
};
</script>
