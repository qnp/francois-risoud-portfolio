<template lang="pug">
main.CurriculumContent(:class="classes")
  .CurriculumContent__mask
  #iscroll.CurriculumContent__wrapper
    ul.CurriculumContent__content
      li.CurriculumContent__content__item
        .CurriculumContent__content__item__date
          .CurriculumContent__content__item__date__year Dec 2024 – now
        .CurriculumContent__content__item__thing
          .CurriculumContent__content__item__thing__occupation Head of Front-end Development
          .CurriculumContent__content__item__thing__location
            a.CurriculumContent__content__item__thing__location__link(
              href="https://fifteen.eu"
              target="_blank"
            ) Fifteen
              InlineSvg(:src="svgNewWindow")
            | , Vanves, France
      li.CurriculumContent__content__item
        .CurriculumContent__content__item__date
          .CurriculumContent__content__item__date__year March 2022 – Dec 2024
        .CurriculumContent__content__item__thing
          .CurriculumContent__content__item__thing__occupation Lead fullstack developer & <br/> Head of web
          .CurriculumContent__content__item__thing__location
            a.CurriculumContent__content__item__thing__location__link(
              href="https://fifteen.eu"
              target="_blank"
            ) Fifteen
              InlineSvg(:src="svgNewWindow")
            | , Vanves, France
      li.CurriculumContent__content__item
        .CurriculumContent__content__item__date
          .CurriculumContent__content__item__date__year June 2018 – March 2022
        .CurriculumContent__content__item__thing
          .CurriculumContent__content__item__thing__occupation Fullstack web developer
          .CurriculumContent__content__item__thing__location
            a.CurriculumContent__content__item__thing__location__link(
              href="https://zoov.eu"
              target="_blank"
            ) Zoov by Fifteen
              InlineSvg(:src="svgNewWindow")
            | , Vanves, France
      li.CurriculumContent__content__item
        .CurriculumContent__content__item__date
          .CurriculumContent__content__item__date__year 2014 – June 2018
        .CurriculumContent__content__item__thing
          .CurriculumContent__content__item__thing__occupation Freelance fullstack web developer
          .CurriculumContent__content__item__thing__location Paris, France
      li.CurriculumContent__content__item
        .CurriculumContent__content__item__date
          .CurriculumContent__content__item__date__year 2011 – 2018
        .CurriculumContent__content__item__thing
          .CurriculumContent__content__item__thing__occupation Music producer
          .CurriculumContent__content__item__thing__location
            a.CurriculumContent__content__item__thing__location__link(
              href="https://soundcloud.com/bredrin-records"
              target="_blank"
            ) Bredrin Records
              InlineSvg(:src="svgNewWindow")
            | , Paris, France
      li.CurriculumContent__content__item
        .CurriculumContent__content__item__date
          .CurriculumContent__content__item__date__year 2013 – 2016
        .CurriculumContent__content__item__thing
          .CurriculumContent__content__item__thing__occupation PhD in Theoretical Quantum Physics
          .CurriculumContent__content__item__thing__location
            a.CurriculumContent__content__item__thing__location__link(
              href="https://www.ens.psl.eu"
              target="_blank"
            ) École Normale Supérieure
              InlineSvg(:src="svgNewWindow")
            | ,&nbsp;
            a.CurriculumContent__content__item__thing__location__link(
              href="https://www.sorbonne-universite.fr"
              target="_blank"
            ) UPMC
              InlineSvg(:src="svgNewWindow")
            | , Paris, France
      li.CurriculumContent__content__item
        .CurriculumContent__content__item__date
          .CurriculumContent__content__item__date__year 2011 – 2012
        .CurriculumContent__content__item__thing
          .CurriculumContent__content__item__thing__occupation Master Degree in Theoretical, Physical & Analytical Chemistry
          .CurriculumContent__content__item__thing__location
            a.CurriculumContent__content__item__thing__location__link(
              href="https://www.ens.psl.eu"
              target="_blank"
            ) École Normale Supérieure
              InlineSvg(:src="svgNewWindow")
            | ,&nbsp;
            a.CurriculumContent__content__item__thing__location__link(
              href="https://www.sorbonne-universite.fr"
              target="_blank"
            ) UPMC
              InlineSvg(:src="svgNewWindow")
            | , Paris, France
      li.CurriculumContent__content__item
        .CurriculumContent__content__item__date
          .CurriculumContent__content__item__date__skill-tag skills
        .CurriculumContent__content__item__thing
          span.CurriculumContent__content__item__thing__category(
            v-for="(category, i) in skillsArray"
            :key="i"
          )
            span.CurriculumContent__content__item__thing__category__type {{ category.type }}
            span.CurriculumContent__content__item__thing__category__skills
              span(
                v-for="(skill, j) in category.content"
                :key="`${i}-${j}`"
              ) {{ skill + ", " }}
      li.CurriculumContent__content__item
        .CurriculumContent__content__item__date
          .CurriculumContent__content__item__date__year clients
        .CurriculumContent__content__item__thing.CurriculumContent__content__item__thing--logos
          a.CurriculumContent__content__item__thing__logo(
            href="http://maison-solide.fr"
            target="_blank"
          )
            InlineSvg(:src="svgSolide")
          a.CurriculumContent__content__item__thing__logo--datagif(
            href="http://www.datagif.fr"
            target="_blank"
          )
            InlineSvg(:src="svgDatagif")
          a.CurriculumContent__content__item__thing__logo(
            href="https://www.policestudio.fr"
            target="_blank"
          )
            InlineSvg(:src="svgPolice")
          a.CurriculumContent__content__item__thing__logo(
            href="https://www.linkedin.com/company/habx"
            target="_blank"
          )
            InlineSvg(:src="svgHabx")
          a.CurriculumContent__content__item__thing__logo(
            href="http://4nparis.com"
            target="_blank"
          )
            InlineSvg(:src="svg4N")
          a.CurriculumContent__content__item__thing__logo(
            href="http://zoov.eu"
            target="_blank"
          )
            InlineSvg(:src="svgZoov")
          a.CurriculumContent__content__item__thing__logo(
            href="http://fifteen.eu"
            target="_blank"
          )
            InlineSvg(:src="svgFifteen")
