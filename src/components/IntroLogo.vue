<template lang="pug">
InlineSvg.intro-logo(
  :class="classes"
  :src="svgEk"
)
</template>

<style lang="stylus">
$beat-scale = 1.2
$logo-w = 2.5em

.intro-logo
  width $logo-w
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  transition opacity 1s
  pointer-events none
  opacity 0

  svg
    width $logo-w
    animation beating 15s linear infinite
    animation-delay 10s

  &.show
    pointer-events auto
    opacity 1

  path
    fill $theme-color-dark-blue

  &:hover
    path
      transition fill 0.5s linear
      fill $theme-color-dark-white

@keyframes beating
  0%,
  49%,
  51%,
  53%
    transform scale(1, 1)

  50%,
  52%
    transform scale($beat-scale, $beat-scale)
</style>

<script setup lang="ts">
import svgEk from '@/assets/images/ek.svg';
import InlineSvg from '@/components/utils/InlineSvg.vue';

export interface IntroLogoProps {
  /**
   * Whether to show the logo
   */
  show: boolean;
}

const props = defineProps<IntroLogoProps>();

const classes = computed(() => ({
  show: props.show,
  clickable: props.show,
}));
</script>
