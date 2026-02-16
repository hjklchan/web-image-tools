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
        { title: "YouTube Banner — 2560×1440", href: "/social/youtube-banner" },
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
<!-- search -->
<div class="border border-[#caa96a] bg-[#fffbe3] p-3 mb-3">
    <div class="text-xs font-bold opacity-90">Search</div>
    <div class="mt-2 flex items-stretch gap-2">
        <input
            class="retro-control w-auto flex-1 min-w-0"
            bind:value={q}
            placeholder="Type to filter… (crop / youtube / linkedin)"
            aria-label="search"
        />
        <button
            class="retro-btn retro-btn--secondary retro-btn--md shrink-0"
            type="button"
            on:click={() => (q = "")}
        >
            Clear
        </button>
    </div>
</div>
<section class="retro-paper retro-panel">
    <div class="retro-panel__body space-y-4">
        <!-- two simple columns -->
        <div class="grid gap-3 lg:grid-cols-2">
            <!-- tools -->
            <div
                class="border border-[#caa96a] bg-white shadow-[2px_2px_0_#b08d4a] p-3"
            >
                <div class="flex items-center gap-2">
                    <div class="font-black tracking-wide">Tools</div>
                    <a class="ml-auto retro-link text-sm" href="/tools">All →</a
                    >
                </div>
                <ul class="mt-3 space-y-2 text-sm">
                    {#each filteredTools as i (i.href)}
                        <li class="flex items-baseline gap-2">
                            <a class="retro-link font-bold" href={i.href}
                                >{i.title}</a
                            >
                            {#if i.desc}<span class="text-[11px] opacity-70"
                                    >{i.desc}</span
                                >{/if}
                        </li>
                    {/each}
                </ul>
            </div>

            <!-- social -->
            <div
                class="border border-[#caa96a] bg-white shadow-[2px_2px_0_#b08d4a] p-3"
            >
                <div class="flex items-center gap-2">
                    <div class="font-black tracking-wide">Social sizes</div>
                    <a class="ml-auto retro-link text-sm" href="/social"
                        >Directory →</a
                    >
                </div>
                <ul class="mt-3 list-disc pl-5 text-sm space-y-2">
                    {#each filteredSocial as i (i.href)}
                        <li>
                            <a class="retro-link" href={i.href}>{i.title}</a>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>

        <!-- links / sitemap / faq -->
        <div class="grid gap-3 lg:grid-cols-3">
            <!-- Friend links -->
            <div
                class="border border-[#caa96a] bg-white shadow-[2px_2px_0_#b08d4a] p-3"
            >
                <div class="font-black tracking-wide">Friend links</div>
                <ul class="mt-2 text-sm space-y-1">
                    <li class="opacity-70">Add yours later.</li>
                    <li>
                        <a
                            class="retro-link"
                            href="https://example.com"
                            rel="nofollow">example.com</a
                        >
                    </li>
                </ul>
            </div>

            <!-- Sitemap -->
            <div
                class="border border-[#caa96a] bg-white shadow-[2px_2px_0_#b08d4a] p-3"
            >
                <div class="font-black tracking-wide">Site map</div>
                <ul class="mt-2 text-sm space-y-1">
                    {#each links as i (i.href)}
                        <li>
                            <a class="retro-link" href={i.href}>{i.title}</a>
                        </li>
                    {/each}
                </ul>
            </div>

            <!-- FAQ -->
            <div
                class="border border-[#caa96a] bg-white shadow-[2px_2px_0_#b08d4a] p-3"
            >
                <div class="font-black tracking-wide">FAQ</div>
                <div class="mt-2 text-sm space-y-2 leading-relaxed">
                    <div>
                        <div class="font-bold">Do you upload images?</div>
                        <div class="opacity-80">
                            No. Processing runs in your browser.
                        </div>
                    </div>
                    <div>
                        <div class="font-bold">Is it free?</div>
                        <div class="opacity-80">
                            Yes for core tools. (You can add premium later.)
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-[11px] opacity-70">🐂🐎</div>
    </div>
</section>
