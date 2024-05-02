<template lang="pug">
#content.app-content
  PhysicalBubble(
    :open="bubbleIntro.open"
    :appear="introAppear"
    :num-particles="bubbleIntro.numParticles"
    :settings="bubbleIntro.settings"
    :breath="bubbleIntro.breath"
    :change-blob-color="bubbleIntro.changeBlobColor"
    :remove-particles="bubbleIntro.removeParticles"
    @end-opening="endOpeningHandler"
    @end-closing="endClosingHandler"
  )
  PhysicalBubble(
    :num-particles="bubbleLanding.numParticles"
    :settings="bubbleLanding.settings"
    :start="bubbleLanding.start"
    :hide="bubbleLanding.hide"
    :breath="bubbleLanding.breath"
    :projects-mode="bubbleLanding.projectsMode"
    :appear="landingAppear"
    :remove-particles="bubbleLanding.removeParticles"
  )

  .content-wrapper(:class="contentClass")
    CurriculumContent(
      :show="curriculum.show"
      :skills-array="curriculum.skillsArray"
      @on="curriculumOnHandler"
      @off="curriculumOffHandler"
      @reached-top="curriculumReachedTop"
      @scroll="curriculumScrollHandler"
    )
    ProjectContent(
      :show="project.show"
      :id="project.id"
      :project="project.project"
      :origin="project.origin"
      :center-position="project.centerPosition"
    )
    AppMenu(
      :value="bubbleIntro.open"
      :route="route"
    )
    AboutContent(
      :show="about.show"
      :hidden="about.trueHide"
    )

  RouterLink(to="/about")
    IntroLogo(:show="showIntroLogo")
  IntroText(
    :show="showIntroText"
    :not-found="isNotFoundText"
  )
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

html body
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

a:active,
a:hover
  outline 0 none

svg
  user-select none

*
  -webkit-tap-highlight-color rgba(0, 0, 0, 0)

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

<script setup lang="ts">
import PhysicalBubble from '@/components/PhysicalBubble.vue';
import IntroLogo from '@/components/IntroLogo.vue';
import IntroText from '@/components/IntroText.vue';
import AppMenu from '@/components/AppMenu.vue';
import AboutContent from '@/components/AboutContent.vue';
import ProjectContent from '@/components/ProjectContent.vue';
import CurriculumContent from '@/components/CurriculumContent.vue';

import uniqueId from '@/utils/unique-id';

import skillsArray from '@/assets/content/skills-array';
import projects from '@/assets/content/projects';

import { useTouch } from '@/composables/useTouch';

import type { PhysicalBubbleProps } from '@/components/PhysicalBubble.vue';

export interface AppContentProps {
  /**
   * Route name of the current page
   */
  route?: string;
}

const props = withDefaults(defineProps<AppContentProps>(), {
  route: 'Intro',
});

// Flatten skills
const isolatedLabels = skillsArray.flatMap(group => group.content);

const secondary = '#f7567c';
const secondaryDark = '#83173c';
const primary = '#1a33ff';
const primaryDark = '#001433';

const numParticlesLandingMin = 30;
const numParticlesIntroMin = 20;
const scrollValueLimit = 1000;
const scrollDateLimit = 100;

let navTimeout: NodeJS.Timeout | null = null;
let scrollValueStack = 0;
let preventNavigation = false;
let waitScroll = false;
let bloatedStack = 0;

const { width } = useWindowSize();
const router = useRouter();

const numParticlesIntro = ref(100);
const numParticlesLandingInitial = computed(() => {
  if (width.value > 400 && width.value <= 600) return 50;
  else if (width.value <= 400) return numParticlesLandingMin;
  else return 100;
});
const numParticlesLandingRemoved = ref(0);
const numParticlesLanding = computed(() => {
  return numParticlesLandingInitial.value - numParticlesLandingRemoved.value;
});

const centerRatioLanding = computed(() => {
  if (width.value > 400 && width.value <= 600) return 1.1;
  else if (width.value <= 400) return 1.3;
  else return 1.05;
});

const isBubbleIntroOpen = ref(false);
const bubbleIntro = reactiveComputed<PhysicalBubbleProps>(() => ({
  removeParticles: null,
  open: false,
  breath: 0,
  changeBlobColor: '',
  numParticles: numParticlesIntro.value,
  settings: {
    name: 'intro',
    soothingFactor: 0.02,
    blobColor: primaryDark,
    bgColor: primary,
    showGui: false,
  },
}));

