<template lang="pug">
main.project(
  ref="elementRef"
  :class="classes"
  :style="computedBlendModeStyle"
)
  .image-wrapper(:style="computedImageWrapperStyle")
    .image(:style="computedImageStyle")
  .infos(:style="computedInfosStyle")
    a(
      :href="selectedProject?.url"
      target="_blank"
    )
      h1 {{ selectedProject?.title }} - {{ selectedProject?.type }}
        InlineSvg(:src="svgNewWindow")

    h2(v-if="selectedProject?.date") {{ selectedProject.date }}
    h2(
      v-for="(infoLine, index) in selectedProject?.techInfos"
      :key="index"
    ) {{ infoLine }}
</template>

<style lang="stylus">
main.project
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  opacity 0
  transition opacity 1s ease-in

  .image-wrapper
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    background-color $theme-color-dark-blue
    opacity 1
    transition opacity 0.5s linear

  .image
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    transition opacity 0.5s linear
    background-size cover
    background-position center center

  .infos
    position absolute
    left $theme-margin-left-right
    bottom $theme-margin-top
    padding 14px 32px 20px
    line-height 1.5
    font-family 'Raleway', sans-serif
    color $theme-color-white

    h1
      white-space nowrap
      font-weight 700
      font-size $golden-num em

    h2
      font-weight 400
      font-size 1em
      font-family $the-serif, serif

    .inline-svg
      display none

  &.show
    opacity 1
    transition opacity 0.2s ease-in

  &.transition
    .image-wrapper
      opacity 0

body.has-touch
  main.project
    .infos
      a
        pointer-events all

        .inline-svg
          display inline-block
          margin-left 0.26em

          svg
            height 1em
            width 0.35em

            path,
            polygon
              fill $theme-color-white

@media only screen and (max-width 1100px)
  main.project
    .infos
      bottom $theme-margin-top-mobile

@media only screen and (max-width 660px)
  main.project
    .infos
      top auto
      left 0
      right 0
      bottom 0
      padding ($theme-margin-top-mobile - 10px) $theme-margin-left-right $theme-margin-top-mobile

  body.has-touch
    main.project
      .infos
        padding ($theme-margin-top-mobile / 2 - 5px) $theme-margin-left-right ($theme-margin-top-mobile / 2)

        h1
          font-size 1em

        h2
          font-size: (1 / $golden-num-sqrt)em

@media only screen and (max-width 400px)
  body.has-touch
    main.project
      .infos
        padding ($theme-margin-top-mobile / 2 - 5px) $theme-margin-left-right-mobile ($theme-margin-top-mobile / 2)

        h1
          font-size: (1 / $golden-num-sqrt)em

        h2
          font-size: (1 / $golden-num)em

@media only screen and (max-width 340px)
  body.has-touch
    main.project
      .infos
        h1
          font-size: (1 / $golden-num)em
          margin-bottom 2px

        h2
          font-size: (1 / $golden-num)em

@media only screen and (min-width 661px) and (max-height 700px)
  main.project
    .infos
      bottom: ($theme-margin-top / 2)

@media only screen and (max-width 340px) and (max-height 580px)
  body.has-touch
    main.project
      .infos
        padding ($theme-margin-top-mobile / 2 - 10px) ($theme-margin-left-right-mobile - 10px) ($theme-margin-top-mobile / 2 - 10px)
</style>

<script setup lang="ts">
import svgNewWindow from '@/assets/images/new-window-inline.svg';
import InlineSvg from '@/components/utils/InlineSvg.vue';
import ActionStack from '@/utils/action-stack';
import { useTouch } from '@/composables/useTouch';

import type { CSSProperties } from 'vue';

export interface ProjectContentProps {
  /**
   * Whether the project content should be shown
   */
  show?: boolean;
  /**
   * The ID of the project
   */
  id?: string | null;
  /**
   * The project data
   */
  project?: Project | null;
  /**
   * The origin position of the project
   */
  origin?: Position;
  /**
   * The center position of the project
   */
  centerPosition?: Position;
}

const props = withDefaults(defineProps<ProjectContentProps>(), {
  show: false,
  id: '',
  project: null,
  origin: () => ({ x: 0, y: 0 }),
  centerPosition: () => ({ x: 0, y: 0 }),
});

const { hasTouch } = useTouch();
const { width } = useWindowSize();
const actionStack = new ActionStack();
const elementRef = ref<HTMLElement | null>(null);

const firstProject = ref(true);
const animating = ref(false);
const removeImageBg = ref(false);
const removeImageBgTimeout = ref<NodeJS.Timeout | null>(null);
const opacityChange = ref(false);
const opacityChangeTimeout = ref<NodeJS.Timeout | null>(null);
const transition = ref(false);
const selectedProject = ref<Project | null>(null);
const radius = ref(0);
const newPos = ref({ x: 0, y: 0 });

