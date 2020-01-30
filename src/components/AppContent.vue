<template lang="pug">
  #content.app-content

    physical-bubble(:open='bubbleIntro.open',:appear='introAppear',@end-opening='endOpeningHandler',@end-closing='endClosingHandler',:num-particles='bubbleIntro.numParticles',:settings='bubbleIntro.settings',:breath='bubbleIntro.breath',:change-blob-color='bubbleIntro.changeBlobColor',:has-touch='hasTouch',:remove-particles='bubbleIntro.removeParticlesComunicator')
    physical-bubble(:num-particles='bubbleLanding.numParticles',:settings='bubbleLanding.settings',:start='bubbleLanding.start',:hide='bubbleLanding.hide',:breath='bubbleLanding.breath',:projects-mode='bubbleLanding.projectsMode',:appear='landingAppear',:has-touch='hasTouch',:remove-particles='bubbleLanding.removeParticlesComunicator')

    .content-wrapper(:class='content.showHideClass')
      curriculum-content(:show='curriculum.show',:skills-array='curriculum.skillsArray',@on='curriculumOnHandler',@off='curriculumOffHandler',@reached-top='curriculumReachedTop',@scroll='curriculumScrollHandler')
      project-content(:show='project.show',:id='project.id',:project='project.project',:origin='project.origin',:center-position='project.centerPosition',:has-touch='hasTouch')
      the-menu(:open='bubbleIntro.open',:route='route')
      about-content(:show='about.show',:true-hide='about.trueHide')

    a(href='/about')
      intro-logo(:do-hide='intro.logo.doHide',:do-show='intro.logo.doShow')
    intro-text(:do-hide='intro.text.doHide',:do-show='intro.text.doShow',:not-found='intro.text.notFound')

</template>


<style lang="stylus">

  @import url('https://fonts.googleapis.com/css?family=Raleway:200,400,500,600,700|Quattrocento:400')

  html
    height 100%
    width 100%
    overflow hidden

  body
    width 100%
    height 100%
    overflow hidden
    -webkit-overflow-scrolling touch
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    background-color $theme-color-light-blue
    font-size 22px

  body.bloated
    opacity 0.5

  ::-moz-selection
    background-color $select-color-bg
    color $select-color-text
    text-shadow none
  ::selection
    background-color $select-color-bg
    color $select-color-text
    text-shadow none

  a[href]
    color inherit
    text-decoration inherit
    cursor inherit

  a:focus
    outline 0 none
  a:active, a:hover
    outline: 0 none

  svg
    user-select none

  *
    -webkit-tap-highlight-color rgba(0,0,0,0)

  .app-content
    opacity 0
    transition opacity 0.2s linear
    .content-wrapper
      pointer-events none
      width 100%
      max-width $content-max-width
      margin-left auto
      margin-right auto
      &.show
        display block
      &.hide
        display none

  body.mounted
    .app-content
      opacity 1

</style>

<script>

import PhysicalBubble from '@/components/PhysicalBubble';
import IntroLogo from '@/components/IntroLogo';
import IntroText from '@/components/IntroText';
import TheMenu from '@/components/TheMenu';
import AboutContent from '@/components/AboutContent';
import ProjectContent from '@/components/ProjectContent';
import CurriculumContent from '@/components/CurriculumContent';

import hexToArray from '@/assets/js/utils/hex-to-array';
import uniqueID from '@/assets/js/utils/unique-ID';

import skillsArray from '@/assets/js/content/skills-array';
import projects from '@/assets/js/content/projects';

import $ from '@/assets/js/utils/$';

// flatten skillsArray
var isolatedLabels = [];
skillsArray.forEach(function(category) {
  isolatedLabels = isolatedLabels.concat(category.content);
});

const lightBlue = '#1a33ff';
const darkBlue = '#001433';
const pink = '#f7567c';
const darkPink = '#83173c';
const blue = '#1a33ff';

var numParticlesIntro = 100;
var numParticlesLanding = 100;
var bubbleIntroSettings = {};
var bubbleLandingSettings = {};

var numParticlesLandingMin = 30;
var numParticlesIntroMin = 20;

var centerRatio = 1.05;

