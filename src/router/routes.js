import Vue from 'vue';
import Router from 'vue-router';
import AppContent from '@/components/AppContent.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Intro',
      component: AppContent,
      props: { route: 'Intro' },
    },
    {
      path: '/about',
      name: 'About',
      component: AppContent,
      props: { route: 'About' },
    },
    {
      path: '/projects',
      name: 'Projects',
      component: AppContent,
      props: { route: 'Projects' },
    },
    {
      path: '/curriculum',
      name: 'Curriculum',
      component: AppContent,
      props: { route: 'Curriculum' },
    },
    {
      path: '/404',
      name: 'NotFound',
      component: AppContent,
      props: { route: 'NotFound' },
    },
    {
      path: '/*',
      redirect: '/404',
    },
  ],
});
