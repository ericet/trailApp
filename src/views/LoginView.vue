<template>
  <div>
    <main>
      <section class="absolute w-full h-full">
        <div class="container mx-auto px-4 h-full">
          <div class="flex content-center items-center justify-center h-full">
            <div class="w-full lg:w-4/12 px-4">
              <div
                class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0"
              >
                <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div class="text-gray-500 text-center mb-3 font-bold">
                    <small>Log in with Steem Keychain</small>
                  </div>
                  <form>
                    <div class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="grid-password"
                        >STEEM ID</label
                      ><input
                        v-model="steemid"
                        type="text"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="STEEM ID"
                        style="transition: all 0.15s ease 0s"
                      />
                    </div>
                    <div>
                      <label class="inline-flex items-center cursor-pointer"
                        ><input
                          id="customCheckLogin"
                          type="checkbox"
                          class="form-checkbox border-0 rounded text-gray-800 ml-1 w-5 h-5"
                          style="transition: all 0.15s ease 0s"
                        /><span class="ml-2 text-sm font-semibold text-gray-700"
                          >Remember me</span
                        ></label
                      >
                    </div>
                    <div class="text-center mt-6">
                      <button
                        class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        style="transition: all 0.15s ease 0s"
                        @click.prevent="submit"
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      steemid: '',
      showError: false,
    };
  },
  
  methods: {
    async logout() {
      await this.$store.dispatch('LogOut');
      this.$router.push('/login');
    },
    ...mapActions(['LogIn']),
    async submit() {
      try {
        const message = Date.now();
        console.log(message);
        window.steem_keychain.requestSignBuffer(
          this.steemid,
          'login',
          'Posting',
          async (r) => {
            if (r.success) {
              console.log(r.result);
              const User = new FormData();
              User.append('username', this.steemid);
              User.append('token', r.result);
              console.log(User)
              await this.LogIn(User);
              this.$router.push('/dashboard');
              this.showError = false;
            }
          }
        );
      } catch (error) {
        this.showError = true;
      }
    },
  },
};
</script>
