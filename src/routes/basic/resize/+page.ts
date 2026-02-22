import { config } from "$lib/config";

export const prerender = true;

export const load = ({ url }) => ({
  meta: {
    title: 'Image Resizer — Resize Images Online (Keep Aspect Ratio)',
    description:
      'Resize images in seconds. Scale up or down while keeping aspect ratio, choose exact pixel size, and export to common formats for web or social.',
    canonical: `${config.siteUrl}${url.pathname}`
  }
});