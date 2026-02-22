import { config } from "$lib/config";

export const prerender = true;

export const load = ({ url }) => ({
  meta: {
    title: 'Image Cropper — Crop Photos Online (Free & Fixed Ratios)',
    description:
      'Crop images freely or with fixed aspect ratios (1:1, 4:3, 16:9, 9:16). Perfect for avatars, social posts, and thumbnails — fast and easy.',
    canonical: `${config.siteUrl}${url.pathname}`
  }
});