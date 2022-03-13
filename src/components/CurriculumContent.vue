<template lang="pug">
main.curriculum(
  :class="(show ? 'show' : 'hide') + (trueHide ? ' true-hide' : '')"
)
  .mask
  #iscroll.wrapper
    ul.content
      li.item
        .date
          .year March 2022 – now
        .thing
          .occupation Lead web developer
          .location
            a(href="https://fifteen.eu" target="_blank") Fifteen
              inline-svg(:src="svgNewWindow")
            | , Vanves, France
      li.item
        .date
          .year June 2018 – March 2022
        .thing
          .occupation Fullstack web developer
          .location
            a(href="https://zoov.eu" target="_blank") Zoov by Fifteen
              inline-svg(:src="svgNewWindow")
            | , Vanves, France
      li.item
        .date
          .year 2014 – June 2018
        .thing
          .occupation Freelance fullstack web developer
          .location Paris, France
      li.item
        .date
          .year 2011 – 2018
        .thing
          .occupation Music producer
          .location
            a(href="https://bredrinrecords.com" target="_blank") Bredrin Records
              inline-svg(:src="svgNewWindow")
            | , Paris, France
      li.item
        .date
          .year 2013 – 2016
        .thing
          .occupation PhD in Theoretical Quantum Physics
          .location
            a(href="http://www.ens.fr" target="_blank") École Normale Supérieure
              inline-svg(:src="svgNewWindow")
            | ,&nbsp;
            a(href="https://www.sorbonne-universite.fr" target="_blank") UPMC
              inline-svg(:src="svgNewWindow")
            | , Paris, France
      li.item
        .date
          .year 2011 – 2012
        .thing
          .occupation Master Degree in Theoretical, Physical & Analytical Chemistry
          .location
            a(href="http://www.ens.fr" target="_blank") École Normale Supérieure
              inline-svg(:src="svgNewWindow")
            | ,&nbsp;
            a(href="https://www.sorbonne-universite.fr" target="_blank") UPMC
              inline-svg(:src="svgNewWindow")
            | , Paris, France
      li.item
        .date
          .skill-tag skills
        ul.thing
          li.category(v-for="category in skillsArray")
            .type {{ category.type }}
            ul.skills
              li(v-for="skill in category.content") {{ skill.replace("/ ", "&nbsp;") }}
      li.item
        .date
          .year clients
        .thing.logos
          a.logo(href="http://maison-solide.fr" target="_blank")
            inline-svg(:src="svgSolide")
          a.logo.datagif(href="http://www.datagif.fr" target="_blank")
            inline-svg(:src="svgDatagif")
          a.logo(href="https://www.policestudio.fr" target="_blank")
            inline-svg(:src="svgPolice")
          a.logo(href="https://www.habx.fr" target="_blank")
            inline-svg(:src="svgHabx")
          a.logo(href="http://4nparis.com" target="_blank")
            inline-svg(:src="svg4N")
          a.logo(href="http://zoov.eu" target="_blank")
            inline-svg(:src="svgZoov")
          a.logo(href="http://fifteen.eu" target="_blank")
            inline-svg(:src="svgFifteen")
</template>

<style lang="stylus">
$curriculum-color = #111

main.curriculum
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  background-color $curriculum-color
  pointer-events all
  display block
  opacity 0
  transition opacity 0.5s linear

  a:not(.logo)
    font-weight 400 // 700

    .inline-svg
      display inline
      margin-left 0.22em

      svg
        width 0.28em
        height 1em

        path
          fill $theme-color-white

  .mask
    position absolute
    top 0
    left 0
    right 0
    height 2.5 * $theme-margin-top
    background linear-gradient(to bottom, alpha($curriculum-color, 1) 50%, alpha($curriculum-color, 0))
    z-index 1

  .wrapper
    mix-blend-mode hard-light
    position absolute
    top: $content-margin-top + $theme-margin-top
    bottom: ($theme-margin-top / 2)
    z-index 0
    width 100%
    box-sizing border-box
    max-width: ($content-max-width - 2 * $theme-margin-left-right)
    left calc(50%)
    transform translateX(-50%)

  .content
    padding-bottom: ($theme-margin-top / 2)
    line-height 1.2
    font-family 'Raleway', sans-serif
    color $theme-color-white

    .item
      display flex
      align-items baseline
      margin 0 0 90px $theme-margin-left-right

      &:last-child
        margin 0 0 0 $theme-margin-left-right

      .date
        text-align right
        box-sizing border-box
        padding-right 50px
        width 240px
        font-weight 400

        div
          display inline

          &:nth-child(n+2):before
            content ' '

        .since
          font-size 1em

        .year
          font-size $golden-num em

        .skill-tag
          font-size $golden-num em
          vertical-align top

      .thing
        max-width 650px

        &.logos
          display flex
          flex-wrap wrap
          align-items center

        .occupation,
        .type
          line-height 1.25em
          // font-weight 600
          font-weight 700
          font-size ($golden-num ** 2) em

        .location
          font-family $the-serif, serif
          line-height 2.5em
          font-weight 400
          font-size 1em

        .skills
          font-family $the-serif, serif
          line-height 2.5em
          font-weight 400
          font-size 1em

        .type
          line-height 0

        .category,
        .type,
        .skills
          vertical-align middle
          display inline

          li
            display inline

            &::after
              content '\00a0 '

            &:first-child::before
              content ' '

        .logo
          display inline-block
          margin-right $golden-num em
          margin-top $golden-num em

          &.datagif
            margin-bottom -8px

          .inline-svg
            svg
              height $golden-num em

            path
              fill white

  &.show
    opacity 1

  &.hide
    opacity 0
    pointer-events none

  &.true-hide
    display none

