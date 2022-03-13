<template lang='pug'>
.cursor(:class='classes')
  .cursor-content
  .social-picto.fifteen
    inline-svg(:src="svgFifteenLogoOnly")
  .social-picto.twitter
    inline-svg(:src="svgTwitter")
  .social-picto.github
    inline-svg(:src="svgGithub")
  .social-picto.mailto
    inline-svg(:src="svgMail")
  .social-picto.new-window
    inline-svg(:src="svgCursorNewWindow")
  .scroll-picto
    inline-svg(:src="svgCursorScroll")
</template>

<style lang='stylus'>

  $cursor-color = $theme-color-pink
  $cursor-size = 60px
  $visor-size = 0px
  $transition-duration-all = 0.1s
  $transition-duration-down-clickable = 0.5s;
  $normal-scale = 0.2
  $click-scale = 0.8;
  $clickable-scale = 1;
  $clickable-opacity = 1
  $social-picto-size = 60px
  $twitter-picto-ratio-wh = 1
  $github-picto-ratio-wh = 1
  $new-window-picto-ratio-wh = 1
  $mail-picto-ratio-wh = 0.7
  $scroll-picto-size = 96px

  html:not(.debug), body:not(.debug)
    cursor none

  .debug
    .cursor, .scroll-picto
      pointer-events auto

  .cursor
    position absolute
    top 0
    pointer-events none
    width $cursor-size
    height $cursor-size
    position fixed
    top -($cursor-size/2)
    left -($cursor-size/2)
    z-index 999

    &.transition
      transition transform 250ms ease-out

    &.blend-intro
      mix-blend-mode hard-light

    &.blend-main
      mix-blend-mode hard-light

    .cursor-content
      pointer-events none
      width $cursor-size
      height $cursor-size
      background-color $cursor-color
      border-radius ($cursor-size/2)
      transition all $transition-duration-all ease-out
      // mask url(#mailto-path)
      // svg
      //   path
      //     fill $cursor-color

    .social-picto
      width $social-picto-size
      position absolute
      top 50%
      left 50%
      margin-left (- $social-picto-size/2)
      transition all $transition-duration-all ease-out
      opacity 0
      transform scale(0)
      svg
        width $social-picto-size
        path
          fill $theme-color-pink
      &.twitter
        margin-top (- $social-picto-size*$twitter-picto-ratio-wh/2)
      &.github
        margin-top (- $social-picto-size*$github-picto-ratio-wh/2)
      &.mailto
        margin-top (- $social-picto-size*$mail-picto-ratio-wh/2)
      &.new-window
        margin-top (- $social-picto-size*$new-window-picto-ratio-wh/2)

    .scroll-picto
      position absolute
      top 10px
      pointer-events none
      width $scroll-picto-size
      margin-left (-($scroll-picto-size - $cursor-size)/2)
      opacity 0
      transform scale(0)
      transition all $transition-duration-all ease-out
      svg
        width $scroll-picto-size
        path
          fill $theme-color-pink

    // .mailto-picto
    //   width $picto-size
    //   position absolute
    //   top 50%
    //   left 50%
    //   transform translate(-50%,-50%)
    //   transition all $transition-duration-all ease-out
    //   opacity 0
    //   path
    //     fill $theme-color-dark-blue

    // .visor
    //   position absolute
    //   top (($cursor-size - $visor-size)/2)
    //   left (($cursor-size - $visor-size)/2)
    //   border-radius ($visor-size/2)
    //   pointer-events none
    //   width $visor-size
    //   height $visor-size
    //   background-color $cursor-color
    //   transition all $transition-duration-all ease-out

    &.hidden
      .cursor-content
        transform scale(0)

    &.visible
      .cursor-content
        transform scale($normal-scale)

    &:not(.hidden)

      &:not(.twitter-cursor):not(.github-cursor):not(.mailto-cursor):not(.scroll-cursor)

        &.down
          .cursor-content
            transform scale($normal-scale * $click-scale)

        &.clickable-cursor
          .cursor-content
            transform scale($clickable-scale)
            opacity $clickable-opacity
          &.down
            .cursor-content
              transform scale($clickable-scale * $click-scale)

        &.selectable-cursor
          &.down
            .cursor-content
              width 2px
              height (2/3*$cursor-size)
              transform translate((($cursor-size - @width)/2),(1/6*$cursor-size))

      &.twitter-cursor,
      &.github-cursor,
      &.mailto-cursor,
      &.new-window-cursor
        .cursor-content
          transform scale(0)

      &.twitter-cursor
        .social-picto.twitter
          transform scale($clickable-scale)
          opacity $clickable-opacity
        &.down
          .social-picto.twitter
            transform scale($clickable-scale * $click-scale)

      &.github-cursor
        .social-picto.github
          transform scale($clickable-scale)
          opacity $clickable-opacity
        &.down
          .social-picto.github
            transform scale($clickable-scale * $click-scale)

      &.mailto-cursor
        .social-picto.mailto
          transform scale($clickable-scale)
          opacity $clickable-opacity
        &.clicked
          .social-picto.mailto
            animation send-message 1s ease-in
            animation-fill-mode forwards

      &.new-window-cursor
        .social-picto.new-window
          transform scale($clickable-scale)
          opacity $clickable-opacity
        &.down
          .social-picto.new-window
            transform scale($clickable-scale * $click-scale)

      &.scroll-cursor
        .cursor-content
          transform scale(0)
        .scroll-picto
          transform scale($clickable-scale)
          opacity $clickable-opacity
        &.down
          .scroll-picto
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