</template>

<style lang="stylus">
$curriculum-color = #111

.CurriculumContent
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

  &__mask
    position absolute
    top 0
    left 0
    right 0
    height 2.5 * $theme-margin-top
    background linear-gradient(to bottom, alpha($curriculum-color, 1) 50%, alpha($curriculum-color, 0))
    z-index 1

  &__wrapper
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

  &__content
    padding-bottom: ($theme-margin-top / 2)
    line-height 1.2
    font-family 'Raleway', sans-serif
    color $theme-color-white

    &__item
      display flex
      align-items baseline
      margin 0 0 90px $theme-margin-left-right

      &:last-child
        margin 0 0 0 $theme-margin-left-right

      &__date
        text-align right
        box-sizing border-box
        padding-right 50px
        width 240px
        font-weight 400

        div
          display inline

          &:nth-child(n+2):before
            content ' '

        &__since
          font-size 1em

        &__year
          font-size $golden-num em

        &__skill-tag
          font-size $golden-num em
          vertical-align top

      &__thing
        max-width 650px

        &--logos
          display flex
          flex-wrap wrap
          align-items center

        &__occupation,
        &__type
          line-height 1.25em
          font-weight 700
          font-size ($golden-num ** 2) em

        &__location
          font-family $the-serif, serif
          line-height 2.5em
          font-weight 400
          font-size 1em

        &__skills
          font-family $the-serif, serif
          line-height 2.5em
          font-weight 400
          font-size 1em

        &__type
          line-height 0

        &__category
          vertical-align middle

        &__type,
        &__skills
          vertical-align middle

          > span
            &:first-child::before
              content ' '

        &__logo
          display inline-block
          margin-right $golden-num em
          margin-top $golden-num em

          &--datagif
            margin-bottom -8px

          .inline-svg
            svg
              height $golden-num em

            path,
            polygon
              fill white

  &--show
    opacity 1

  &--hide
    opacity 0
    pointer-events none

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
  .CurriculumContent
    &__content
      &__item
        margin 0 $theme-margin-left-right 60px $theme-margin-left-right

        &:last-child
          margin 0 0 0 $theme-margin-left-right

