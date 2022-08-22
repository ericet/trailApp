<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div v-if="error"
        class="mx-auto max-w-4xl w-1/2 mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert">
        <span class="block sm:inline">{{ error }}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="close">
            <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <title>Close</title>
                <path
                    d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
        </span>
    </div>
    <div v-if="message"
        class="mx-auto max-w-4xl w-1/2 mb-5 bg-teal-100 border border-teal-400 text-teal-700 px-4 py-3 rounded relative"
        role="alert">
        <span class="block sm:inline">{{ message }}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="close">
            <svg class="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <title>Close</title>
                <path
                    d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
        </span>
    </div>
    <div class="mx-auto max-w-4xl w-1/2 mb-2 relative text-gray-700">
        <input class="w-full h-10 pl-3 pr-8 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
            type="text" v-model="steemid" placeholder="Enter Your STEEM ID" @change="search" />
    </div>
    <div class="mx-auto max-w-4xl w-1/2 mb-3 relative text-gray-700">
        <select v-model="selected"
            class="w-full h-10 pl-3 pr-8 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline">
            <option v-for="(post, index) in posts" :key="index" :value="post.permlink + '?' + post.created + 'Z'">
                【{{ formatDate(post.created + "Z") }}】{{ post.title }}</option>
        </select>

    </div>
    <div class="flex mb-8">
        <div class="m-auto">
            <button @click="submit"
                class="h-10 px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-full focus:shadow-outline hover:bg-indigo-800">{{ $t("submit") }}</button>
        </div>
    </div>
</template>
<script>
import { api } from 'steem';
import axios from 'axios';

export default {
    data() {
        return {
            steemid: '',
            posts: [],
            selected: '',
            error: '',
            message: ''

        }
    },
    methods: {
        formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        },
        isValidAccount(account) {
            return new Promise((resolve, reject) => {
                api.lookupAccountNames([account], (err, result) => {
                    if(!err){
                    result[0] === null ? resolve(false) : resolve(true);
                    }else{
                        reject(err);
                    }
                });
            });
        },
        hasVoted(votes) {
            for (let vote of votes) {
                if (vote.voter === this.$store.state.account) {
                    return true;
                }
            }
            return false;
        },
        setDate(date) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        },
        getPosts(username) {
            return new Promise((resolve, reject) => {
                let posts = [];
                api.getDiscussionsByBlog({ tag: username, limit: 50 }, (err, blogs) => {
                    if (blogs && !err) {
                        for (let blog of blogs) {
                            let start = this.setDate(new Date());
                            let created = new Date(blog.created + "Z");
                            let voted = this.hasVoted(blog.active_votes);
                            if (!voted && created < start.getTime() && (new Date() - created) < 6 * 24 * 60 * 60 * 1000 && username === blog.author)
                                posts.push(blog);
                        }
                        resolve(posts);
                    }
                    else {
                        reject(err);
                    }
                });
            });
        },
        async search() {
            let isValid = await this.isValidAccount(this.steemid);
            if (isValid) {
                this.posts = await this.getPosts(this.steemid);
                this.selected = this.posts.length ? this.posts[0].permlink + '?' + this.posts[0].created + 'Z' : ''
            }
        },
        getEligible(account, date) {
            return new Promise((resolve) => {
                const url = `${this.$store.state.api}/getList?account=${account}&date=${date}`;
                axios.get(url).then( (response)=> {
                    if (response.status == 200) {
                        let data = response.data;
                        for (let d of data) {
                            if (d.permlink === null) {
                            resolve(d);
                            }
                        }
                        resolve(null);
                    }
                });

            });
        },
        async submit() {
            const permlink = this.selected.split('?')[0];
            const date = this.selected.split('?')[1];
            let eligible = await this.getEligible(this.steemid, date);
            if (eligible !== null) {
                fetch(`${this.$store.state.api}/report`, {
                    method: 'post', body: JSON.stringify({ account: this.steemid, permlink: permlink, sp: eligible.sp, date: date, hasVoted: false }), headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then((data) => {
                    console.log(data)
                    if (data.error === 'exist') {
                        this.error = data.msg;
                    } else {
                        this.message = "You have successfully reported the missing vote!"
                    }
                })
            } else {
                this.error = "This post is NOT eligible to receive an upvote!"
            }

        },
        close() {
            this.error = '';
            this.message = '';
        }
    },
}
</script>