<template lang="pug">
.nav-wrapper(:class="navWrapperClasses")
  .mobile-menu(:class="value ? 'show' : 'hide'")
    svg.burger(
      viewBox="-1 -1 32 32"
      fill="none"
      stroke-width="2"
      @click="onClickBurger"
    )
      g
        line(
          x1="2.5"
          y1="5"
          x2="27.5"
          y2="5"
        )
      g
        line(
          x1="2.5"
          y1="15"
          x2="27.5"
          y2="15"
        )
      g
        line(
          x1="2.5"
          y1="25"
          x2="27.5"
          y2="25"
        )
      g
        line(
          x1="5"
          y1="5"
          x2="25"
          y2="25"
        )
      g
        line(
          x1="5"
          y1="25"
          x2="25"
          y2="5"
        )
  nav(:class="computedNavClasses")
    .menu-wrapper
      .menu
        router-link.home(
          to="/"
          @click="onClickLink"
        )
          inline-svg(:src="svgEk")
        router-link(
          to="/about"
          :class="aboutClass"
          @click="onClickLink"
        ) about
        router-link(
          to="/projects"
          :class="projectsClass"
          @click="onClickLink"
        ) projects
        router-link(
          to="/curriculum"
          :class="curriculumClass"
          @click="onClickLink"
        ) curriculum
      .social
        a.twitter(
          href="https://twitter.com/ekqnp"
          target="_blank"
        ) twitter
        a.github(
          href="https://github.com/qnp"
          target="_blank"
        ) github
        a.mailto(href="mailto:me") mail
</template>

<style lang="stylus">
.nav-wrapper
  position absolute
  top 0
  left 0
  right 0
  z-index 2

  nav
    width 100%
    margin-left auto
    margin-right auto
    pointer-events all
    height 20px
    box-sizing border-box
    padding $theme-margin-top $theme-margin-left-right
    font-size 1em
    font-family 'Raleway', sans-serif
    font-weight 400
    color $theme-color-white
    z-index 1

    .menu-wrapper
      display flex
      justify-content space-between
      width 100%

    .menu
      width 60%
      max-width 420px
      display flex
      align-items center
      justify-content space-between

      a
        opacity 0
        transform translateY(20px)
        transition font-weight 0.1s linear

        &.active
          font-weight 700

    .menu
      a.home
        width 32px
        padding-top 1px
        margin-left -4px
        margin-right -6px

        svg
          width 32px

          path
            fill $theme-color-white

    .social
      width 40%
      max-width 263px
      display flex
      align-items center
      justify-content space-between
      margin-left 6%

      a
        opacity 0
        transform translateY(20px)

    &.show
      .menu
        a
          animation show-menu-translate 0.5s cubic-bezier(0, 0.58, 0, 1) forwards, show-menu-opacity 1s ease-out forwards

        for num in 1 .. 5
          a:nth-child(5n+{num})
            animation-delay: ((num - 1) * 100)ms

      .social
        a
          animation show-menu-translate 0.5s cubic-bezier(0, 0.58, 0, 1) forwards, show-menu-opacity 1s ease-out forwards

        for num in 1 .. 3
          a:nth-child(3n+{num})
            animation-delay: (500 + ((num - 1) * 100))ms

    &.hide
      pointer-events none

      .menu,
      .social
        a
          opacity 1
          transform translateY(0)
          animation hide-menu-opacity 0.3s ease-out forwards

  /* responsive */
  .mobile-menu
    display none

