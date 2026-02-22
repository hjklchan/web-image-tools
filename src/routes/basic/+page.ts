export const prerender = true;

import { config } from "$lib/config";

export const load = ({ url }) => {
  return {
    meta: {
        title: 'Basic Image Tools — Compress, Resize, Crop & EXIF (Local)',
        description:
          'Free basic image tools that run locally in your browser: compress JPG/PNG/WebP, resize with aspect ratio, crop with fixed ratios, and view/remove EXIF metadata.',
        canonical: `${config.siteUrl}${url.pathname}`
      }
  };
};