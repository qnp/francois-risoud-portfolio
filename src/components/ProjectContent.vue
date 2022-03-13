<template lang="pug">
main.project(
  :class="(show ? 'show' : '') + ' transition' + transition"
  :style="computedBlendModeStyle"
)
  .image-wrapper(:style="computedImageWrapperStyle")
    .image(:style="computedImageStyle")
  .infos(:style="computedInfosStyle")
    a(:href="theProject.url" target="_blank")
      h1 {{ theProject.title }} - {{ theProject.type }}
        inline-svg(:src="svgNewWindow")

    h2(v-for="infoLine in theProject.techInfos") {{ infoLine }}
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
      font-size ($golden-num)em
    h2
      font-weight 400
      font-size 1em
      font-family $the-serif, serif
    .inline-svg
      display none

  &.show
    opacity 1
    transition opacity 0.2s ease-in


  &.transition1
    .image-wrapper
      opacity 0
      // animation transition1-bg 0.5s linear forwards

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
            path
              fill $theme-color-white

@media only screen and (max-width: 1100px)

  main.project
    .infos
      bottom $theme-margin-top-mobile

@media only screen and (max-width: 660px)

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
        padding ($theme-margin-top-mobile/2 - 5px) $theme-margin-left-right ($theme-margin-top-mobile/2)
        h1
          font-size 1em
        h2
          font-size (1/$golden-num-sqrt)em

@media only screen and (max-width: 400px)
  body.has-touch
    main.project
      .infos
        padding ($theme-margin-top-mobile/2 - 5px) $theme-margin-left-right-mobile ($theme-margin-top-mobile/2)
        h1
          font-size (1/$golden-num-sqrt)em
        h2
          font-size (1/$golden-num)em

@media only screen and (max-width: 340px)
  body.has-touch
    main.project
      .infos
        h1
          font-size (1/$golden-num)em
          margin-bottom 2px
        h2
          font-size (1/$golden-num)em

@media only screen and (min-width: 661px) and (max-height: 700px)
  main.project
    .infos
      bottom ($theme-margin-top/2)

@media only screen and (max-width: 340px) and (max-height: 580px)
  body.has-touch
    main.project
      .infos
        padding ($theme-margin-top-mobile/2 - 10px) ($theme-margin-left-right-mobile - 10px) ($theme-margin-top-mobile/2 - 10px)
</style>

<script>
import svgNewWindow from '@/assets/images/new-window-mobile.svg';

import InlineSvg from '@/components/utils/InlineSvg.vue';

import raf from 'raf';
import ActionStack from '@/assets/js/utils/action-helper';

const actionStack = new ActionStack();