@media only screen and (max-width 900px)
  .nav-wrapper
    nav
      .menu-wrapper
        display none

    .mobile-menu
      display block
      position absolute
      top $theme-margin-top
      left $theme-margin-left-right
      pointer-events all
      z-index 2
      mix-blend-mode hard-light

      svg.burger
        width 30px
        height 30px

        g
          line
            stroke $theme-color-white

          &:nth-child(1)
            line
              animation mobile-menu 10s linear infinite
              animation-delay 0.2s

          &:nth-child(2)
            line
              animation mobile-menu 10s linear infinite
              animation-delay 0.4s

          &:nth-child(3)
            line
              animation mobile-menu 10s linear infinite
              animation-delay 0.6s

          &:nth-child(4)
            line
              stroke-dasharray 40px 40px
              stroke-dashoffset -40px

          &:nth-child(5)
            line
              stroke-dasharray 40px 40px
              stroke-dashoffset -40px

      &.show
        opacity 1
        transition opacity 0.4s linear
        transition-delay 0.3s

      &.hide
        opacity 0
        transition opacity 0.1s linear
        transition-delay 0.1s

  .nav-wrapper.mobile-open
    bottom 0

    nav
      display block
      height auto
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      z-index 1
      color $theme-color-white
      background-color $theme-color-blue
      transform translateX(-130%) skew(5deg, 5deg) scale(1.2)

      &.appear
        transform translateX(0) skew(0, 0) scale(1)
        transition transform 0.3s ease-out

      &.disappear
        transform translateX(-130%) skew(-5deg, -5deg) scale(1.2)
        transition transform 0.3s ease-in

      .menu-wrapper
        display flex
        flex-direction column
        align-items center
        height 100%
        padding-top 30px
        box-sizing border-box

        .menu
          padding-top 10%
          height 45%

          a.home
            svg
              path
                fill $theme-color-white

        .social
          height 31%

        .menu,
        .social
          display flex
          flex-direction column
          align-items center
          margin 0
          width 100%

          a
            width 100%
            display block
            text-align center

          a.home
            svg
              margin-left auto
              margin-right auto

    .mobile-menu
      svg.burger
        g
          transform-origin center center

          line
            stroke $theme-color-pink
            transition stroke 0.3s linear

          &:nth-child(1)
            animation line1-open 0.4s ease-out forwards, line1-trans 0.2s 0.4s ease-in-out forwards

            line
              stroke-dasharray 30px 30px
              animation line1-cross 0.3s 0.5s ease-in forwards

          &:nth-child(2)
            animation line2-open 0.6s linear forwards

          &:nth-child(3)
            animation line3-open 0.4s ease-out forwards, line3-trans 0.2s 0.4s ease-in-out forwards

            line
              stroke-dasharray 30px 30px
              animation line3-cross 0.3s 0.5s ease-in forwards

          &:nth-child(4)
            line
              stroke-dasharray 40px 40px
              stroke-dashoffset -40px
              animation line5-cross 0.3s 0.8s ease-out forwards

          &:nth-child(5)
            line
              stroke-dasharray 40px 40px
              stroke-dashoffset -40px
              animation line5-cross 0.3s 1s ease-out forwards

  .nav-wrapper.mobile-close
    .mobile-menu
      svg.burger
        g
          transform-origin center center

          line
            stroke $theme-color-white
            transition stroke 0.3s linear

          &:nth-child(1)
            line
              stroke-dasharray 30px 30px
              stroke-dashoffset 30px
              animation line1-uncross 0.3s 0.5s ease-out forwards

          &:nth-child(2)
            transform scaleX(0)
            animation line2-close 0.6s 0.5s linear forwards

          &:nth-child(3)
            line
              stroke-dasharray 30px 30px
              stroke-dashoffset -30px
              animation line3-uncross 0.3s 0.5s ease-out forwards

          &:nth-child(4)
            line
              stroke-dasharray 40px 40px
              stroke-dashoffset 0
              animation line5-uncross 0.3s ease-in forwards

          &:nth-child(5)
            line
              stroke-dasharray 40px 40px
              stroke-dashoffset 0
              animation line5-uncross 0.3s 0.2s ease-in forwards

@media only screen and (max-width 400px)
  .nav-wrapper
    .mobile-menu
      top $theme-margin-top-mobile
      left $theme-margin-left-right-mobile

    nav
      padding $theme-margin-top-mobile $theme-margin-left-right-mobile

@media only screen and (max-width 340px) and (max-height 580px)
  .nav-wrapper
    .mobile-menu
      top: ($theme-margin-top-mobile - 10px)
      left: ($theme-margin-left-right-mobile - 10px)

    nav
      padding ($theme-margin-top-mobile - 10px) ($theme-margin-left-right-mobile - 10px)

/* anim keyframes */
@keyframes opacity-on
  0%
    opacity 0

  100%
    opacity 1

@keyframes line1-open
  0%
    transform translate(0, 0) scaleX(1)

  100%
    transform translate(0, -2.5px) scaleX(1.2)

@keyframes line2-open
  0%
    transform scaleX(1)

  100%
    transform scaleX(0)

