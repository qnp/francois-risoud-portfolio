/*
 * metas tags to be generated and injected by HtmlWepackPlugin
 */

const title = 'François Risoud Portfolio';
const fullURL = 'http://www.francoisrisoud.com';

const keywords = 'François Risoud, Risoud, full-stack, web, developer, quantum, physics, phd, music, sound design, art, digital art, portfolio';
const desc_search = 'François Risoud, full-stack web developer.';
const desc_social = 'François Risoud, full-stack web developer.';
const social_image = 'static/images/social/ekqnp.png';

module.exports = {
  meta: {
    // prevent phone number auto-detection (Safari iOS & Blackberry)
    'format-detection': 'telephone=no',
    httpEquiv: {
      'http-equiv': 'x-rim-auto-match',
      content: 'none'
    },

    // where it is hosted
    'whereami': 'netlify',


    // search engines
    'description': desc_search,
    'keywords': keywords,

    // google+
    googlePlusName: {
      itemprop: 'name',
      content: title,
    },
    googlePlusDescription: {
      itemprop: 'description',
      content: desc_social,
    },
    googlePlusImage: {
      itemprop: 'image',
      content: fullURL+'/'+social_image,
    },

    // twitter cards
    'twitter:card': 'summary_large_image',
    'twitter:site': '@ekqnp',
    'twitter:creator': '@ekqnp',
    'twitter:title': title,
    'twitter:description': desc_social,
    'twitter:image': fullURL+'/'+social_image,

    // Open Graph
    OpenGraphTitle: {
      property: 'og:title',
      content: title
    },
    OpenGraphType: {
      property: 'og:type',
      content: 'website'
    },
    OpenGraphUrl: {
      property: 'og:url',
      content: fullURL
    },
    OpenGraphImage: {
      property: 'og:image',
      content: fullURL+'/'+social_image
    },
    OpenGraphDescription: {
      property: 'og:description',
      content: desc_social
    },
    OpenGraphSite_name: {
      property: 'og:site_name',
      content: title
    },

  }
};
