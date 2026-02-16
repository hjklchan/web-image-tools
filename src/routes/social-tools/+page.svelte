<script lang="ts">
    import {
        platforms,
        presets,
        type Platform,
        type Preset,
    } from "$lib/data/social-tools";

    let q = "";
    let active: Platform = "All";

    $: filtered = presets.filter((p) => {
        const matchesPlatform = active === "All" ? true : p.platform === active;
        const hay = (
            p.platform +
            " " +
            p.title +
            " " +
            p.size +
            " " +
            (p.notes ?? "") +
            " " +
            p.tags.join(" ")
        ).toLowerCase();
        const matchesQ = !q.trim() || hay.includes(q.trim().toLowerCase());
        return matchesPlatform && matchesQ;
    });

    function badgeClass(b?: Preset["badge"]) {
        if (!b) return "";
        if (b === "HOT")
            return "bg-[#fff6c9] border border-[#caa96a] text-[#3a2a0b]";
        if (b === "NEW")
            return "bg-[#ecfdf5] border border-[#86efac] text-[#064e3b]";
        return "bg-[#eef6ff] border border-[#7aa7d9] text-[#0b2a4a]";
    }
</script>

<section class="retro-paper retro-panel">
    <div class="retro-panel__body space-y-3">
        <div class="retro-notice retro-notice--info">
            <span class="font-bold">Note:</span>
            These tools run in the <span class="font-bold">browser</span> (no server
            upload). Pick a platform preset, upload an image, then export.
        </div>

        <!-- Search + Platform filter (one row) -->
        <form class="space-y-1" on:submit|preventDefault={() => {}}>
            <div class="flex items-stretch gap-2">
                <input
                    class="retro-control w-auto flex-1 min-w-0"
                    bind:value={q}
                    placeholder="Search presets… (story / banner / 9:16 / cover / safe area …)"
                    aria-label="search social presets"
                />

                <select
                    class="retro-control flex-1 w-36 shrink-0"
                    bind:value={active}
                    aria-label="platform filter"
                >
                    {#each platforms as p}
                        <option value={p}>{p}</option>
                    {/each}
                </select>

                <button
                    class="retro-btn retro-btn--secondary retro-btn--md shrink-0"
                    type="button"
                    on:click={() => (q = "")}
                >
                    Clear
                </button>
            </div>

            <div class="text-[11px] opacity-70">Matches: {filtered.length}</div>
        </form>

        {#if filtered.length === 0}
            <div class="retro-notice retro-notice--warn">
                <span class="font-bold">No results.</span> Try another keyword or
                switch platform.
            </div>
        {/if}

        <!-- 9-grid style cards -->
        <div class="grid gap-3 grid-cols-2 lg:grid-cols-3">
            {#each filtered as p (p.id)}
                <a
                    href={p.href}
                    class="block border border-[#caa96a] bg-white rounded-none shadow-[2px_2px_0_#b08d4a] p-3 hover:underline"
                >
                    <div class="flex items-start gap-2">
                        <div class="min-w-0">
                            <div class="font-black tracking-wide truncate">
                                {p.platform} · {p.title}
                            </div>
                            <div class="text-xs opacity-80">{p.size}</div>
                        </div>

                        {#if p.badge}
                            <span
                                class={"ml-auto text-[11px] px-2 py-0.5 rounded-none " +
                                    badgeClass(p.badge)}
                            >
                                {p.badge}
                            </span>
                        {/if}
                    </div>

                    {#if p.notes}
                        <div class="mt-2 text-xs opacity-90 leading-relaxed">
                            {p.notes}
                        </div>
                    {/if}

                    <div class="mt-2 flex flex-wrap gap-1 text-[11px]">
                        {#each p.tags as t}
                            <span
                                class="px-2 py-0.5 border border-[#caa96a] bg-[#fffbe3] rounded-none"
                                >{t}</span
                            >
                        {/each}
                    </div>
                </a>
            {/each}
        </div>

        <div class="text-[11px] opacity-70">
            Sizes based on a 2026 social image size guide; some platforms crop
            differently across devices—always preview on target platform.
        </div>
    </div>
</section>
