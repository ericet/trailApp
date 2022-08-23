<template>
  <div>
    <article
      class="prose prose-slate mx-auto max-w-xl w-1/2 mb-2 mt-20 relative text-gray-700"
      v-html="markdownToHtml"
    ></article>
    {{ markdownData }}
  </div>
</template>
<script>
import { marked } from 'marked';
import markdownData from '../assets/data/join.md';

export default {
  computed: {
    markdownToHtml() {
      return marked.parse(markdownData);
    },
  },
};
</script>