.iScrollVerticalScrollbar
  position absolute
  z-index 2
  width 6px
  bottom 5px
  top 2px
  left: ($theme-margin-left-right / 2 - 3px)
  mix-blend-mode hard-light

.iScrollIndicator
  box-sizing border-box
  position absolute
  background-color $theme-color-pink
  border-radius 3px
  width 100%

@media only screen and (max-width 1120px)
  main.curriculum
    .content
      .item
        margin 0 $theme-margin-left-right 60px $theme-margin-left-right

        &:last-child
          margin 0 0 0 $theme-margin-left-right

@media only screen and (max-width 1050px)
  main.curriculum
    .content
      .item
        .date
          padding-right 30px
          width 150px

          .since
            font-size: (1 / $golden-num)em

          .year
            font-size 1em

          .skill-tag
            font-size 1em

        .thing
          max-width 410px

          .occupation,
          .type
            font-size $golden-num em

          .location
            line-height: (2.5 / $golden-num)em
            font-size: (1 / $golden-num)em

          .skills
            line-height: (2.5 / $golden-num)em
            font-size: (1 / $golden-num)em

          .logo
            display inline-block
            margin-right 1em
            margin-top 1em

            .inline-svg
              svg
                height 1em

@media only screen and (max-width 780px)
  main.curriculum
    .content
      .item
        display block

        .date
          width auto
          text-align left

@media only screen and (max-width 400px)
  main.curriculum
    .mask
      height 2.5 * $theme-margin-top-mobile

    .wrapper
      top: $content-margin-top-mobile + $theme-margin-top-mobile
      // left $theme-margin-left-right-mobile
      // right $theme-margin-left-right-mobile

    .content
      padding-bottom $content-margin-top-mobile

      .item
        margin 0 $theme-margin-left-right-mobile
        padding-bottom 35px

        &:last-child
          margin 0 $theme-margin-left-right-mobile
          padding-bottom 0

        .thing
          .occupation,
          break-word nowrap
            line-height 1.1em
            font-size: (0.95 * $golden-num)em

          .location
            margin-top 4px

          .category.type
            line-height: (0.9 / $golden-num)em
            font-size: (0.95 * $golden-num)em

          .skills
            line-height: (0.9 / $golden-num)em

          .logo
            margin-top 0.5em

    .iScrollVerticalScrollbar
      left: ($theme-margin-left-right-mobile / 2 - 3px)

@media only screen and (max-width 340px) and (max-height 580px)
  main.curriculum
    .mask
      height 2.5 * ($theme-margin-top-mobile - 10px)

    .wrapper
      top ($content-margin-top-mobile - 10px) + ($theme-margin-top-mobile - 10px)
      // left ($theme-margin-left-right-mobile - 10px)
      // right ($theme-margin-left-right-mobile - 10px)

    .content
      padding-bottom: ($content-margin-top-mobile - 10px)

      .item
        margin 0 ($theme-margin-left-right-mobile - 10px)

        &:last-child
          margin 0 ($theme-margin-left-right-mobile - 10px)
          padding-bottom 0

    .iScrollVerticalScrollbar
      left ($theme-margin-left-right-mobile - 10px) / 2 - 3px
</style>

<script>
import InlineSvg from '@/components/utils/InlineSvg.vue';

import svgNewWindow from '@/assets/images/new-window-mobile.svg';
import svgSolide from '@/assets/images/logos/solide.svg';
import svgDatagif from '@/assets/images/logos/datagif.svg';
import svgPolice from '@/assets/images/logos/police.svg';
import svgHabx from '@/assets/images/logos/habx.svg';
import svg4N from '@/assets/images/logos/4N.svg';
import svgZoov from '@/assets/images/logos/zoov.svg';
import svgFifteen from '@/assets/images/logos/fifteen.svg';

export default {
  name: 'curriculum-content',

  components: {
    InlineSvg,
  },

  props: {
    show: Boolean,
    trueHide: Boolean,
    skillsArray: Array,
  },

  mounted() {},

  data() {
    return {
      myScroll: null,
      svgNewWindow,
      svgSolide,
      svgDatagif,
      svgPolice,
      svgHabx,
      svg4N,
      svgZoov,
      svgFifteen,
    };
  },

  methods: {
    setScroll: function () {
      const self = this;

      import('iscroll/build/iscroll-probe.js')
        .then(function (IScroll) {
          self.myScroll = new IScroll.default('#iscroll', {
            probeType: 2,
            scrollX: false,
            scrollY: true,
            click: true,
            tap: true,
            mouseWheel: true,
            bounce: true,
            scrollbars: 'custom',
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            interactiveScrollbars: false,
            disablePointer: true, // important to disable the pointer events that causes the issues
            disableTouch: false, // false if you want the slider to be usable with touch devices
            disableMouse: false, // false if you want the slider to be usable with a mouse (desktop)
          });

          self.myScroll.on('scroll', function () {
            if (this.y >= 0) self.$emit('reached-top');
            else self.$emit('scroll');
          });
        })
        .catch(function (err) {
          throw err;
        });
    },

    unsetScroll: function () {
      this.myScroll.destroy();
      this.myScroll = null;
    },
  },

  watch: {
    show: function (newVal, oldVal) {
      if (newVal) {
        this.setScroll();
        setTimeout(() => {
          this.$emit('on');
        }, 600);
      } else {
        this.unsetScroll();
        setTimeout(() => {
          this.$emit('off');
        }, 400);
      }
    },
  },
};
</script>
