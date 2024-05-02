import { createRouter, createWebHistory } from 'vue-router';

import AppContent from '@/components/AppContent.vue';

export default createRouter({
  history: createWebHistory(),
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
      path: '/:any(.*)*',
      redirect: '/404',
    },
  ],
});
