import type { Head } from '@unhead/vue';

const title = 'François Risoud Portfolio';
const fullURL = 'http://www.francoisrisoud.com';

const descSearch = 'François Risoud, full-stack web developer.';
const descSocial = 'François Risoud, full-stack web developer.';
const socialImage = 'static/images/social/ekqnp.png';

/**
 * Title and meta tags for SEO
 */
export default {
  title,
  meta: [
    // prevent phone number auto-detection (Safari iOS & Blackberry)
    { name: 'format-detection', content: 'telephone=no' },
    { 'http-equiv': 'x-rim-auto-match', content: 'none' },

    // where it is hosted
    { name: 'whereami', content: 'netlify' },

    // search engines
    { name: 'description', content: descSearch },

    // twitter cards
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@ekqnp' },
    { name: 'twitter:creator', content: '@ekqnp' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: descSocial },
    { name: 'twitter:image', content: fullURL + '/' + socialImage },

    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: fullURL },
    { property: 'og:image', content: fullURL + '/' + socialImage },
    { property: 'og:description', content: descSocial },
    { property: 'og:site_name', content: title },
  ],
} satisfies Head;
