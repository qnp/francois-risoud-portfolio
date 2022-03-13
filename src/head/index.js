/*
 * metas tags
 */
const title = 'François Risoud Portfolio';
const fullURL = 'http://www.francoisrisoud.com';

const desc_search = 'François Risoud, full-stack web developer.';
const desc_social = 'François Risoud, full-stack web developer.';
const social_image = 'static/images/social/ekqnp.png';

export default {
  title,
  meta: [
    // prevent phone number auto-detection (Safari iOS & Blackberry)
    { name: 'format-detection', content: 'telephone=no' },
    { 'http-equiv': 'x-rim-auto-match', content: 'none' },

    // where it is hosted
    { name: 'whereami', content: 'netlify' },

    // search engines
    { name: 'description', content: desc_search },

    // twitter cards
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@ekqnp' },
    { name: 'twitter:creator', content: '@ekqnp' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: desc_social },
    { name: 'twitter:image', content: fullURL + '/' + social_image },

    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: fullURL },
    { property: 'og:image', content: fullURL + '/' + social_image },
    { property: 'og:description', content: desc_social },
    { property: 'og:site_name', content: title },
  ],
};
