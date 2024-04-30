<template lang="pug">
.InlineSvg(
  v-once
  v-html="src"
)
</template>

<style lang="stylus">
.InlineSvg
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
