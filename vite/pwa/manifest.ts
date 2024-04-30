import type { ManifestOptions } from 'vite-plugin-pwa'

export default {
  name: 'François Risoud Portfolio',
  lang: 'en',
  short_name: 'François Risoud Portfolio',
  description: 'Portfolio of François Risoud, fullstack web developer',
  scope: '.',
  start_url: '/',
  display: 'standalone',
  orientation: 'any',
  theme_color: '#1a33ff',
  background_color: '#1a33ff',
  icons: [
    {
      src: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
  ],
} satisfies Partial<ManifestOptions>;
