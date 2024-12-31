<template lang="pug">
main.AboutContent(:class="classes")
  .AboutContent__summary
    h1.AboutContent__summary__title
      | Hi, my name is&nbsp;
      a.AboutContent__summary__title__link(href="mailto:me") François
      | .
      br
      | I’m a full-stack developer living in Paris, currently working at&nbsp;
      a.AboutContent__summary__title__link--fifteen(
        href="https://fifteen.eu"
        target="_blank"
      ) Fifteen.
    h2.AboutContent__summary__subtitle
      | I like doing nice and sharp things with digital and web technologies. From a quantum physics background, I’m also passionate about science, pedagogy, music and digital art.
    h3.AboutContent__summary__tagline
      RouterLink.AboutContent__summary__tagline__scrollInvite(to="/projects") Get to know me.
</template>

<style lang="stylus">
.AboutContent
  transition margin 0.3s ease
  margin ($content-margin-top + 1.6 * $theme-margin-top) $theme-margin-left-right 0
  display block

  &__summary
    &__title
      max-width 440px

    &__subtitle,
    &__tagline
      max-width 400px
      padding-top 1.3em

  &__summary__title
    font-size $golden-num em
    line-height 1.3
    font-family 'Raleway', sans-serif
    font-weight 700
    color $theme-color-white

  &__summary__subtitle
    font-family $the-serif, serif
    font-weight 400
    color $theme-color-white

  &__summary__tagline
    font-family $the-serif, serif
    font-weight 300
    color alpha($theme-color-white, 0.9)

  &__summary__subtitle,
  &__summary__tagline
    padding 0
    font-size 1em
    line-height 1.4
    margin-left 0
    transition padding-top 0.3s ease, margin-left 0.3s ease

  &__summary__title,
  &__summary__subtitle,
  &__summary__tagline
    transform translateY(20px)
    opacity 0

  &--show
    pointer-events all

    &__summary__title,
    &__summary__subtitle,
    &__summary__tagline
      animation show-content-translate 0.7s cubic-bezier(0, 0.58, 0, 1) forwards, show-content-opacity 0.7s ease-out forwards

    &__summary__title
      animation-delay 0.85s

    &__summary__subtitle
      animation-delay 1s

    &__summary__tagline
      animation-delay 1.15s

  &--hide
    pointer-events none

    &__summary__title,
    &__summary__subtitle,
    &__summary__tagline
      transform translateY(0)
      animation hide-content-opacity 0.3s ease-out forwards
      animation-delay 0s

  &--hidden
    display none

$media-content-max-width = 'only screen and (min-width: ' + $content-max-width + ')'

@media $media-content-max-width
  .AboutContent
    &__summary
      &__subtitle
        padding-top 2.5em
        margin-left 308px

      &__tagline
        padding-top 2.5em
        margin-left 616px

@media only screen and (min-width 1801px)
  .AboutContent
    margin 2 * $content-margin-top + $theme-margin-top $theme-margin-left-right 0

@media only screen and (min-height 601px) and (max-height 640px)
  .AboutContent
    margin: $content-margin-top + $theme-margin-top $theme-margin-left-right 0

@media only screen and (max-height 600px)
  .AboutContent
    margin: $content-margin-top + $theme-margin-top $theme-margin-left-right 0

    &__summary__title
      font-size 1.2em

    &__summary__subtitle,
    &__summary__tagline
      font-size: (1.2 / $golden-num)em

@media only screen and (max-width 600px)
  .AboutContent
    &__summary__title
      font-size 1.2em

    &__summary__subtitle,
    &__summary__tagline
      font-size: (1.2 / $golden-num)em

@media only screen and (max-width 400px)
  .AboutContent
    margin ($content-margin-top-mobile + $theme-margin-top-mobile - 15px) $theme-margin-left-right-mobile 0

@media only screen and (min-width 401px) and (max-width 450px) and (max-height 580px)
  .AboutContent
    margin ($content-margin-top-mobile + $theme-margin-top-mobile - 15px) $theme-margin-left-right 0

@media only screen and (max-width 340px) and (max-height 540px)
  .AboutContent
    margin ($content-margin-top-mobile + $theme-margin-top-mobile - 25px) ($theme-margin-left-right-mobile - 10px) 0

@media only screen and (max-width 380px) and (max-height 570px)
  .AboutContent
    &__summary__title
      font-size 1em

    &__summary__subtitle,
    &__summary__tagline
      font-size: (1 / $golden-num)em

@keyframes show-content-translate
  0%
    transform translateY(20px)

  100%
    transform translateY(0)

@keyframes show-content-opacity
  0%
    opacity 0

  100%
    opacity 1

@keyframes hide-content-opacity
  0%
    opacity 1

  100%
    opacity 0
</style>

<script setup lang="ts">
export interface AboutContentProps {
  /**
   * Controls the visibility of the component.
   */
  show: boolean;
  /**
   * Completely hides the component, regardless of the model value.
   */
  hidden: boolean;
}

const props = defineProps<AboutContentProps>();

const classes = computed(() => ({
  'AboutContent--show': props.show,
  'AboutContent--hide': !props.show,
  'AboutContent--hidden': props.hidden,
}));
</script>
