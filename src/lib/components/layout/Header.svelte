<script lang="ts">
    import Marquee from "../Marquee.svelte";
    import { navs as nav } from "$lib/data/navs";
    import type { Snippet } from "svelte";

    type Props = {
        siteTitle?: Snippet | string;
        tagLine?: string;
    };

    let {
        siteTitle = "IMAZING",
        tagLine = "friendly :: no cookies ::",
    }: Props = $props();
    // export let siteTitle = SITE_TITLE;
    // export let tagline = TAG_LINE;

    // let q = $state("");
</script>

<header class="sticky top-0 z-30">
    <!-- Top strip -->
    <div class="retro-topbar">
        <div
            class="mx-auto max-w-7xl px-3 py-2 flex flex-wrap items-center gap-2"
        >
            <a href="/" class="retro-link font-black tracking-wide"
                >{siteTitle}</a
            >
            <span class="text-xs pt-1 opacity-90">{tagLine}</span>

            <!-- <div class="ml-auto flex flex-wrap items-center gap-2 text-xs">
                <span
                    class="px-2 py-0.5 bg-[#0e2746] border border-[#0b1f38] rounded-none"
                >
                    VISITORS: {visitors}
                </span>
                <a class="retro-link" href="/guestbook">Sign Guestbook</a>
            </div> -->
        </div>
    </div>

    <!-- Marquee -->
    <div class="border-b border-[#caa96a] bg-[#fff6c9]">
        <div class="mx-auto max-w-7xl px-3 py-1.5 text-sm">
            <Marquee />
        </div>
    </div>

    <!-- Nav + Search -->
    <div class="bg-[#fffbe3] border-b border-[#caa96a]">
        <div
            class="mx-auto max-w-7xl px-3 py-2 flex flex-wrap items-center gap-2"
        >
            <nav class="flex flex-wrap gap-3 text-sm">
                {#each nav as item}
                    <a class="retro-link" href={item.href}>{item.label}</a>
                {/each}
            </nav>

            <!-- <form
                class="ml-auto flex items-center gap-2"
                on:submit|preventDefault={() => {}}
            >
                <input
                    bind:value={q}
                    class="retro-control w-48 max-w-[60vw] py-1"
                    placeholder="search..."
                    aria-label="search"
                />
                <button
                    class="retro-btn retro-btn--primary retro-btn--sm"
                    type="submit">GO</button
                >
            </form> -->
        </div>
    </div>
</header>
