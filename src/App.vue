<template lang="pug">
  #app
    custom-cursor(:content-id='contentId',:blend-mode='cursorBlendMode',:has-touch='hasTouch')
    router-view

</template>


<style lang="stylus">

</style>

<script>

// css
import 'normalize.css';
import 'reset-css/reset.css';

import CustomCursor from '@/components/CustomCursor';
import AppContent from '@/components/AppContent';

export default {

  name: 'app',

  components: {
    CustomCursor,
    AppContent,
  },

  mounted() {

    // detect if touch event is working as supposed => touch device
    const self = this;
    window.addEventListener('touchstart', function setHasTouch() {
      self.hasTouch = true;
      document.body.classList.add('has-touch');
      window.removeEventListener('touchstart', setHasTouch);
    }, false);

    // prenvent touchmove event to remove 'overscroll' effect
    window.addEventListener('touchmove', function(e) {
      e.preventDefault();
      return false;
    }, false);

  },

  data() {
    return {
      hasTouch: false,
      contentId: 'content',
      cursorBlendMode: 'intro',
    };
  },

};

</script>
