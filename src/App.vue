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
import { useEventListener } from '@vueuse/core';

useHead(head);

const contentId = 'content';
const cursorBlendMode = 'intro';

// Detect if touch event is working as supposed => touch device
const hasTouch = ref(false);
useEventListener(
  'touchstart',
  () => {
    hasTouch.value = true;
    document.body.classList.add('has-touch');
  },
  { once: true }
);

// Prevent default touchmove event to remove 'overscroll' effect
useEventListener(
  'touchmove',
  event => {
    event.preventDefault();
    return false;
  },
  { passive: false }
);
</script>
