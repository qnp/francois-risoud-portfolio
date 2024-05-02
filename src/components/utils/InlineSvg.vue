<template lang="pug">
.inline-svg(
  v-once
  v-html="src"
)
</template>

<style lang="stylus">
.inline-svg
  display flex
  align-items center
</style>

<script setup lang="ts">
export interface InlineSvgProps {
  /**
   * The SVG markup as a string.
   */
  src: string;
}

defineProps<InlineSvgProps>();
</script>