<script>
import svgFifteenLogoOnly from '@/assets/images/fifteen-logo-only.svg';
import svgTwitter from '@/assets/images/twitter.svg';
import svgGithub from '@/assets/images/github.svg';
import svgMail from '@/assets/images/mail.svg';
import svgCursorNewWindow from '@/assets/images/new-window-3.svg';
import svgCursorScroll from '@/assets/images/cursor-scroll.svg';

import $ from '@/assets/js/utils/$';
import rot13 from '@/assets/js/utils/rot13';
import 'element-closest';

import InlineSvg from '@/components/utils/InlineSvg.vue';

const mouse = {x: 0, y: 0};

export default {

  name: 'custom-cursor',

  components: { InlineSvg },

  props: {
    contentId: String,
    blendMode: String,
    hasTouch: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    const router = this.$router;
    const self = this;
    return {
      svgFifteenLogoOnly,
      svgTwitter,
      svgGithub,
      svgMail,
      svgCursorNewWindow,
      svgCursorScroll,
      transitionDurationDownClickable: 500,
      clickableLogic: [{
        selector: 'a[href]:not([href^=mailto]):not([href^=http]):not(.active)',
        cursorClasses: ['clickable-cursor']
      }, {
        selector: 'p, h1, h2, h3, h4',
        cursorClasses: ['selectable-cursor']
      }, {
        selector: '[href^=mailto]',
        cursorClasses: ['mailto-cursor']
      }, {
        selector: 'a.twitter',
        cursorClasses: ['twitter-cursor']
      }, {
        selector: 'a.github',
        cursorClasses: ['github-cursor']
      }, {
        selector: '.scroll-invite',
        cursorClasses: ['scroll-cursor']
      }, {
        selector: 'a[href^=http]:not(.twitter):not(.github)',
        cursorClasses: ['new-window-cursor']
      }],
      eventsLogic: [
        {
          selector: 'a[href].circle',
          events: {
            click: function(e) {
              if (self.hasTouch) {
                e.preventDefault();
                return false;
              }
            }
          }
        },
        {
          selector: 'a[href]:not([href^=mailto]):not([href^=http])',
          events: {
            click: function(e) {
              e.preventDefault();
              const href = e.target.closest('a[href]').getAttribute('href');
              if (router) router.push(href);
              else window.location.href = href;
              return false;
            }
          }
        },
        {
          selector: '[href^=mailto]',
          events: {
            click: function(e) {
              e.preventDefault();
              setTimeout(function() {
                window.location.href = 'mailto:'+rot13('senapbvf.evfbhq@tznvy.pbz');
              }, 500);
              return false;
            }
          }
        }
      ],
      viewClass: 'hidden',
      // waitForHide: false,
      stickySelector: '.sticky',
      stickyElem: null,
      stickyness: 0.4,
      transition: false,
      transitionStickyDuration: 300,
      unsetTransitionOnce: false,
      elapsedWaitingTime: 0
    };
  },

  computed: {
    classes: function() {
      return 'blend-'+this.blendMode+' '+this.viewClass+(this.transition?' transition':'');
    },
    pathDef: function() {
      return 'M1,1 L0,1 A1,1,0,1,0,0.000000005,0.999999 Z';
    }

  },

  mounted() {

    const _this = this;
    const $el = this.$el;

    const debug = false;

    // check for special handlers
    this.checkEvents();

    if (!debug) {

      $(document.body).on({
        mousemove: function(e) {
          if (!_this.hasTouch) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            _this.checkClickable(mouse.x, mouse.y);
            _this.setCursorPosition(mouse.x, mouse.y);
            if (_this.viewClass !== 'visible') _this.viewClass = 'visible';
          }
        },
        mouseenter: function(e) {
          if (!_this.hasTouch) {
            _this.setCursorPosition(e.clientX, e.clientY);
            _this.viewClass = 'visible';
          }
        },
        mouseleave: function() {
          if (!_this.hasTouch) {
            if ($el.classList.contains('clicked')) {
            } else {
              _this.viewClass = 'hidden';
            }
          }
        },
        mousedown: function() {
          if (!_this.hasTouch) {
            $el.classList.add('down');
          }
        },
        mouseup: function() {
          if (!_this.hasTouch) {
            $el.classList.remove('down');
          }
        },
        click: function() {
          if (!_this.hasTouch) {
            $el.classList.add('clicked');
            setTimeout(function() {
              $el.classList.remove('clicked');
            }, 1000);
          }
        },
      });

      $(`#${this.contentId}`).on({
        DOMSubtreeModified: function() {
          if (!_this.hasTouch) _this.checkClickable(mouse.x, mouse.y);
          _this.checkEvents();
        }
      });

    } else {

      _this.setCursorPosition(200, 200);
      _this.viewClass = 'visible scroll-cursor';
      $('html').classList.add('debug');
      $('body').classList.add('debug');

    }

  },

  methods: {

    checkEvents: function() {
      // check for special handlers
      this.eventsLogic.forEach((logic) => {
        if (logic.events) {
          $(logic.selector).off(logic.events);
          $(logic.selector).on(logic.events);
        }
      });
    },

    checkClickable: function(x, y) {
      const $el = this.$el;
      const elem = document.elementFromPoint(x, y);
      // check if it has a class defined in logic
      this.clickableLogic.forEach(function(logic, i) {
        if (elem && elem.closest(logic.selector)) logic.cursorClasses.forEach(function(c) { $el.classList.add(c); });
        else logic.cursorClasses.forEach(function(c) { $el.classList.remove(c); });
      });
      // check if it has sticky class
      const stickyElem = elem ? elem.closest(this.stickySelector) : null;
      if (stickyElem) {
        // if (!this.stickyElem) {
        //   this.transition = true;
        //   this.unsetTransitionOnce = true;
        // }
        this.stickyElem = stickyElem;
        // this.transition = true;
      } else {
        if (this.stickyElem) {
          this.transition = true;
          this.unsetTransitionOnce = true;
        }
        this.stickyElem = null;
      }
    },

    setCursorPosition: function(x, y) {
      if (this.stickyElem) {
        const rect = this.stickyElem.getBoundingClientRect();
        const X = rect.x + rect.width/2;
        const Y = rect.y + rect.height/2;
        const k = this.stickyness;
        this.$el.style.transform = `matrix(1, 0, 0, 1, ${k*(x-X)+X}, ${k*(y-Y)+Y})`;
        // if (this.transition && this.unsetTransitionOnce) {
        //   this.unsetTransitionOnce = false;
        //   setTimeout(() => { console.log('once'); this.transition = false; }, 100);
        // }
      } else {
        this.$el.style.transform = `matrix(1, 0, 0, 1, ${x}, ${y})`;
        if (this.transition && this.unsetTransitionOnce) {
          this.unsetTransitionOnce = false;
          setTimeout(() => { this.transition = false; }, this.transitionStickyDuration);
        }
      }
    },
  },

};

</script>
