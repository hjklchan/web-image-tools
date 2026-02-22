// src/lib/config.ts
import { PUBLIC_DOMAIN, PUBLIC_TAG_LINE, PUBLIC_SITE_TITLE } from "$env/static/public";

type Config = {
  siteUrl: string;
  siteName: string;
  tagLine: string;
};

export const config: Config = {
  siteUrl: PUBLIC_DOMAIN,
  siteName: PUBLIC_SITE_TITLE,
  tagLine: PUBLIC_TAG_LINE,
};
