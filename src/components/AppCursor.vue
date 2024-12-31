<template lang="pug">
.AppCursor(
  ref="elementRef"
  :class="classes"
)
  .AppCursor__content
  .AppCursor__socialIcon--fifteen
    InlineSvg(:src="svgFifteen")
  .AppCursor__socialIcon--x
    InlineSvg(:src="svgX")
  .AppCursor__socialIcon--github
    InlineSvg(:src="svgGithub")
  .AppCursor__socialIcon--linkedin
    InlineSvg(:src="svgLinkedin")
  .AppCursor__socialIcon--mailto
    InlineSvg(:src="svgMail")
  .AppCursor__socialIcon--newWindow
    InlineSvg(:src="svgNewWindow")
  .AppCursor__scrollIcon
    InlineSvg(:src="svgScroll")
</template>

<style lang="stylus">
$cursor-color = $theme-color-pink
$cursor-size = 60px
$visor-size = 0
$transition-duration-all = 0.1s
$transition-duration-down-clickable = 0.5s
$normal-scale = 0.2
$click-scale = 0.8
$clickable-scale = 1
$clickable-opacity = 1
$social-icon-size = 60px
$fifteen-icon-ratio-wh = 1
$x-icon-ratio-wh = 1
$github-icon-ratio-wh = 1
$linkedin-icon-ratio-wh = 1
$new-window-icon-ratio-wh = 1
$mail-icon-ratio-wh = 0.7
$scroll-icon-size = 96px

html,
body
  cursor none

.AppCursor
  position absolute
  top 0
  pointer-events none
  width $cursor-size
  height $cursor-size
  position fixed
  top -($cursor-size / 2)
  left -($cursor-size / 2)
  z-index 999

  &--transition
    transition transform 250ms ease-out

  &--blendIntro
    mix-blend-mode hard-light

  &--blendMain
    mix-blend-mode hard-light

  &__content
    pointer-events none
    width $cursor-size
    height $cursor-size
    background-color $cursor-color
    border-radius: ($cursor-size / 2)
    transition all $transition-duration-all ease-out

  &__socialIcon
    width $social-icon-size
    position absolute
    top 50%
    left 50%
    margin-left: (- $social-icon-size / 2)
    transition all $transition-duration-all ease-out
    opacity 0
    transform scale(0)

    svg
      width $social-icon-size

      path,
      polygon
        fill $theme-color-pink

    &--fifteen
      margin-top: (- $social-icon-size * $fifteen-icon-ratio-wh / 2)

    &--x
      margin-top: (- $social-icon-size * $x-icon-ratio-wh / 2)

    &--github
      margin-top: (- $social-icon-size * $github-icon-ratio-wh / 2)

    &--linkedin
      margin-top: (- $social-icon-size * $linkedin-icon-ratio-wh / 2)

    &--mailto
      margin-top: (- $social-icon-size * $mail-icon-ratio-wh / 2)

    &--newWindow
      margin-top: (- $social-icon-size * $new-window-icon-ratio-wh / 2)

  &__scrollIcon
    position absolute
    top 10px
    pointer-events none
    width $scroll-icon-size
    margin-left: (-($scroll-icon-size - $cursor-size) / 2)
    opacity 0
    transform scale(0)
    transition all $transition-duration-all ease-out

    svg
      width $scroll-icon-size

      path,
      polygon
        fill $theme-color-pink

  &--hidden
    &__content
      transform scale(0)

  &--visible
    &__content
      transform scale($normal-scale)

  &:not(&--hidden)
    &:not(&--x):not(&--github):not(&--mailto):not(&--scroll)&:not(&--fifteen):not(&--linkedin)
      &--down
        &__content
          transform scale($normal-scale * $click-scale)

      &--clickable
        &__content
          transform scale($clickable-scale)
          opacity $clickable-opacity

        &--down
          &__content
            transform scale($clickable-scale * $click-scale)

      &--selectable
        &--down
          &__content
            width 4px
            height (3 / 4) * $cursor-size
            transform translate((($cursor-size - @width) / 2), (1 / 6) * $cursor-size)

    &--fifteen,
    &--x,
    &--github,
    &--linkedin,
    &--mailto,
    &--newWindow
      &__content
        transform scale(0)

    &--fifteen
      &__socialIcon--fifteen
        transform scale($clickable-scale)
        opacity $clickable-opacity

      &--down
        &__socialIcon--fifteen
          transform scale($clickable-scale * $click-scale)

    &--x
      &__socialIcon--x
        transform scale($clickable-scale)
        opacity $clickable-opacity

      &--down
        &__socialIcon--x
          transform scale($clickable-scale * $click-scale)

    &--github
      &__socialIcon--github
        transform scale($clickable-scale)
        opacity $clickable-opacity

      &--down
        &__socialIcon--github
          transform scale($clickable-scale * $click-scale)

    &--linkedin
      &__socialIcon--linkedin
        transform scale($clickable-scale)
        opacity $clickable-opacity

      &--down
        &__socialIcon--linkedin
          transform scale($clickable-scale * $click-scale)

    &--mailto
      &__socialIcon--mailto
        transform scale($clickable-scale)
        opacity $clickable-opacity

      &--clicked
        &__socialIcon--mailto
          animation send-message 1s ease-in
          animation-fill-mode forwards

    &--newWindow
      &__socialIcon--newWindow
        transform scale($clickable-scale)
        opacity $clickable-opacity

      &--down
        &__socialIcon--newWindow
          transform scale($clickable-scale * $click-scale)

    &--scroll
      &__content
        transform scale(0)

      &__scrollIcon
        transform scale($clickable-scale)
        opacity $clickable-opacity

      &--down
        &__scrollIcon
          transform scale($clickable-scale * $click-scale)

