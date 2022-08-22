<template>
    <div class="mx-auto max-w-4xl w-1/2 mb-2 relative text-gray-700">
        <input class="w-full h-10 pl-3 pr-8 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
            type="text" v-model="steemid" :placeholder="$t('missing.enter_steem_id')" @change="join" />
    </div>
</template>
<script>
import { api } from 'steem';

export default {
    data() {
        return {
            steemid: '',
            error: '',
            followed: false,
            authorized:false,
        }
    },
    methods: {
        async join() {
            let isValid = await this.isValidAccount(this.steemid);
            if (isValid) {
                this.followed = await this.hasFollowed(this.steemid);
                if (this.followed) {
                    this.authorized = await this.hasAuthorized(this.steemid)
                }
            } else {
                this.error = this.$t("missing.invalid_account");
            }
        },
        hasAuthorized(account) {
            return new Promise((resolve) => {
                api.getAccounts([account], (err, result) => {
                    if (!err) {
                        for (let ac of result) {
                            let account_auths = ac.posting.account_auths;
                             for (let app of account_auths) {
                                if (app[0] === this.$store.state.account) {
                                    resolve(true);
                                }
                             }
                        }
                        resolve(false);
                    }
                });
            });
        },
        hasFollowed(account) {
            return new Promise((resolve) => {
                api.getFollowers(this.$store.state.account, account, 'blog', 1, (err, result) => {
                    if (!err && result.length > 0) {
                        resolve(true);
                    } else {
                        resolve(false)
                    }
                });
            });
        },
        isValidAccount(account) {
            return new Promise((resolve, reject) => {
                api.lookupAccountNames([account], (err, result) => {
                    if (!err) {
                        result[0] === null ? resolve(false) : resolve(true);
                    } else {
                        reject(err);
                    }
                });
            });
        }
    },
}
</script>