const bubbleLanding = reactiveComputed<PhysicalBubbleProps>(() => ({
  removeParticles: null,
  start: false,
  hide: false,
  breath: 0,
  projectsMode: false,
  numParticles: numParticlesLanding.value,
  settings: {
    name: 'landing',
    timeScale: 1,
    particleRadius: 1,
    particleAuraRadius: 60,
    randomRadiusFactor: 0,
    soothingFactor: 0.05,
    auraTypeMix: 0.8,
    repelExponent: 14,
    centerAttractExponent: 20,
    longRangeCenterAttract: width.value < 400 ? 1 : 0.5,
    equilibriumDistance: 24,
    attractiveness: width.value < 400 ? 60 : 50,
    longRangeTail: 0.6,
    startRadius: 250,
    center: {
      xRatio: centerRatioLanding.value,
      yRatio: centerRatioLanding.value,
    },
    showIsolated: true,
    isolatedLabels,
    projects: projects,
    startPosMode: 'far',
    hasBoundaries: true,
    boundaries: {
      right: {
        wRatio: centerRatioLanding.value,
        offset: 400,
      },
      bottom: {
        hRatio: centerRatioLanding.value,
        offset: 400,
      },
    },
    blobColor: secondary,
    bgColor: primaryDark,
    maxBreath: -30,
    minBreath: -100,
    showGui: false,
  },
}));

const contentClass = ref('hide');

const showIntroText = ref(false);
const isNotFoundText = ref(false);
const showIntroLogo = ref(false);

const about = ref({
  show: false,
  trueHide: false,
});

interface DisplayedProject {
  id: string | null;
  show: boolean;
  project: Project | null;
  origin: Position;
  centerPosition: Position;
}

const project = ref<DisplayedProject>({
  id: null,
  show: false,
  project: null,
  origin: { x: 0, y: 0 },
  centerPosition: { x: 0, y: 0 },
});

const curriculum = ref({
  show: false,
  isScrolling: false,
  skillsArray: skillsArray,
});

const introAppear = computed(() => props.route === 'Intro');
const landingAppear = computed(() => props.route === 'About');

onMounted(() => {
  // Add class to body to hide the loader
  document.body.classList.add('mounted');

  // Preload images lazily
  if (width.value <= 600) {
    lazyloadProjectImages('smallImageUrl');
  } else {
    lazyloadProjectImages('imageUrl');
  }

  switch (props.route) {
    case 'Intro': {
      setIntroState();
      setTimeout(() => {
        showIntroText.value = true;
        showIntroLogo.value = true;
      }, 1000);
      break;
    }
    case 'About':
      setAboutState();
      break;
    case 'Projects': {
      about.value.trueHide = true;
      setProjectsState();
      break;
    }
    case 'Curriculum': {
      about.value.trueHide = true;
      setCurriculumState();
      break;
    }
    case 'NotFound': {
      checkBloatIntro();
      bubbleIntro.settings.showGui = true;
      isNotFoundText.value = true;
      setTimeout(() => {
        showIntroText.value = true;
      }, 500);
      break;
    }
  }

  let timer: NodeJS.Timeout;

  window.addEventListener('wheel', e => {
    let factor = 1;
    if (e.deltaMode === 1) factor = 30;
    const scrollValue = e.deltaY * factor;

    clearTimeout(timer);

    if (!curriculum.value.isScrolling) {
      scrollValueStack += scrollValue;
    }

    timer = setTimeout(() => {
      scrollValueStack = 0;
      scrollHandler(0);
    }, scrollDateLimit);

    if (scrollValueStack >= scrollValueLimit) {
      scrollValueStack = 0;
      waitScroll = true;
      setTimeout(() => {
        waitScroll = false;
      }, 1000);
      goToNextPage();
    } else if (scrollValueStack <= -scrollValueLimit) {
      scrollValueStack = 0;
      waitScroll = true;
      setTimeout(() => {
        waitScroll = false;
      }, 1000);
      goToPrevPage();
    } else if (!waitScroll) {
      scrollHandler(scrollValueStack / scrollValueLimit);
    }
  });
});

useEventListener('show-project', e => {
  project.value.show = true;
  project.value.id = e.detail.id;
  project.value.project = e.detail.project;
  project.value.origin = e.detail.origin;
  project.value.centerPosition = e.detail.centerPosition;
  bubbleLanding.settings.bgColor = e.detail.project.bgColor;
});

useEventListener('hide-project', e => {
  project.value.show = false;
  if (props.route === 'Projects')
    bubbleLanding.settings.bgColor = secondaryDark;
  else if (props.route === 'About')
    bubbleLanding.settings.bgColor = primaryDark;
});

function bloatIntroHandler() {
  bloatedStack++;
  if (bloatedStack >= 7) {
    bloatedStack = 0;
    if (numParticlesIntro.value > numParticlesIntroMin) {
      numParticlesIntro.value -= 10;
      bubbleIntro.removeParticles = {
        num: 10,
        threshold: false,
      };
    }
  }
}

function checkBloatIntro() {
  window.addEventListener('bloated-intro', bloatIntroHandler);
}

function uncheckBloatIntro() {
  bloatedStack = 0;
  window.removeEventListener('bloated-intro', bloatIntroHandler);
}

function bloatLandingHandler() {
  bloatedStack++;
  if (bloatedStack >= 7) {
    bloatedStack = 0;
    if (numParticlesLanding.value > numParticlesLandingMin) {
      numParticlesLandingRemoved.value += 10;
      bubbleLanding.removeParticles = {
        num: 10,
        threshold: true,
      };
    }
  }
}

