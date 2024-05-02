<template lang="pug">
AppCursor(
  :content-id="contentId"
  :blend-mode="cursorBlendMode"
  :has-touch="hasTouch"
)
RouterView
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';

import AppCursor from '@/components/AppCursor.vue';
import head from '@/assets/head';

import { useTouch } from '@/composables/useTouch';

useHead(head);

const contentId = 'content';
const cursorBlendMode = 'intro';

const { hasTouch } = useTouch();
</script>
