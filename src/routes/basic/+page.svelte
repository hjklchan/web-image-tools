<script lang="ts">
    import { tools, type Tool } from "$lib/data/tools";

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
            return "bg-retro-ok border border-retro-ok-border text-retro-ok-ink";
        if (b === "HOT")
            return "bg-retro-paper-light border border-retro-paper-border text-retro-warn-ink";
        return "bg-retro-sky border border-retro-sky-border text-retro-sky-ink";
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
            <span class="px-2 py-0.5 bg-white border border-retro-paper-border"
                >TOTAL: {tools.length}</span
            >
            <a class="retro-link" href="/tools">/tools</a>
        </div>
    </div> -->

    <div class="retro-panel__body space-y-3">
        <!-- Search row (input + button in ONE LINE) -->
        <form class="space-y-1" onsubmit={onSearchSubmit}>
            <div class="flex items-stretch gap-2">
                <input
                    class="retro-control flex-1 min-w-0"
                    bind:value={q}
                    placeholder="Search tools... (compress / exif / webp / batch)"
                    aria-label="search image tools"
                />

                <!-- <button
                    class="retro-btn retro-btn--primary retro-btn--md shrink-0"
                    type="submit"
                >
                    Search
                </button> -->

                <button
                    class="retro-btn retro-btn--secondary retro-btn--md shrink-0"
                    type="button"
                    onclick={() => (q = "")}
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
                    class="block border border-retro-paper-border bg-white rounded-none shadow-[2px_2px_0_var(--color-retro-paper-shadow)] p-3 hover:underline"
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
                                class="px-2 py-0.5 border border-retro-paper-border bg-retro-paper rounded-none"
                                >{tag}</span
                            >
                        {/each}
                    </div>

                    <!-- <div class="mt-3">
                        <span class="retro-btn retro-btn--primary retro-btn--sm"
                            >OPEN</span
                        >
                    </div> -->
                </a>
            {/each}
                <div class="flex justify-left items-end text-xs opacity-80">more tools in the future...</div>
        </div>
    </div>
</section>
