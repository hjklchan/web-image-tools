import { config } from "$lib/config";

export const prerender = true;

export const load = ({ url }) => ({
  meta: {
    title: 'EXIF Viewer & Remover — Check or Remove Photo Metadata (Privacy)',
    description:
      'View photo metadata (EXIF) and remove it for privacy before sharing. See camera info, time, and other tags — then export a clean copy.',
    canonical: `${config.siteUrl}${url.pathname}`
  }
});