function checkBloatLanding() {
  window.addEventListener('bloated-landing', bloatLandingHandler);
}

function uncheckBloatLanding() {
  bloatedStack = 0;
  window.removeEventListener('bloated-landing', bloatLandingHandler);
}

function lazyloadProjectImages(
  urlField: 'smallImageUrl' | 'imageUrl',
  callback?: () => void
) {
  var i = projects.length - 1;

  function loadImage(src: string) {
    const img = new Image();
    img.src = src;
    img.onload = function () {
      if (i > 0) loadImage(projects[i--][urlField]);
      else callback?.();
    };
  }

  loadImage(projects[i].imageUrl);
}

function setIntroState() {
  checkBloatIntro();
  setBodyBg(primary);
  bubbleIntro.open = false;
  about.value.show = false;
  bubbleLanding.hide = true;
  bubbleLanding.settings.bgColor = primaryDark;
  bubbleLanding.projectsMode = false;
  curriculum.value.show = false;
  setTimeout(() => {
    bubbleLanding.start = false;
  }, 500);
}

function setAboutState() {
  checkBloatLanding();
  uncheckBloatIntro();
  setBodyBg(primaryDark);
  if (!isBubbleIntroOpen.value) bubbleIntro.open = true;
  else {
    bubbleLanding.hide = false;
    bubbleLanding.start = true;
  }
  about.value.show = true;
  about.value.trueHide = false;
  contentClass.value = 'show';
  showIntroLogo.value = false;
  showIntroText.value = false;
  bubbleLanding.settings.bgColor = primaryDark;
  bubbleLanding.projectsMode = false;
  curriculum.value.show = false;
}

function setProjectsState() {
  checkBloatLanding();
  uncheckBloatIntro();
  setBodyBg(secondaryDark);
  if (!isBubbleIntroOpen.value) bubbleIntro.open = true;
  else {
    bubbleLanding.hide = false;
    bubbleLanding.start = true;
  }
  about.value.show = false;
  contentClass.value = 'show';
  showIntroLogo.value = false;
  showIntroText.value = false;
  bubbleLanding.settings.bgColor = secondaryDark;
  bubbleLanding.projectsMode = true;
  curriculum.value.show = false;
}

function setCurriculumState() {
  uncheckBloatLanding();
  uncheckBloatIntro();
  setBodyBg(primary);
  if (!isBubbleIntroOpen.value) {
    bubbleIntro.open = true;
  } else {
    bubbleLanding.hide = false;
  }
  about.value.show = false;
  contentClass.value = 'show';
  showIntroLogo.value = false;
  showIntroText.value = false;
  curriculum.value.show = true;
}

function endClosingHandler() {
  isBubbleIntroOpen.value = false;
  showIntroLogo.value = true;
  showIntroText.value = true;
  contentClass.value = 'hide';
}

function endOpeningHandler() {
  isBubbleIntroOpen.value = true;
  bubbleLanding.hide = false;
  if (!curriculum.value.show) {
    bubbleLanding.start = true;
  }
}

function scrollHandler(ratio: number) {
  switch (props.route) {
    case 'Intro':
      bubbleIntro.breath = ratio;
      break;
    case 'About':
      bubbleLanding.breath = ratio;
      break;
    case 'Projects':
      bubbleLanding.breath = ratio;
      break;
  }
}

function goToNextPage() {
  if (!preventNavigation) {
    switch (props.route) {
      case 'Intro':
        router.push('/about');
        break;
      case 'About':
        router.push('/projects');
        break;
      case 'Projects':
        router.push('/curriculum');
        break;
    }
    preventNavigationOn();
  }
}

function goToPrevPage() {
  if (!preventNavigation) {
    switch (props.route) {
      case 'About':
        router.push('/');
        break;
      case 'Projects':
        router.push('/about');
        break;
      case 'Curriculum':
        router.push('/projects');
        break;
    }
    preventNavigationOn();
  }
}

function preventNavigationOn() {
  if (navTimeout) clearTimeout(navTimeout);
  preventNavigation = true;
  navTimeout = setTimeout(() => {
    preventNavigation = false;
  }, 2000);
}

function curriculumOnHandler() {
  bubbleLanding.start = false;
}

function curriculumOffHandler() {
  bubbleLanding.start = true;
}

function curriculumReachedTop() {
  setTimeout(() => {
    curriculum.value.isScrolling = false;
  }, 1000);
}

function curriculumScrollHandler() {
  curriculum.value.isScrolling = true;
}

function setBodyBg(color: string) {
  document.body.style.setProperty('background-color', color);
}

watch(
  () => props.route,
  newRoute => {
    switch (newRoute) {
      case 'Intro':
        setIntroState();
        break;
      case 'About':
        setAboutState();
        break;
      case 'Projects':
        setProjectsState();
        break;
      case 'Curriculum':
        setCurriculumState();
        break;
    }
  }
);
</script>
