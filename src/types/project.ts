import type { CSSProperties } from 'vue';

declare global {
  /**
   * Project data and configuration.
   */
  interface Project {
    title: string;
    type: string;
    techInfos: string[];
    date?: string;
    imageUrl: string;
    smallImageUrl: string;
    url: string;
    bgColor: string;
    blendMode: CSSProperties['mix-blend-mode'];
  }
}