if (window.innerWidth > 400 && window.innerWidth <= 600) {

  numParticlesLanding = 50;
  centerRatio = 1.1;

} else if (window.innerWidth <= 400) {

  numParticlesLanding = numParticlesLandingMin;
  bubbleLandingSettings.attarctiveness = 60;
  bubbleLandingSettings.longRangeCenterAttract = 1;
  centerRatio = 1.3;

}

export default {

  name: 'app-content',

  components: {
    PhysicalBubble,
    IntroLogo,
    TheMenu,
    AboutContent,
    IntroText,
    ProjectContent,
    CurriculumContent
  },

  props: {
    route: {
      type: String,
      default: 'Intro'
    }
  },

  data() {

    return {
      hasTouch: false,
      bubbleIntro: {
        removeParticlesComunicator: null,
        open: false,
        isOpen: false,
        breath: 0,
        changeBlobColor: '',
        numParticles: numParticlesIntro,
        settings: Object.assign({}, {
          name: 'intro',
          soothingFactor: 0.02,
          blobColor: hexToArray(darkBlue),
          bgColor: hexToArray(lightBlue),
          showGui: false,
          showStats: false
        }, bubbleIntroSettings)
      },
      bubbleLanding: {
        removeParticlesComunicator: null,
        start: false,
        hide: false,
        reduce: false,
        breath: 0,
        projectsMode: false,
        numParticles: numParticlesLanding, // 15, // 100,
        settings: Object.assign({}, {
          name: 'landing',
          timeScale: 1, // 0.8,
          particleRadius: 1,
          particleAuraRadius: 60,
          randomRadiusFactor: 0,
          soothingFactor: 0.05,
          auraTypeMix: 0.8,
          repelExponent: 14,
          centerAttractExponent: 20,
          longRangeCenterAttract: 0.5,
          equilibriumDistance: 24,
          attarctiveness: 50,
          longRangeTail: 0.6,
          startRadius: 250,
          center: {
            xRatio: centerRatio,
            yRatio: centerRatio
          },
          showIsolated: true,
          isolatedLabels: isolatedLabels,
          projects: projects,
          startPosMode: 'far',
          hasBoundaries: true,
          boundaries: {
            right: {
              wRatio: centerRatio,
              offset: 400,
            },
            bottom: {
              hRatio: centerRatio,
              offset: 400,
            }
          },
          blobColor: hexToArray(pink),
          bgColor: hexToArray(darkBlue),
          maxBreath: -30,
          minBreath: -100,
          showGui: false,
        }, bubbleLandingSettings)
      },
      content: {
        showHideClass: 'hide',
      },
      intro: {
        logo: {
          doShow: '',
          dohide: '',
        },
        text: {
          doShow: '',
          dohide: '',
          notFound: false,
        },
      },
      about: {
        show: false,
        trueHide: false
      },
      project: {
        show: false,
        project: {},
        origin: {x: 0, y: 0},
        centerPosition: {x: 0, y: 0}
      },
      curriculum: {
        show: false,
        isScrolling: false,
        skillsArray: skillsArray,
      },
      scrollValueLimit: 1000,
      scrollValueStack: 0,
      scrollDateLimit: 100,
      preventNavigation: false,
      navTimeout: null,
      waitScroll: false,
      bloatedStack: 0,
    };

  },

  computed: {

    introAppear: function() {
      return (this.route === 'Intro');
    },

    landingAppear: function() {
      return (this.route === 'About');
    }

  },

  mounted() {

    document.body.classList.add('mounted');

    // detect if touch event is working as supposed => touch device
    const self = this;
    window.addEventListener('touchstart', function setHasTouch() {
      self.hasTouch = true;
      window.removeEventListener('touchstart', setHasTouch);
    }, false);

    // prevent fake scroll
    window.onLoad = function() {
      window.scrollTo(0, 1);
    };

    // prevent touchmove defaults on everything that hides the adress bar in chrome android
    $('*').on({
      touchmove: function(e) { e.preventDefault(); },
    });

    // preload images
    if (window.innerWidth <= 600) {
      this.lazyloadProjectImages('smallImageUrl');
    } else {
      this.lazyloadProjectImages('imageUrl');
    }

    switch (this.route) {
      case 'Intro': {
        this.checkBloatIntro();
        this.setBodyBg(blue);
        setTimeout(() => {
          this.intro.text.doShow = uniqueID();
          this.intro.logo.doShow = uniqueID();
        }, 1000);
        break;
      }
      case 'About': this.setAboutState(); break;
      case 'Projects': {
        this.about.trueHide = true;
        this.setProjectsState();
        break;
      }
      case 'Curriculum': {
        this.about.trueHide = true;
        this.setCurriculumState();
        break;
      }
      case 'NotFound': {
        this.checkBloatIntro();
        this.bubbleIntro.settings.showGui = true;
        this.intro.text.notFound = true;
        setTimeout(() => { this.intro.text.doShow = uniqueID(); }, 500);
        break;
      }
    }

    var timer;

    window.addEventListener('wheel', (e) => {

      let factor = 1;
      if (e.deltaMode === 1) factor = 30;
      const scrollValue = e.deltaY * factor;

      clearTimeout(timer);

      if (!this.curriculum.isScrolling) {
        this.scrollValueStack += scrollValue;
      }

      timer = setTimeout(() => {

        this.scrollValueStack = 0;
        this.scrollHandler(0);

      }, this.scrollDateLimit);

      if (this.scrollValueStack >= this.scrollValueLimit) {
        this.scrollValueStack = 0;
        this.waitScroll = true;
        setTimeout(() => { this.waitScroll = false; }, 1000);
        this.next(); // go to next page
      } else if (this.scrollValueStack <= -this.scrollValueLimit) {
        this.scrollValueStack = 0;
        this.waitScroll = true;
        setTimeout(() => { this.waitScroll = false; }, 1000);
        this.prev(); // go to prev page
      } else if (!this.waitScroll) {
        this.scrollHandler(this.scrollValueStack / this.scrollValueLimit); // handle scroll
      }

    });

    window.addEventListener('showproject', (e) => {

      this.project.show = true;
      this.project.id = e.detail.id;
      this.project.project = e.detail.project;
      this.project.origin = e.detail.origin;
      this.project.centerPosition = e.detail.centerPosition;
      this.bubbleLanding.settings.bgColor = e.detail.project.bgColor;

    });

    window.addEventListener('hideproject', (e) => {

      this.project.show = false;
      if (this.route === 'Projects') this.bubbleLanding.settings.bgColor = darkPink;
      else if (this.route === 'About') this.bubbleLanding.settings.bgColor = darkBlue;

    });

  },

  methods: {

    bloatIntroHandler: function() {
      this.bloatedStack++;
      if (this.bloatedStack >= 7) {
        this.bloatedStack = 0;
        if (numParticlesIntro > numParticlesIntroMin) {
          numParticlesIntro -= 10;
          this.bubbleIntro.removeParticlesComunicator = {
            num: 10,
            threshold: false,
            id: uniqueID()
          };
        }
      }
    },

    checkBloatIntro: function() {
      window.addEventListener('bloated-intro', this.bloatIntroHandler);
    },

    uncheckBloatIntro: function() {
      this.bloatedStack = 0;
      window.removeEventListener('bloated-intro', this.bloatIntroHandler);
    },

    bloatLandingHandler: function() {
      this.bloatedStack++;
      if (this.bloatedStack >= 7) {
        this.bloatedStack = 0;
        if (numParticlesLanding > numParticlesLandingMin) {
          numParticlesLanding -= 10;
          this.bubbleLanding.removeParticlesComunicator = {
            num: 10,
            threshold: true,
            id: uniqueID()
          };
        }
      }
    },

    checkBloatLanding: function() {
      window.addEventListener('bloated-landing', this.bloatLandingHandler);
    },

    uncheckBloatLanding: function() {
      this.bloatedStack = 0;
      window.removeEventListener('bloated-landing', this.bloatLandingHandler);
    },

    lazyloadProjectImages: function(urlName, cb) {

      var i = projects.length-1;

      function loadImage(src) {
        const img = new Image();
        img.src = src;
        img.onload = function() {
          if (i>0) loadImage(projects[i--][urlName]);
          else if (cb && typeof cb === 'function') cb();
        };
      }

      loadImage(projects[i].imageUrl);

    },

    setIntroState: function() {
      this.checkBloatIntro();
      this.setBodyBg(blue);
      this.bubbleIntro.open = false;
      this.about.show = false;
      this.bubbleLanding.hide = true;
      this.bubbleLanding.settings.bgColor = darkBlue;
      this.bubbleLanding.projectsMode = false;
      this.curriculum.show = false;
      setTimeout(() => { this.bubbleLanding.start = false; }, 500);
    },

    setAboutState: function() {
      this.checkBloatLanding();
      this.uncheckBloatIntro();
      this.setBodyBg(darkBlue);
      if (!this.bubbleIntro.isOpen) this.bubbleIntro.open = true;
      else {
        this.bubbleLanding.hide = false;
        this.bubbleLanding.start = true;
      }
      this.about.show = true;
      this.about.trueHide = false;
      this.content.showHideClass = 'show';
      this.intro.logo.doHide = uniqueID();
      this.intro.text.doHide = uniqueID();
      this.bubbleLanding.settings.bgColor = darkBlue;
      this.bubbleLanding.projectsMode = false;
      this.curriculum.show = false;
    },

    setProjectsState: function() {
      this.checkBloatLanding();
      this.uncheckBloatIntro();
      this.setBodyBg(darkPink);
      if (!this.bubbleIntro.isOpen) this.bubbleIntro.open = true;
      else {
        this.bubbleLanding.hide = false;
        this.bubbleLanding.start = true;
      }
      this.about.show = false;
      this.content.showHideClass = 'show';
      this.intro.logo.doHide = uniqueID();
      this.intro.text.doHide = uniqueID();
      this.bubbleLanding.settings.bgColor = darkPink;
      this.bubbleLanding.projectsMode = true;
      this.curriculum.show = false;
    },

    setCurriculumState: function() {
      this.uncheckBloatLanding();
      this.uncheckBloatIntro();
      this.setBodyBg(blue);
      if (!this.bubbleIntro.isOpen) {
        this.bubbleIntro.open = true;
      } else {
        this.bubbleLanding.hide = false;
      }
      this.about.show = false;
      this.content.showHideClass = 'show';
      this.intro.logo.doHide = uniqueID();
      this.intro.text.doHide = uniqueID();
      this.curriculum.show = true;
    },

    endClosingHandler: function() {
      this.bubbleIntro.isOpen = false;
      this.intro.logo.doShow = uniqueID();
      this.intro.text.doShow = uniqueID();
      this.content.showHideClass = 'hide';
    },

    endOpeningHandler: function() {
      this.bubbleIntro.isOpen = true;
      this.bubbleLanding.hide = false;
      if (!this.curriculum.show) {
        this.bubbleLanding.start = true;
      }
    },

    scrollHandler: function(ratio) {

      switch (this.route) {
        case 'Intro': this.bubbleIntro.breath = ratio; break;
        case 'About': this.bubbleLanding.breath = ratio; break;
        case 'Projects': this.bubbleLanding.breath = ratio; break;
      }

    },

    next: function() {
      if (!this.preventNavigation) {
        switch (this.route) {
          case 'Intro': this.$router.push('/about'); break;
          case 'About': this.$router.push('/projects'); break;
          case 'Projects': this.$router.push('/curriculum'); break;
        }
        this.preventNavigationOn();
      }
    },

    prev: function() {
      if (!this.preventNavigation) {
        switch (this.route) {
          case 'About': this.$router.push('/'); break;
          case 'Projects': this.$router.push('/about'); break;
          case 'Curriculum': this.$router.push('/projects'); break;
        }
        this.preventNavigationOn();
      }
    },

    preventNavigationOn: function() {
      if (this.navTimeout) clearTimeout(this.navTimeout);
      this.preventNavigation = true;
      this.navTimeout = setTimeout(() => { this.preventNavigation = false; }, 2000);
    },

    curriculumOnHandler: function() {
      this.bubbleLanding.start = false;
    },

    curriculumOffHandler: function() {
      this.bubbleLanding.start = true;
    },

    curriculumReachedTop: function() {
      setTimeout(() => { this.curriculum.isScrolling = false; }, 1000);
    },

    curriculumScrollHandler: function() {
      this.curriculum.isScrolling = true;
    },

    setBodyBg(color) {
      document.body.setAttribute('style', 'background-color: '+color+';');
    }

  },

  watch: {

    route: function(newRoute, oldRoute) {

      switch (newRoute) {

        case 'Intro': this.setIntroState(); break;
        case 'About': this.setAboutState(); break;
        case 'Projects': this.setProjectsState(); break;
        case 'Curriculum': this.setCurriculumState(); break;

      }

    }

  }

};

</script>
