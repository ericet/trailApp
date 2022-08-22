<template>
  <div class="locale-switcher">
    <select
      v-model="$i18n.locale"
      @change="updateLanguage()"
      class="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option :value="locale.code" v-for="locale in locales" :key="locale.code">
        {{ locale.name }}
      </option>
    </select>
  </div>
</template>
<script>
import { getSupportedLocales } from '@/utils/i18n/supported-locales';
export default {
  data: () => ({ locales: getSupportedLocales() }),
  methods: {
    updateLanguage() {
      localStorage.setItem('locale', this.$i18n.locale);
    },
  },
};
</script>
