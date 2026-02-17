<script lang="ts">
    type Item = { title: string; href: string; desc?: string };

    const tools: Item[] = [
        { title: "Crop", href: "/tools/images/crop", desc: "Free / ratio" },
        {
            title: "Compress",
            href: "/tools/images/compress",
            desc: "Smaller files",
        },
        {
            title: "Convert",
            href: "/tools/images/convert",
            desc: "PNG/JPG/WebP",
        },
        { title: "Resize", href: "/tools/images/resize", desc: "Exact pixels" },
    ];

    const social: Item[] = [
        { title: "YouTube Banner — 2560×1440", href: "/social-tools/yt-banner" },
        {
            title: "Instagram Story — 1080×1920",
            href: "/social/instagram-story",
        },
        { title: "LinkedIn Cover — 1584×396", href: "/social/linkedin-cover" },
    ];

    const links: Item[] = [
        { title: "All tools", href: "/tools" },
        { title: "Social presets", href: "/social" },
        { title: "Sitemap", href: "/sitemap.xml" },
    ];

    let q = "";
    $: qLower = q.trim().toLowerCase();
    $: filteredTools = !qLower
        ? tools
        : tools.filter((i) =>
              (i.title + " " + (i.desc ?? "")).toLowerCase().includes(qLower),
          );
    $: filteredSocial = !qLower
        ? social
        : social.filter((i) => i.title.toLowerCase().includes(qLower));
</script>

<section class="retro-paper retro-panel mb-3">
    <div class="retro-panel__body space-y-4">
        <div class="w-full text-center">
            <h1 class="text-5xl font-bold text-[#143a66]">IMA<span class="text-red-900">ZING</span></h1>
        </div>
    </div>
</section>