const classes = computed(() => ({
  show: props.show,
  transition: transition.value,
}));

const computedImageStyle = computed<CSSProperties>(() => {
  const urlName = width.value > 600 ? 'imageUrl' : 'smallImageUrl';
  const backgroundImage =
    removeImageBg.value || !selectedProject.value
      ? 'none'
      : `url(${selectedProject.value[urlName]})`;
  const opacity = opacityChange.value ? 0 : 1;
  return {
    'background-image': backgroundImage,
    opacity,
  };
});

const computedImageWrapperStyle = computed(() => {
  const { x, y } = elementRef.value?.getBoundingClientRect() ?? { x: 0, y: 0 };
  const center = {
    x: props.centerPosition.x - x + diff.value.x,
    y: props.centerPosition.y - y + diff.value.y,
  };

  return {
    'clip-path': `circle(${radius.value}px at ${center.x}px ${center.y}px)`,
  };
});

const computedInfosStyle = computed<CSSProperties>(() => ({
  'background-color': selectedProject.value?.bgColor,
}));

const computedBlendModeStyle = computed<CSSProperties>(() => ({
  'mix-blend-mode': selectedProject.value?.blendMode ?? 'lighten',
}));

const diff = computed(() => {
  return {
    x: newPos.value ? newPos.value.x - props.centerPosition.x : 0,
    y: newPos.value ? newPos.value.y - props.centerPosition.y : 0,
  };
});

useEventListener('update-origin', e => {
  if (props.id === e.detail.id) {
    newPos.value = e.detail.newPos;
  }
});

function animateLoop(): void {
  animating.value = true;

  function tick(): void {
    actionStack.increment();
    if (animating.value) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function getTargetRadius(): number {
  const { width, height } = elementRef.value?.getBoundingClientRect() ?? {
    width: 3000,
    height: 2000,
  };

  const distanceBR = Math.sqrt(
    (width - (props.origin.x ? props.origin.x : 0)) ** 2 +
      (height - (props.origin.y ? props.origin.y : 0)) ** 2
  );
  const distanceTR = Math.sqrt(
    (width - (props.origin.x ? props.origin.x : 0)) ** 2 +
      (props.origin.y ? props.origin.y : 0) ** 2
  );
  const distanceTL = Math.sqrt(
    (props.origin.x ? props.origin.x : 0) ** 2 +
      (props.origin.y ? props.origin.y : 0) ** 2
  );
  const distanceBL = Math.sqrt(
    (props.origin.x ? props.origin.x : 0) ** 2 +
      (height - (props.origin.y ? props.origin.y : 0)) ** 2
  );

  const offset = 50;
  const targetRadius =
    Math.max(distanceBR, distanceTR, distanceTL, distanceBL) + offset;

  return targetRadius;
}

function showProject(targetRadius: number): void {
  if (removeImageBgTimeout.value) clearTimeout(removeImageBgTimeout.value);
  removeImageBgTimeout.value = null;
  removeImageBg.value = false;

  if (opacityChangeTimeout.value) clearTimeout(opacityChangeTimeout.value);
  opacityChangeTimeout.value = null;
  opacityChange.value = false;

  actionStack.remove(['hide-project']).add({
    name: 'show-project',
    object: radius,
    ref: 'value',
    to: targetRadius,
    easing: 0.075,
    completePercent: 0.99,
    done: () => {
      animating.value = false;
    },
  });

  if (!animating.value) animateLoop();
}

function hideProject(): void {
  removeImageBgTimeout.value = setTimeout(() => {
    removeImageBg.value = true;
  }, 500);

  opacityChangeTimeout.value = setTimeout(() => {
    opacityChange.value = true;
    firstProject.value = true;
  }, 50);

  actionStack.remove(['show-project']).add({
    name: 'hide-project',
    object: radius,
    ref: 'value',
    to: 0.1,
    easing: 0.2,
    completePercent: 0.9,
    done: () => {
      animating.value = false;
    },
  });

  if (!animating.value) animateLoop();
}

watch(
  () => props.project,
  newVal => {
    if (firstProject.value) {
      firstProject.value = false;
      selectedProject.value = newVal;
    } else {
      if (hasTouch.value) {
        transition.value = true;
        setTimeout(() => {
          transition.value = false;
          selectedProject.value = newVal;
        }, 510);
      } else {
        selectedProject.value = newVal;
      }
    }
  }
);

watch(
  () => props.show,
  newVal => {
    if (newVal) {
      const targetRadius = getTargetRadius();
      showProject(targetRadius);
    } else {
      hideProject();
    }
  }
);
</script>
