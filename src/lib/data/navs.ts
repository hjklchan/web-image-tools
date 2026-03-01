export type Nav = {
    label: string;
    href: string;
};

export const navs: Nav[] = [
    { label: "/root", href: "/" },
    { label: "/basic", href: "/basic" },
    { label: "/social-presets", href: "/social" },
    { label: "/basic-filters", href: "/filters/basic-filters" },
    { label: "/inpaint", href: "/others/inpaint" },
    { label: "/about.txt", href: "/about" },
    // { label: "/links", href: "/links" },
    // { label: "/archives", href: "/archives" },
    // { label: "/guestbook", href: "/guestbook" },
];