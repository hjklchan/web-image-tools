import { config } from "$lib/config";

export const prerender = true;

export const load = ({ url }) => ({
  meta: {
    title: 'Image Compressor — Compress JPG/PNG/WebP Online (Local & Fast)',
    description:
      'Compress JPG, PNG and WebP images locally in your browser. Reduce file size quickly with quality control — ideal for web, email and social media.',
    canonical: `${config.siteUrl}${url.pathname}`
  }
});