@media only screen and (max-width 1050px)
  .CurriculumContent
    &__content
      &__item
        &__date
          padding-right 30px
          width 150px

          &__since
            font-size: (1 / $golden-num)em

          &__year
            font-size 1em

          &__skill-tag
            font-size 1em

        &__thing
          max-width 410px

          &__occupation,
          &__type
            font-size $golden-num em

          &__location
            line-height: (2.5 / $golden-num)em
            font-size: (1 / $golden-num)em

          &__skills
            line-height: (2.5 / $golden-num)em
            font-size: (1 / $golden-num)em

          &__logo
            display inline-block
            margin-right 1em
            margin-top 1em

            .inline-svg
              svg
                height 1em

@media only screen and (max-width 780px)
  .CurriculumContent
    &__content
      &__item
        display block

        &__date
          width auto
          text-align left

@media only screen and (max-width 400px)
  .CurriculumContent
    &__mask
      height 2.5 * $theme-margin-top-mobile

    &__wrapper
      top: $content-margin-top-mobile + $theme-margin-top-mobile

    &__content
      padding-bottom $content-margin-top-mobile

      &__item
        margin 0 $theme-margin-left-right-mobile
        padding-bottom 35px

        &:last-child
          margin 0 $theme-margin-left-right-mobile
          padding-bottom 0

        &__thing
          &__occupation,
          break-word nowrap
            line-height 1.1em
            font-size: (0.95 * $golden-num)em

          &__location
            margin-top 4px

          &__category__type
            line-height: (0.9 / $golden-num)em
            font-size: (0.95 * $golden-num)em

          &__skills
            line-height: (0.9 / $golden-num)em

          &__logo
            margin-top 0.5em

    .iScrollVerticalScrollbar
      left: ($theme-margin-left-right-mobile / 2 - 3px)

@media only screen and (max-width 340px) and (max-height 580px)
  .CurriculumContent
    &__mask
      height 2.5 * ($theme-margin-top-mobile - 10px)

    &__wrapper
      top ($content-margin-top-mobile - 10px) + ($theme-margin-top-mobile - 10px)

    &__content
      padding-bottom: ($content-margin-top-mobile - 10px)

      &__item
        margin 0 ($theme-margin-left-right-mobile - 10px)

        &:last-child
          margin 0 ($theme-margin-left-right-mobile - 10px)
          padding-bottom 0

    .iScrollVerticalScrollbar
      left ($theme-margin-left-right-mobile - 10px) / 2 - 3px
</style>

<script setup lang="ts">
import InlineSvg from '@/components/utils/InlineSvg.vue';
import svgNewWindow from '@/assets/images/new-window-inline.svg';
import svgSolide from '@/assets/images/logos/solide.svg';
import svgDatagif from '@/assets/images/logos/datagif.svg';
import svgPolice from '@/assets/images/logos/police.svg';
import svgHabx from '@/assets/images/logos/habx.svg';
import svg4N from '@/assets/images/logos/4N.svg';
import svgZoov from '@/assets/images/logos/zoov.svg';
import svgFifteen from '@/assets/images/logos/fifteen.svg';

export interface CurriculumContentProps {
  /**
   * Whether to show the content
   */
  show: boolean;
  /**
   * The skills array
   */
  skillsArray: SkillsGroup[];
}

const props = withDefaults(defineProps<CurriculumContentProps>(), {
  show: false,
  skillsArray: () => [],
});

const emit = defineEmits<{
  (event: 'reached-top'): void;
  (event: 'scroll'): void;
  (event: 'on'): void;
  (event: 'off'): void;
}>();

const classes = computed(() => ({
  'CurriculumContent--show': props.show,
  'CurriculumContent--hide': !props.show,
}));

let myScroll: IScroll | null = null;

function setScroll(): void {
  import('iscroll/build/iscroll-probe.js')
    .then(iScroll => {
      myScroll = new iScroll.default('#iscroll', {
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

      myScroll.on('scroll', function (this: IScroll) {
        if (this.y >= 0) emit('reached-top');
        else emit('scroll');
      });
    })
    .catch(function (err) {
      throw err;
    });
}

function unsetScroll(): void {
  myScroll?.destroy();
  myScroll = null;
}

watch(
  () => props.show,
  newVal => {
    if (newVal) {
      setScroll();
      setTimeout(() => emit('on'), 600);
    } else {
      unsetScroll();
      setTimeout(() => emit('off'), 400);
    }
  }
);
</script>
