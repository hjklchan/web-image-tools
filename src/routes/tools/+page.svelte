<script lang="ts">
    type Tool = {
        id: string;
        title: string;
        desc: string;
        href: string;
        tags: string[];
        badge?: "NEW" | "HOT" | "BETA";
    };

    const tools: Tool[] = [
        {
            id: "compress",
            title: "Compress",
            desc: "Local JPG/PNG/WebP compression",
            href: "/tools/compressor",
            tags: ["local", "webp", "jpg", "png"],
            badge: "HOT",
        },
        {
            id: "convert",
            title: "Convert",
            desc: "Convert PNG ↔ JPG ↔ WebP (batch)",
            href: "/tools/images/convert",
            tags: ["batch", "convert"],
        },
        {
            id: "resize",
            title: "Resize",
            desc: "Scale images, keep aspect ratio",
            href: "/tools/images/resize",
            tags: ["resize", "ratio"],
        },
        {
            id: "crop",
            title: "Crop",
            desc: "Crop with free / fixed aspect",
            href: "/tools/images/crop",
            tags: ["crop", "aspect"],
        },
        {
            id: "rotate",
            title: "Rotate",
            desc: "Rotate / flip / fix orientation",
            href: "/tools/images/rotate",
            tags: ["rotate", "flip"],
        },
        {
            id: "watermark",
            title: "Watermark",
            desc: "Text / image watermark",
            href: "/tools/images/watermark",
            tags: ["watermark", "text"],
            badge: "BETA",
        },
        {
            id: "exif",
            title: "EXIF",
            desc: "View / remove metadata (privacy)",
            href: "/tools/images/exif",
            tags: ["exif", "privacy"],
        },
        {
            id: "palette",
            title: "Palette",
            desc: "Extract a color palette",
            href: "/tools/images/palette",
            tags: ["color", "design"],
            badge: "NEW",
        },
        {
            id: "sprite",
            title: "Sprite",
            desc: "Build a sprite sheet + JSON map",
            href: "/tools/images/sprite",
            tags: ["sprite", "atlas", "json"],
        },
    ];

    let q = "";

    $: filtered = tools.filter((t) => {
        const s = (
            t.title +
            " " +
            t.desc +
            " " +
            t.tags.join(" ")
        ).toLowerCase();
        return !q.trim() || s.includes(q.trim().toLowerCase());
    });

    function badgeClass(b?: Tool["badge"]) {
        if (!b) return "";
        if (b === "NEW")
            return "bg-[#ecfdf5] border border-[#86efac] text-[#064e3b]";
        if (b === "HOT")
            return "bg-[#fff6c9] border border-[#caa96a] text-[#3a2a0b]";
        return "bg-[#eef6ff] border border-[#7aa7d9] text-[#0b2a4a]";
    }

    function onSearchSubmit(e: SubmitEvent) {
        e.preventDefault();
        // no-op: reactive filtered already updates while typing
    }
</script>

<section class="retro-paper retro-panel">
    <!-- <div class="retro-paper__head retro-panel__head">
        <h1 class="font-black tracking-wide">Image Tools</h1>
        <span class="text-xs opacity-80">simple grid · local-first</span>

        <div class="ml-auto text-xs flex items-center gap-2">
            <span class="px-2 py-0.5 bg-white border border-[#caa96a]"
                >TOTAL: {tools.length}</span
            >
            <a class="retro-link" href="/tools">/tools</a>
        </div>
    </div> -->

    <div class="retro-panel__body space-y-3">
        <!-- Search row (input + button in ONE LINE) -->
        <form class="space-y-1" on:submit={onSearchSubmit}>
            <label class="retro-field__label">Search</label>

            <div class="flex items-stretch gap-2">
                <input
                    class="retro-control flex-1 min-w-0"
                    bind:value={q}
                    placeholder="Search tools... (compress / exif / webp / batch)"
                    aria-label="search image tools"
                />

                <button
                    class="retro-btn retro-btn--primary retro-btn--md shrink-0"
                    type="submit"
                >
                    Search
                </button>

                <button
                    class="retro-btn retro-btn--secondary retro-btn--md shrink-0"
                    type="button"
                    on:click={() => (q = "")}
                >
                    Clear
                </button>
            </div>

            <div class="text-[11px] opacity-70">
                Matches: {filtered.length}
            </div>
        </form>

        {#if filtered.length === 0}
            <div class="retro-notice retro-notice--warn">
                <span class="font-bold">No results.</span> Try another keyword.
            </div>
        {/if}

        <!-- 9-grid (responsive) -->
        <div class="grid gap-3 grid-cols-2 lg:grid-cols-3">
            {#each filtered as t (t.id)}
                <a
                    href={t.href}
                    class="block border border-[#caa96a] bg-white rounded-none shadow-[2px_2px_0_#b08d4a] p-3 hover:underline"
                >
                    <div class="flex items-start gap-2">
                        <div class="min-w-0">
                            <div class="font-black tracking-wide truncate">
                                {t.title}
                            </div>
                            <div class="text-xs opacity-80">{t.desc}</div>
                        </div>

                        {#if t.badge}
                            <span
                                class={"ml-auto text-[11px] px-2 py-0.5 rounded-none " +
                                    badgeClass(t.badge)}
                            >
                                {t.badge}
                            </span>
                        {/if}
                    </div>

                    <div class="mt-2 flex flex-wrap gap-1 text-[11px]">
                        {#each t.tags as tag}
                            <span
                                class="px-2 py-0.5 border border-[#caa96a] bg-[#fffbe3] rounded-none"
                                >{tag}</span
                            >
                        {/each}
                    </div>

                    <div class="mt-3">
                        <span class="retro-btn retro-btn--primary retro-btn--sm"
                            >OPEN</span
                        >
                    </div>
                </a>
            {/each}
        </div>
    </div>
</section>
