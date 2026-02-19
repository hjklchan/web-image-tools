export type Tool = {
    id: string;
    title: string;
    desc: string;
    href: string;
    tags: string[];
    badge?: "NEW" | "HOT" | "BETA";
};

export const tools: Tool[] = [
    {
        id: "compress",
        title: "Compress",
        desc: "Local JPG/PNG/WebP compression",
        href: "/basic/compressor",
        tags: ["local", "webp", "jpg", "png"],
    },
    {
        id: "resize",
        title: "Resize",
        desc: "Scale images, keep aspect ratio",
        href: "/basic/resize",
        tags: ["resize", "ratio", "scale"],
    },
    // {
    //     id: "convert",
    //     title: "Convert",
    //     desc: "Convert PNG ↔ JPG ↔ WebP (batch)",
    //     href: "/tools/images/convert",
    //     tags: ["batch", "convert"],
    // },
    {
        id: "crop",
        title: "Crop",
        desc: "Crop with free / fixed aspect",
        href: "/basic/crop",
        tags: ["crop", "aspect"],
    },
    // {
    //     id: "rotate",
    //     title: "Rotate",
    //     desc: "Rotate / flip / fix orientation",
    //     href: "/tools/images/rotate",
    //     tags: ["rotate", "flip"],
    // },
    {
        id: "watermark",
        title: "Watermark",
        desc: "Text / image watermark",
        href: "/basic/watermark",
        tags: ["watermark", "text"],
        badge: "BETA",
    },
    {
        id: "exif",
        title: "EXIF",
        desc: "View / remove metadata (privacy)",
        href: "/basic/exif",
        tags: ["exif", "privacy"],
    },
    // {
    //     id: "palette",
    //     title: "Palette",
    //     desc: "Extract a color palette",
    //     href: "/tools/images/palette",
    //     tags: ["color", "design"],
    // },
    // {
    //     id: "sprite",
    //     title: "Sprite",
    //     desc: "Build a sprite sheet + JSON map",
    //     href: "/tools/images/sprite",
    //     tags: ["sprite", "atlas", "json"],
    // },
];