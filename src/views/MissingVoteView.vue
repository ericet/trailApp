<template>

  <div class="min-h-screen py-5">
     
    <div class="overflow-x-auto w-full">
     <Report />
      <table
        class="mx-auto max-w-4xl w-full whitespace-nowrap rounded-lg bg-white divide-y divide-gray-300 overflow-hidden">
        <thead class="bg-gray-900">
          <tr class="text-white text-left">
            <th class="font-semibold text-sm uppercase px-6 py-4"><i data-feather="user" class="m-1"></i></th>
            <th @click="sort('name')" class="font-semibold text-sm uppercase px-6 py-4">
              STEEM ID
            </th>
            <th @click="sort('sp')" class="font-semibold text-sm uppercase px-6 py-4">
              STEEM Power
            </th>
            <th class="font-semibold text-sm uppercase px-6 py-4 text-center">
              {{ $t("post_link") }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="member in sortedMembers" :key="member.account" :class="member.hasVoted ? 'bg-teal-100' : ''">
            <td class="px-6 py-4">
              <div class="inline-flex w-10 h-10">
                <a :href="'https://steem.buzz/@' + member.account" target="_blank">
                  <img class="w-10 h-10 object-cover rounded-full" alt="User avatar" v-bind:src="
                    'https://steemitimages.com/u/' +
                    member.account +
                    '/avatar/small'
                  " />
                </a>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <div>
                  <p>{{ member.account }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="">{{ member.sp }}</p>
            </td>

            <td class="px-6 py-4 text-center">
              <a :href="
                'https://steem.buzz/@' + member.account + '/' + member.permlink
              " class="text-sky-600">Link</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import feather from 'feather-icons';
import Report from '@/components/Report.vue';

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
            pendingList: [],
            missingList: [],
            steemid: "",
            posts: [],
            currentSort: "sp",
            currentSortDir: "desc",
        };
    },
    computed: {
        sortedMembers() {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            return this.pendingList.sort((a, b) => {
                let modifier = 1;
                if (this.currentSortDir === "desc")
                    modifier = -1;
                if (a[this.currentSort] < b[this.currentSort])
                    return -1 * modifier;
                if (a[this.currentSort] > b[this.currentSort])
                    return 1 * modifier;
                return 0;
            });
        },
    },
    methods: {
        async setup() {
            this.pendingList = await this.getPendingList();
        },
        sort(s) {
            if (s === this.currentSort) {
                this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
            }
            this.currentSort = s;
        },
        getPendingList() {
            return new Promise((resolve, reject) => {
                const url = `${this.$store.state.api}/getPendings`;
                let pendingList = [];
                axios.get(url).then(function (response) {
                    if (response.status == 200) {
                        let data = response.data;
                        for (let d of data) {
                            pendingList.push({ account: d.account, sp: d.sp, date: d.date, permlink: d.permlink });
                        }
                        resolve(pendingList);
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        },
        
    },
    components: { Report }
};
</script>