@keyframes line3-open
  0%
    transform translate(0, 0) scaleX(1)

  100%
    transform translate(0, 2.5px) scaleX(1.2)

@keyframes line1-cross
  0%
    stroke-dashoffset 0

  100%
    stroke-dashoffset 30px

@keyframes line3-cross
  0%
    stroke-dashoffset 0

  100%
    stroke-dashoffset -30px

@keyframes line5-cross
  0%
    stroke-dashoffset -40px

  100%
    stroke-dashoffset 0

@keyframes line1-trans
  0%
    transform translate(0, -2.5px) scaleX(1.2)

  100%
    transform translate(0, 0) scaleX(1)

@keyframes line3-trans
  0%
    transform translate(0, 2.5px) scaleX(1.2)

  100%
    transform translate(0, 0) scaleX(1)

@keyframes line1-close
  0%
    transform translate(0, -2.5px) scaleX(1.2)

  100%
    transform translate(0, 0) scaleX(1)

@keyframes line5-uncross
  0%
    stroke-dashoffset 0

  100%
    stroke-dashoffset -40px

@keyframes line1-uncross
  0%
    stroke-dashoffset 30px

  100%
    stroke-dashoffset 0

@keyframes line3-uncross
  0%
    stroke-dashoffset -30px

  100%
    stroke-dashoffset 0

@keyframes line2-close
  0%
    transform scaleX(0)

  100%
    transform scaleX(1)

@keyframes line3-close
  0%
    transform translate(0, 2.5px) scaleX(1.2)

  100%
    transform translate(0, 0) scaleX(1)

@keyframes mobile-menu
  0%
    stroke-dasharray 0 100px
    stroke-dashoffset 0

  10%,
  90%
    stroke-dasharray 100px 100px
    stroke-dashoffset 0

  100%
    stroke-dasharray 100px 100px
    stroke-dashoffset -50px

@keyframes show-menu-translate
  0%
    transform translateY(40px)

  100%
    transform translateY(0)

@keyframes show-menu-opacity
  0%
    opacity 0

  100%
    opacity 1

@keyframes hide-menu-opacity
  0%
    opacity 1

  100%
    opacity 0
</style>

<script setup lang="ts">
import svgEk from '@/assets/images/ek.svg';

import InlineSvg from '@/components/utils/InlineSvg.vue';

export interface AppMenuProps {
  /**
   * Whether to show the menu
   */
  value?: boolean;
  /**
   * The route name to highlight
   */
  route?: string;
}

const props = withDefaults(defineProps<AppMenuProps>(), {
  value: false,
  route: 'About',
});

const pendingRoute = ref('');
const mobileOpen = ref(false);
const burgerOpen = ref(false);
const animating = ref(false);
const navClasses = ref<string[]>([]);
const navWrapperClasses = ref<string[]>([]);
const timer = ref<NodeJS.Timeout | null>(null);

const computedNavClasses = computed(() => {
  return [...navClasses.value, props.value ? 'show' : 'hide'];
});

const aboutClass = computed(() => ({ active: props.route === 'About' }));
const projectsClass = computed(() => ({ active: props.route === 'Projects' }));
const curriculumClass = computed(() => ({
  active: props.route === 'Curriculum',
}));

function open() {
  animating.value = true;
  navClasses.value = [];
  navWrapperClasses.value = ['mobile-open'];
  setTimeout(() => (navClasses.value = ['appear']), 50);
  setTimeout(() => (animating.value = false), 350);
}
function close() {
  animating.value = true;
  navClasses.value = ['disappear'];
  setTimeout(() => (navWrapperClasses.value = ['mobile-close']), 300);
  if (timer.value) clearTimeout(timer.value);
  timer.value = setTimeout(() => {
    navWrapperClasses.value = [];
    animating.value = false;
  }, 1000);
  setTimeout(() => {
    if (navWrapperClasses.value.includes('mobile-open')) {
      navWrapperClasses.value = navWrapperClasses.value.filter(
        c => c !== 'mobile-open'
      );
    }
  }, 350);
}
function onClickBurger() {
  if (!animating.value) {
    if (mobileOpen.value) close();
    else open();
    mobileOpen.value = !mobileOpen.value;
  }
}
function onClickLink() {
  if (mobileOpen.value) {
    close();
    mobileOpen.value = !mobileOpen.value;
  }
}
</script>
