// src/lib/config.ts
import { PUBLIC_TAG_LINE, PUBLIC_SITE_TITLE } from "$env/static/public";

type Config = {
  siteName: string;
  tagLine: string;
};

export const config: Config = {
  siteName: PUBLIC_SITE_TITLE,
  tagLine: PUBLIC_TAG_LINE,
};
