<template lang="pug">
main.about-content(:class="classes")
  .summary
    h1
      | Hi, my name is&nbsp;
      a(href="mailto:me") François
      | .
      br
      | I’m a full-stack developer living in Paris, currently working at&nbsp;
      a.fifteen(
        href="https://fifteen.eu"
        target="_blank"
      ) Fifteen.
    h2
      | I like doing nice and sharp things with digital and web technologies. From a quantum physics background, I’m also passionate about science, pedagogy, music and digital art.
    h3
      RouterLink.scroll-invite(to="/projects") Get to know me.
</template>

<style lang="stylus">
main.about-content
  transition margin 0.3s ease
  margin ($content-margin-top + 1.6 * $theme-margin-top) $theme-margin-left-right 0
  display block

  .summary
    h1
      max-width 440px

    h2,
    h3
      max-width 400px
      padding-top 1.3em

  h1
    font-size $golden-num em
    line-height 1.3
    font-family 'Raleway', sans-serif
    font-weight 700
    // 600
    color $theme-color-white

  h2
    font-family $the-serif, serif
    font-weight 400
    color $theme-color-white

  h3
    font-family $the-serif, serif
    font-weight 300
    color alpha($theme-color-white, 0.9)

  h2,
  h3
    padding 0
    font-size 1em
    line-height 1.4
    margin-left 0
    transition padding-top 0.3s ease, margin-left 0.3s ease

  h1,
  h2,
  h3
    transform translateY(20px)
    opacity 0

  &.show
    pointer-events all

    h1,
    h2,
    h3
      animation show-content-translate 0.7s cubic-bezier(0, 0.58, 0, 1) forwards, show-content-opacity 0.7s ease-out forwards

    h1
      animation-delay 0.85s

    h2
      animation-delay 1s

    h3
      animation-delay 1.15s

  &.hide
    pointer-events none

    h1,
    h2,
    h3
      transform translateY(0)
      animation hide-content-opacity 0.3s ease-out forwards
      animation-delay 0s

  &.hidden
    display none

$media-content-max-width = 'only screen and (min-width: ' + $content-max-width + ')'

@media $media-content-max-width
  main.about-content
    .summary
      h2
        padding-top 2.5em
        margin-left 308px

      h3
        padding-top 2.5em
        margin-left 616px

@media only screen and (min-width 1801px)
  main.about-content
    margin 2 * $content-margin-top + $theme-margin-top $theme-margin-left-right 0

@media only screen and (min-height 601px) and (max-height 640px)
  main.about-content
    margin: $content-margin-top + $theme-margin-top $theme-margin-left-right 0

@media only screen and (max-height 600px)
  main.about-content
    margin: $content-margin-top + $theme-margin-top $theme-margin-left-right 0

    h1
      font-size 1.2em

    h2,
    h3
      font-size: (1.2 / $golden-num)em

@media only screen and (max-width 600px)
  main.about-content
    h1
      font-size 1.2em

    h2,
    h3
      font-size: (1.2 / $golden-num)em

@media only screen and (max-width 400px)
  main.about-content
    margin ($content-margin-top-mobile + $theme-margin-top-mobile - 15px) $theme-margin-left-right-mobile 0

@media only screen and (min-width 401px) and (max-width 450px) and (max-height 580px)
  main.about-content
    margin ($content-margin-top-mobile + $theme-margin-top-mobile - 15px) $theme-margin-left-right 0

@media only screen and (max-width 340px) and (max-height 540px)
  main.about-content
    margin ($content-margin-top-mobile + $theme-margin-top-mobile - 25px) ($theme-margin-left-right-mobile - 10px) 0

@media only screen and (max-width 380px) and (max-height 570px)
  main.about-content
    h1
      font-size 1em

    h2,
    h3
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
  show: props.show,
  hide: !props.show,
  hidden: props.hidden,
}));
</script>
