<template lang="pug">
.physical-bubble(ref="elementRef")
</template>

<style lang="stylus">
$circle-radius = 75px
$line-length = 1.4 * $circle-radius
$text-line-spacing = 10px
$line45deg-length = 50px
$line45deg-translate = -($circle-radius + $line45deg-length / 2) * cos(45deg)
$show-color = $theme-color-pink
$particle-project-circle-radius = 27px

.physical-bubble
  display block
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  opacity 1
  transition opacity 0.3s linear

  &.hide
    opacity 0

  .isolated-particle-view
    width 2 * $circle-radius
    height 2 * $circle-radius
    // background-color rgba(155,155,0,0.2)
    position fixed
    top 0
    left 0
    opacity 0
    transition opacity 0.6s linear

    &.show
      opacity 1
      transition opacity 0.3s linear

    .text
      width 2 * $circle-radius - 40px
      font-size 0.7em
      line-height 1.4
      font-family 'Raleway', sans-serif
      font-weight 500
      color $show-color
      text-align right
      position absolute
      top 50%
      left 50%
      transform translateY(-50%)
      margin-left - @width - $line-length - $text-line-spacing

    .line
      width $line-length
      height 1px
      background-color $show-color
      position absolute
      top 50%
      left 50%
      margin-left: (- $line-length)

  .project-particle-view
    width 2 * $circle-radius
    height 2 * $circle-radius
    position fixed
    top 0
    left 0
    opacity 0
    transition opacity 0.3s linear

    &.show
      opacity 1

    .circle
      width 2 * $particle-project-circle-radius
      height 2 * $particle-project-circle-radius
      position absolute
      top 50%
      left 50%
      margin-top: (- $particle-project-circle-radius)
      margin-left: (- $particle-project-circle-radius)
      background-color alpha($theme-color-pink, 0.6)
      transition background-color 0.5s linear
      border-radius $particle-project-circle-radius

body:not(.has-touch)
  .physical-bubble
    .project-particle-view
      .circle:hover
        background-color alpha($theme-color-dark-teal, 0.6)

body.has-touch
  .physical-bubble
    .project-particle-view
      .circle.hover
        transition all 0.2s linear
        background-color alpha($theme-color-pink, 0.6)
        border 5px solid $theme-color-pink
        margin-top -32px
        margin-left -32px
        border-radius 32px

.dg.ac
  transition width 0.3s ease

  ul
    background-color #000

  .close-button
    transition width 0.3s ease
</style>

<script setup lang="ts">
import { createBubble } from '@/core/bubble';
import hexToRgbArray from '@/utils/hex-to-rgb-array';

import type { Bubble, BubbleSettings } from '@/core/bubble';

export interface RemoveParticlesSettings {
  /**
   * The number of particles to remove
   */
  num: number;
  /**
   * Whether to automatically adjust the threshold
   */
  threshold: boolean;
}

export interface PhysicalBubbleProps {
  /**
   * Whether the device has touch capabilities
   */
  hasTouch?: boolean;
  /**
   * Whether the bubble is open
   */
  open?: boolean;
  /**
   * Whether the bubble should start
   */
  start?: boolean;
  /**
   * Whether the bubble should be hidden
   */
  hide?: boolean;
  /**
   * Whether the bubble should appear
   */
  appear?: boolean;
  /**
   * The breath of the bubble
   */
  breath?: number;
  /**
   * Whether the bubble is in projects mode
   */
  projectsMode?: boolean;
  /**
   * The color of the blob change
   */
  changeBlobColor?: string;
  /**
   * The number of particles
   */
  numParticles?: number;
  /**
   * The particles to remove
   */
  removeParticles?: RemoveParticlesSettings | null;
  /**
   * The settings of the bubble
   */
  settings?: BubbleSettings | null;
}

