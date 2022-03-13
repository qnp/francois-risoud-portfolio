<template lang="pug">
.intro-text.hide
  h1
    span.name {{ notFound ? "404" : "François Risoud" }}
    span.type &nbsp;{{ notFound ? "Not Found" : "Portfolio" }}
    br(v-if="notFound")
    span.emoji.reverse(v-if="notFound") づ
    span.emoji(v-if="notFound") (｡◉‿◉｡)づ
</template>

<style lang="stylus">
.intro-text
  position absolute
  height 20px
  margin-top $theme-margin-top
  width 100%
  top 0
  left 0
  display flex
  align-items center
  justify-content center
  h1
    font-family 'Raleway', sans-serif
    font-size 1em
    color $theme-color-black
    margin-left -0.04em
    letter-spacing -0.02em
    transition opacity 0.5s
    text-align center
    line-height $golden-num
    .name
      font-weight 700
    .type
      font-family $the-serif, serif
      font-weight 400
    .emoji
      opacity 0
      font-weight 400
      transition opacity 0.5s linear
    .reverse
      display inline-block
      transform scaleX(-1)
  &.hide
    pointer-events none
    h1
      opacity 0
  &.show
    pointer-events auto
    h1
      opacity 1
      .emoji
        opacity 1
        transition opacity 1s linear
        transition-delay 2s
</style>

<script>
export default {
  name: 'intro-text',

  props: {
    doShow: String,
    doHide: String,
    notFound: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    show: function () {
      const $el = this.$el;

      $el.classList.remove('hide');
      $el.classList.add('show');
    },

    hide: function () {
      const $el = this.$el;

      $el.classList.add('hide');
      $el.classList.remove('show');
    },
  },

  watch: {
    doShow: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.show();
      }
    },
    doHide: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.hide();
      }
    },
  },
};
</script>
