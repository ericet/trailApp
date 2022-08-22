<template>
  <!-- grid wrapper card -->
  <div
    class="mx-auto max-w-4xl pb-5 wrapper-card grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2 gap-2 mt-5"
  >
    <!-- card  -->
    <div
      class="card bg-white dark:bg-gray-800 w-full rounded-md p-5 shadow flex"
    >
      <div class="p-2 max-w-sm">
        <div
          class="bg-orange-200 rounded-full w-14 h-14 text-lg p-3 text-orange-600 mx-auto"
        >
          <span class="">
            <i data-feather="star" class="m-1 scale-150"></i>
          </span>
        </div>
      </div>

      <div class="block p-2 w-full">
        <p class="font-semibold text-gray-900 dark:text-gray-200 text-2xl">
          {{ getTrailSp }}
        </p>
        <h2 class="font-normal text-gray-400 text-md mt-1">
          {{ $t("summary.total_steem_power") }}
        </h2>
      </div>
    </div>
    <!-- end card -->
    <div
      class="card bg-white dark:bg-gray-800 w-full rounded-md p-5 shadow flex"
    >
      <div class="p-2 max-w-sm">
        <div
          class="bg-green-200 rounded-full w-14 h-14 text-lg p-3 text-green-600 mx-auto"
        >
          <span class="">
            <i data-feather="user" class="m-1 scale-150"></i>
          </span>
        </div>
      </div>

      <div class="block p-2 w-full">
        <p class="font-semibold text-gray-900 dark:text-gray-200 text-2xl">
          {{ getTotalMembers }}
        </p>
        <h2 class="font-normal text-gray-400 text-md mt-1">{{ $t("summary.total_members") }}</h2>
      </div>
    </div>
    <!-- end card -->
    <div
      class="card bg-white dark:bg-gray-800 w-full rounded-md p-5 shadow flex"
    >
      <div class="p-2 max-w-sm">
        <div
          class="bg-red-200 rounded-full w-14 h-14 text-lg p-3 text-red-600 mx-auto"
        >
          <span class="">
            <i data-feather="battery-charging" class="m-1 scale-150"></i>
          </span>
        </div>
      </div>

      <div class="block p-2 w-full">
        <p class="font-semibold text-gray-900 dark:text-gray-200 text-2xl">
          {{ trailVp }}%
        </p>
        <h2 class="font-normal text-gray-400 text-md mt-1">{{ $t("summary.voting_power") }}</h2>
      </div>
    </div>
    <!-- end card -->
    <div
      class="card bg-white dark:bg-gray-800 w-full rounded-md p-5 shadow flex"
    >
      <div class="p-2 max-w-sm">
        <div
          class="bg-purple-200 rounded-full w-14 h-14 text-lg p-3 text-purple-600 mx-auto"
        >
          <span class="">
            <i data-feather="x" class="m-1 scale-150"></i>
          </span>
        </div>
      </div>

      <div class="block p-2 w-full">
        <p class="font-semibold text-gray-900 dark:text-gray-200 text-2xl">
          {{ multipier }}
        </p>
        <h2 class="font-normal text-gray-400 text-md mt-1">
          {{ $t("summary.multipier") }}
        </h2>
      </div>
    </div>
    <!-- end card -->
  </div>
</template>

<script>
import feather from 'feather-icons';

export default {
  mounted() {
    feather.replace();
  },
  updated() {
    feather.replace();
  },
  computed: {
    getTrailSp() {
      let total = 0;
      this.trailMembers.forEach((element) => {
        total += element.sp;
      });
      return total.toFixed(0);
    },
    getTotalMembers() {
      return this.trailMembers.length;
    },
  },
  props: ['trailMembers', 'trailVp', 'multipier'],
};
</script>