const props = withDefaults(defineProps<PhysicalBubbleProps>(), {
  hasTouch: false,
  open: false,
  start: true,
  hide: false,
  appear: true,
  breath: 0,
  projectsMode: false,
  changeBlobColor: '',
  numParticles: 100,
  removeParticles: null,
  settings: null,
});

const emit = defineEmits<{
  (event: 'end-opening'): void;
  (event: 'end-closing'): void;
}>();

const bubble = ref<Bubble | null>(null);
const isOpen = ref(false);
const elementRef = ref<HTMLElement | null>(null);

const defaultSettings: BubbleSettings = {
  name: '',
  timeScale: 1,
  numParticles: props.numParticles,
  particleRadius: 0.001,
  particleAuraRadius: 20,
  randomRadiusFactor: 0.8,
  soothingFactor: 0.8,
  auraTypeMix: 0.005,
  threshold: 1 / props.numParticles,
  mouseRadius: 0.001,
  mouseEasingFactor: 1,
  repelExponent: 8,
  centerAttractExponent: 12,
  centerAttractFactor: 1,
  longRangeCenterAttract: 5,
  equilibriumDistance: 15,
  attractiveness: 0.4,
  longRangeTail: 3,
  viscosity: 0.05,
  startRadius: 30,
  center: {
    xRatio: 0.5,
    yRatio: 0.5,
  },
  hasBoundaries: false,
  showIsolated: false,
  isolatedLabels: [],
  projects: [],
  effectiveCheckRadius: 80,
  maxNeighbours: 1,
  startPosMode: 'circle',
  blobColor: hexToRgbArray('#001433'),
  bgColor: hexToRgbArray('#1a33ff'),
  maxBreath: 15,
  minBreath: -5,
  playPhysics: true,
  showGui: false,
};

const settings = computed<BubbleSettings>(() => ({
  ...defaultSettings,
  ...props.settings,
}));

const bgColor = computed(() => settings.value.bgColor);

const showGui = computed(() => settings.value.showGui);

onMounted(() => {
  if (!elementRef?.value) return;

  bubble.value = createBubble(settings.value, elementRef?.value);
  bubble.value?.init();
  if (showGui.value) bubble.value?.showGui();
  if (props.start) bubble.value?.start({ appear: props.appear });
});

watch(
  () => props.hasTouch,
  newVal => {
    if (newVal) {
      bubble.value?.setHasTouch();
    }
  }
);

watch(
  () => props.open,
  newVal => {
    if (newVal && !isOpen.value) {
      isOpen.value = true;
      bubble.value?.open(() => {
        emit('end-opening');
      });
    } else if (!newVal && isOpen.value) {
      isOpen.value = false;
      bubble.value?.close(() => {
        emit('end-closing');
      });
    }
  }
);

watch(
  () => props.start,
  newVal => {
    if (newVal) {
      bubble.value?.start({ appear: props.appear });
    } else {
      bubble.value?.stop();
    }
  }
);

watch(
  () => props.hide,
  newVal => {
    if (newVal) {
      elementRef.value?.classList.add('hide');
    } else {
      elementRef.value?.classList.remove('hide');
    }
  }
);

watch(
  () => props.breath,
  newVal => {
    bubble.value?.breath(newVal);
  }
);

watch(bgColor, newVal => {
  bubble.value?.changeColor('bgColor', newVal);
});

watch(
  () => props.changeBlobColor,
  newVal => {
    bubble.value?.changeColor('blobColor', newVal);
  }
);

watch(
  () => props.projectsMode,
  newVal => {
    if (newVal) {
      bubble.value?.projectsModeOn();
    } else {
      bubble.value?.projectsModeOff();
    }
  }
);

watch(showGui, newVal => {
  if (newVal) {
    bubble.value?.showGui();
  } else {
    bubble.value?.hideGui();
  }
});

watchDeep(
  () => props.removeParticles,
  newVal => {
    if (newVal) {
      bubble.value?.removeParticles(newVal.num, newVal.threshold);
    }
  }
);
</script>
