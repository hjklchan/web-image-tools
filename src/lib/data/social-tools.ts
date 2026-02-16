export type Platform =
    | "All"
    | "Instagram"
    | "TikTok"
    | "YouTube"
    | "X"
    | "LinkedIn"
    | "Facebook";

export type Preset = {
    id: string;
    platform: Exclude<Platform, "All">;
    title: string; // e.g. "Story / 9:16"
    size: string; // e.g. "1080 × 1920"
    notes?: string; // safe area, crop notes, etc.
    tags: string[];
    href: string; // your tool route (resize/crop/export preset)
    badge?: "HOT" | "NEW" | "BETA";
};

// Presets are "rules/templates" that your browser tools can apply:
// e.g. open -> upload -> auto-crop/resize -> export.
export const presets: Preset[] = [
    // Instagram
    {
        id: "ig-post-portrait",
        platform: "Instagram",
        title: "Post (Portrait / Feed)",
        size: "1080 × 1350",
        notes: "Grid may crop to a vertical layout; keep key content centered.",
        tags: ["post", "feed", "4:5", "resize", "crop"],
        href: "/social-tools/ig-post-portrait",
    },
    {
        id: "ig-story",
        platform: "Instagram",
        title: "Story (9:16)",
        size: "1080 × 1920",
        notes: "Safe area: 1080 × 1610 (avoid UI overlays).",
        tags: ["story", "safe-area", "9:16", "export"],
        href: "/social-tools/ig-story",
    },
    {
        id: "ig-reel",
        platform: "Instagram",
        title: "Reel (Feed / 9:16)",
        size: "1080 × 1920",
        notes: "Grid preview often appears as 3:4 (1080 × 1440).",
        tags: ["reel", "9:16", "thumbnail", "grid"],
        href: "/social-tools/ig-reel",
    },

    // TikTok
    {
        id: "tt-video",
        platform: "TikTok",
        title: "Video / Carousel (9:16)",
        size: "1080 × 1920",
        notes: "Best fit for full-screen; other ratios may get letterboxed.",
        tags: ["tiktok", "9:16", "carousel", "resize"],
        href: "/social-tools/tt-video",
    },
    {
        id: "tt-profile",
        platform: "TikTok",
        title: "Profile Photo",
        size: "200 × 200",
        notes: "Upload larger for future-proofing; will display as a circle.",
        tags: ["avatar", "profile", "circle", "crop"],
        href: "/social-tools/tt-profile",
    },

    // YouTube
    {
        id: "yt-banner",
        platform: "YouTube",
        title: "Channel Banner",
        size: "2560 × 1440",
        notes: "Safe area (all devices): 1546 × 423 — keep text/logo inside.",
        tags: ["banner", "safe-area", "channel-art", "export"],
        href: "/social-tools/yt-banner",
    },
    {
        id: "yt-thumb",
        platform: "YouTube",
        title: "Video Thumbnail",
        size: "1280 × 720",
        notes: "16:9 recommended; keep main subject centered.",
        tags: ["thumbnail", "16:9", "youtube"],
        href: "/social-tools/yt-thumb",
    },

    // X (Twitter)
    {
        id: "x-header",
        platform: "X",
        title: "Header Photo",
        size: "1500 × 500",
        notes: "May crop ~60px top/bottom depending on browser/monitor.",
        tags: ["header", "cover", "crop"],
        href: "/social-tools/x-header",
    },
    {
        id: "x-post-landscape",
        platform: "X",
        title: "In-stream (Landscape)",
        size: "1280 × 720",
        notes: "Recommended ratios: 16:9 or 1:1.",
        tags: ["post", "16:9", "resize"],
        href: "/social-tools/x-post-landscape",
    },

    // LinkedIn
    {
        id: "li-cover",
        platform: "LinkedIn",
        title: "Profile Cover",
        size: "1584 × 396",
        notes: "Cropping differs on desktop/mobile — test both.",
        tags: ["cover", "profile", "crop"],
        href: "/social-tools/li-cover",
    },
    {
        id: "li-post-link",
        platform: "LinkedIn",
        title: "Post (Link Preview)",
        size: "1200 × 627",
        notes: "Great for URL shares.",
        tags: ["post", "link", "1.91:1", "resize"],
        href: "/social-tools/li-post-link",
    },

    // Facebook (simple basics)
    {
        id: "fb-cover",
        platform: "Facebook",
        title: "Cover Photo",
        size: "851 × 315",
        notes: "Displays differently on mobile/desktop; avoid bottom-left overlap.",
        tags: ["cover", "page", "crop"],
        href: "/social-tools/fb-cover",
    },
    {
        id: "fb-story",
        platform: "Facebook",
        title: "Story (9:16)",
        size: "1080 × 1920",
        notes: "Full-screen story format.",
        tags: ["story", "9:16", "export"],
        href: "/social-tools/fb-story",
    },
];

export const platforms: Platform[] = [
    "All",
    "Instagram",
    "TikTok",
    "YouTube",
    "X",
    "LinkedIn",
    "Facebook",
];