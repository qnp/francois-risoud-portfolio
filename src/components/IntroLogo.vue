<template lang="pug">
inline-svg.intro-logo.hide(:src="svgEk")
</template>

<style lang="stylus">

  $beat-scale = 1.2
  $logo-w = 2.5em

  .intro-logo
    width $logo-w
    position absolute
    // top calc(50% + 260px)
    top 50%
    left 50%
    transform translate(-50%, -50%)
    transition opacity 1s
    svg
      width $logo-w
      animation beating 15s linear infinite
      animation-delay 10s
    &.hide
      pointer-events none
      opacity 0
    &.show
      pointer-events auto
      opacity 1
    path
      fill $theme-color-dark-blue
      // fill none
      // stroke $theme-color-white
      // stroke-width 3px
      // fill $theme-color-black
      // fill #e2efde
    &:hover
      path
        transition fill 0.5s linear
        fill $theme-color-dark-white

  @keyframes beating
    0%, 49%, 51%, 53%
      transform scale(1,1)
    50%, 52%
      transform scale($beat-scale,$beat-scale)

</style>

<script>
import svgEk from '@/assets/images/ek.svg';

import InlineSvg from '@/components/utils/InlineSvg.vue';

export default {

  name: 'intro-logo',

  components: { InlineSvg },

  props: {
    doShow: String,
    doHide: String,
  },

  data() {
    return {
      svgEk,
    };
  },

  methods: {

    show: function() {

      const $el = this.$el;

      $el.classList.remove('hide');
      $el.classList.add('show');
      $el.classList.add('clickable');

    },

    hide: function() {

      const $el = this.$el;

      $el.classList.add('hide');
      $el.classList.remove('show');
      $el.classList.remove('clickable');

    }

  },

  watch: {
    doShow: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.show();
      }
    },
    doHide: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.hide();
      }
    }
  }

};

</script>