@keyframes send-message
  0%
    transform translateX(0)

  50%
    transform translateX(3000px)

  51%
    transform scale(0) translateX(0)

  100%
    transform scale(1) translateX(0)
</style>

<script setup lang="ts">
import svgFifteen from '@/assets/images/cursors/fifteen.svg';
import svgX from '@/assets/images/cursors/x.svg';
import svgGithub from '@/assets/images/cursors/github.svg';
import svgLinkedin from '@/assets/images/cursors/linkedin.svg';
import svgMail from '@/assets/images/cursors/mail.svg';
import svgNewWindow from '@/assets/images/cursors/new-window.svg';
import svgScroll from '@/assets/images/cursors/scroll.svg';
import rot13 from '@/utils/rot13';
import InlineSvg from '@/components/utils/InlineSvg.vue';
import { useTouch } from '@/composables/useTouch';

type CursorBlendMode = 'intro' | 'main';

export interface AppCursorProps {
  /**
   * The id of the content element
   */
  contentId: string;
  /**
   * The blend mode of the cursor, named upon the app view context
   */
  blendMode: CursorBlendMode;
}

const props = defineProps<AppCursorProps>();

const router = useRouter();
const { hasTouch } = useTouch();

interface ClickableConfig {
  selector: string;
  cursorClasses: string[];
}

const clickableSettings: ClickableConfig[] = [
  {
    selector: 'a[href]:not([href^=mailto]):not([href^=http]):not(.active)',
    cursorClasses: ['AppCursor--clickable'],
  },
  {
    selector: 'p, h1, h2, h3, h4',
    cursorClasses: ['AppCursor--selectable'],
  },
  {
    selector: '[href^=mailto]',
    cursorClasses: ['AppCursor--mailto'],
  },
  {
    selector: 'a.x',
    cursorClasses: ['AppCursor--x'],
  },
  {
    selector: 'a.github',
    cursorClasses: ['AppCursor--github'],
  },
  {
    selector: 'a.linkedin',
    cursorClasses: ['AppCursor--linkedin'],
  },
  {
    selector: 'a.fifteen',
    cursorClasses: ['AppCursor--fifteen'],
  },
  {
    selector: '.scroll-invite',
    cursorClasses: ['AppCursor--scroll'],
  },
  {
    selector: 'a[href^=http]:not(.x):not(.github):not(.fifteen):not(.linkedin)',
    cursorClasses: ['AppCursor--newWindow'],
  },
];

interface EventConfig {
  selector: string;
  onClick: (e: MouseEvent) => void;
}

const eventSettings: EventConfig[] = [
  {
    selector: 'a[href].circle',
    onClick(event) {
      if (hasTouch.value) {
        event.preventDefault();
        return false;
      }
    },
  },
  {
    selector: 'a[href]:not([href^=mailto]):not([href^=http])',
    onClick(event) {
      event.preventDefault();
      const href = (event.target as HTMLElement)
        .closest('a[href]')
        ?.getAttribute('href');
      if (href) router.push(href);
      return false;
    },
  },
  {
    selector: '[href^=mailto]',
    onClick(event) {
      event.preventDefault();
      // Go to mailto href after 1 second to let the user see the mailing animation
      setTimeout(function () {
        window.location.href = 'mailto:' + rot13('senapbvf.evfbhq@tznvy.pbz');
      }, 1000);
      return false;
    },
  },
];