export default {
  name: 'project-content',

  components: {
    InlineSvg,
  },

  props: {
    hasTouch: {
      type: Boolean,
      default: false,
    },
    show: Boolean,
    id: String,
    project: Object,
    origin: {
      type: Object,
      default: {
        x: 0,
        y: 0,
      },
    },
    centerPosition: Object,
  },

  data() {
    return {
      svgNewWindow,
      firstProject: true,
      hideSpeCallback: null,
      isHiding: false,
      animating: false,
      removeImageBg: false,
      removeImageBgTimeout: null,
      opacityChange: false,
      opacityChangeTimeout: null,
      transition: 0,
      theProject: {},
      radius: {
        value: 0,
      },
      newPos: { x: 0, y: 0 },
      lastPos: { x: 0, y: 0 },
    };
  },

  computed: {
    computedImageStyle: function () {
      const urlName = window.innerWidth > 600 ? 'imageUrl' : 'smallImageUrl';

      const bg = this.removeImageBg
        ? `background-image: none`
        : `background-image: url(${this.theProject[urlName]})`;
      const opacity = this.opacityChange ? 'opacity: 0' : 'opacity: 1';

      return `${bg}; ${opacity};`;
    },

    computedImageWrapperStyle: function () {
      const rect = this.$el ? this.$el.getBoundingClientRect() : { x: 0, y: 0 };
      const center = {
        x: this.centerPosition.x - rect.x + this.diff.x,
        y: this.centerPosition.y - rect.y + this.diff.y,
      };

      return `clip-path: circle(${this.radius.value}px at ${center.x}px ${center.y}px)`;
    },

    computedInfosStyle: function () {
      return `background-color: ${this.theProject.bgColor}`;
    },

    computedBlendModeStyle: function () {
      return `mix-blend-mode: ${this.theProject.blendMode || 'lighten'}`;
    },

    diff: function () {
      return {
        x: this.newPos ? this.newPos.x - this.centerPosition.x : 0,
        y: this.newPos ? this.newPos.y - this.centerPosition.y : 0,
      };
    },
  },

  mounted() {
    window.addEventListener('updateorigin', e => {
      if (this.id === e.detail.id) this.newPos = e.detail.newPos;
    });
  },

  methods: {
    animateLoop: function () {
      this.animating = true;

      const tick = () => {
        // console.log(this.radius.value);

        actionStack.increment();
        if (this.animating) raf(tick);
      };

      raf(tick);
    },

    calcValue: function () {
      const rect = this.$el
        ? this.$el.getBoundingClientRect()
        : { width: 3000, height: 2000 };

      const lBR = Math.sqrt(
        (rect.width - (this.origin.x ? this.origin.x : 0)) ** 2 +
          (rect.height - (this.origin.y ? this.origin.y : 0)) ** 2
      );
      const lTR = Math.sqrt(
        (rect.width - (this.origin.x ? this.origin.x : 0)) ** 2 +
          (this.origin.y ? this.origin.y : 0) ** 2
      );
      const lTL = Math.sqrt(
        (this.origin.x ? this.origin.x : 0) ** 2 +
          (this.origin.y ? this.origin.y : 0) ** 2
      );
      const lBL = Math.sqrt(
        (this.origin.x ? this.origin.x : 0) ** 2 +
          (rect.height - (this.origin.y ? this.origin.y : 0)) ** 2
      );

      const offset = 30;
      const value = Math.max(lBR, lTR, lTL, lBL) + offset;

      return value;
    },

    showProject: function (value) {
      clearTimeout(this.removeImageBgTimeout);
      this.removeImageBgTimeout = null;
      this.removeImageBg = false;

      clearTimeout(this.opacityChangeTimeout);
      this.opacityChangeTimeout = null;
      this.opacityChange = false;

      const actionSettings = {
        name: 'show-project',
        object: this.radius,
        ref: 'value',
        to: value,
        easing: 0.2,
        completePercent: 0.99,
        done: () => {
          this.animating = false;
        },
      };

      actionStack.remove(['hide-project']).add(actionSettings);
      if (!this.animating) this.animateLoop();
    },

    hideProject: function () {
      this.removeImageBgTimeout = setTimeout(() => {
        this.removeImageBg = true;
      }, 500);

      this.opacityChangeTimeout = setTimeout(() => {
        this.opacityChange = true;
        this.firstProject = true;
      }, 50);

      actionStack.remove(['show-project']).add({
        name: 'hide-project',
        object: this.radius,
        ref: 'value',
        to: 0.1,
        easing: 0.2,
        completePercent: 0.9,
        done: () => {
          this.animating = false;
        },
      });

      if (!this.animating) this.animateLoop();
    },
  },

  watch: {
    project: function (newVal, oldVal) {
      if (this.firstProject) {
        this.firstProject = false;
        this.theProject = newVal;
      } else {
        if (this.hasTouch) {
          this.transition = 1;
          setTimeout(() => {
            this.transition = 0;
            this.theProject = newVal;
          }, 510);
        } else {
          this.theProject = newVal;
        }
      }
    },

    show: function (newVal, oldVal) {
      const value = this.calcValue();

      if (newVal) {
        this.showProject(value);
      } else {
        this.hideProject(value);
      }
    },
  },
};
</script>
