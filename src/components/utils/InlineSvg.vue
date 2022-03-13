<template lang="pug">
.inline-svg(v-once v-html="src")
</template>

<style lang="stylus">
.inline-svg
  display flex
  align-items center
</style>

<script>
export default {
  name: 'inline-svg',

  props: {
    src: String,
    clipPath: {
      type: Boolean,
      default: false,
    },
    mask: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
    },
  },

  mounted() {
    if (this.clipPath || this.mask) {
      const xmlns = 'http://www.w3.org/2000/svg';
      const svg = this.$el.querySelector('svg');
      const toWrap = svg.children;
      const defs = document.createElementNS(xmlns, 'defs');
      const clipPath = document.createElementNS(
        xmlns,
        this.clipPath ? 'clipPath' : 'mask'
      );
      clipPath.setAttribute('id', this.id);
      Array.from(toWrap).forEach(function (child) {
        clipPath.appendChild(child);
      });
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      defs.appendChild(clipPath);
      svg.appendChild(defs);
    }
  },
};
</script>