const stickySelector = '.sticky';
const stickiness = 0.4;
const transitionStickyDuration = 300;

// Store mouse position
const mouse = { x: 0, y: 0 };

const stickyElement = ref<Element | null>(null);
const transition = ref(false);
const unsetTransitionOnce = ref(false);
const clicked = ref(false);
const down = ref(false);

type ViewClass = 'AppCursor--hidden' | 'AppCursor--visible';

const viewClass = ref<ViewClass>('AppCursor--hidden');
const cursorClasses = ref<string[]>([]);
const blendModeClass = computed<`AppCursor--blend${Capitalize<CursorBlendMode>}`>(
  () => `AppCursor--blend${capitalize(props.blendMode)}`
);
const classes = computed(() => [
  blendModeClass.value,
  viewClass.value,
  ...cursorClasses.value,
  {
    'AppCursor--transition': transition.value,
    'AppCursor--clicked': clicked.value,
    'AppCursor--down': down.value,
  },
]);

const elementRef = ref<HTMLElement | null>(null);

onMounted(() => {
  // Setup specific event handlers
  setupEvents();

  document.body.addEventListener('mousemove', event => {
    if (!hasTouch.value) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      checkClickable(mouse.x, mouse.y);
      setCursorPosition(mouse.x, mouse.y);
      if (viewClass.value !== 'AppCursor--visible') viewClass.value = 'AppCursor--visible';
    }
  });
  document.body.addEventListener('mouseenter', event => {
    if (!hasTouch.value) {
      setCursorPosition(event.clientX, event.clientY);
      viewClass.value = 'AppCursor--visible';
    }
  });
  document.body.addEventListener('mouseleave', () => {
    if (!hasTouch.value) {
      if (!clicked.value) {
        viewClass.value = 'AppCursor--hidden';
      }
    }
  });
  document.body.addEventListener('mousedown', () => {
    if (!hasTouch.value) {
      down.value = true;
    }
  });
  document.body.addEventListener('mouseup', () => {
    if (!hasTouch.value) {
      down.value = false;
    }
  });
  document.body.addEventListener('click', () => {
    if (!hasTouch.value) {
      clicked.value = true;
      setTimeout(() => (clicked.value = false), 1000);
    }
  });
  document
    .querySelector(`#${props.contentId}`)
    ?.addEventListener('DOMSubtreeModified', () => {
      if (!hasTouch.value) checkClickable(mouse.x, mouse.y);
      setupEvents();
    });
});

function setupEvents(): void {
  eventSettings.forEach(config => {
    document.querySelectorAll<HTMLElement>(config.selector).forEach(element => {
      element.removeEventListener('click', config.onClick);
      element.addEventListener('click', config.onClick);
    });
  });
}

function checkClickable(x: number, y: number): void {
  const element = document.elementFromPoint(x, y);
  // Check if element has a class defined in settings
  clickableSettings.forEach(config => {
    if (element?.closest(config.selector)) {
      config.cursorClasses.forEach(cursorClass => {
        if (!cursorClasses.value.includes(cursorClass)) {
          cursorClasses.value.push(cursorClass);
        }
      });
    } else {
      cursorClasses.value = cursorClasses.value.filter(
        cursorClass => !config.cursorClasses.includes(cursorClass)
      );
    }
  });
  // Check if element has "sticky" class
  const _stickyElement = element?.closest(stickySelector);
  if (_stickyElement) {
    stickyElement.value = _stickyElement;
  } else {
    if (stickyElement.value) {
      transition.value = true;
      unsetTransitionOnce.value = true;
    }
    stickyElement.value = null;
  }
}

function setCursorPosition(x: number, y: number): void {
  if (!elementRef.value) return;
  if (stickyElement.value) {
    const rect = stickyElement.value.getBoundingClientRect();
    const X = rect.x + rect.width / 2;
    const Y = rect.y + rect.height / 2;
    const k = stickiness;
    elementRef.value.style.setProperty(
      'transform',
      `matrix(1, 0, 0, 1, ${k * (x - X) + X}, ${k * (y - Y) + Y})`
    );
  } else {
    elementRef.value.style.setProperty(
      'transform',
      `matrix(1, 0, 0, 1, ${x}, ${y})`
    );
    if (transition.value && unsetTransitionOnce.value) {
      unsetTransitionOnce.value = false;
      setTimeout(() => {
        transition.value = false;
      }, transitionStickyDuration);
    }
  }
}
</script>
