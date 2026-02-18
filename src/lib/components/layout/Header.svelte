<script lang="ts">
    import Marquee from "../Marquee.svelte";
    import { navs as nav } from "$lib/data/navs";
    import type { Snippet } from "svelte";
    import { page } from "$app/state";

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

    function isActive(href: string) {
        return page.url.pathname === href;
    }
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
                    class="px-2 py-0.5 bg-retro-navy-border border border-retro-navy-dark rounded-none"
                >
                    VISITORS: {visitors}
                </span>
                <a class="retro-link" href="/guestbook">Sign Guestbook</a>
            </div> -->
        </div>
    </div>

    <!-- Marquee -->
    <div class="border-b border-retro-paper-border bg-retro-paper-light">
        <div class="mx-auto max-w-7xl px-3 py-1.5 text-sm">
            <Marquee />
        </div>
    </div>

    <!-- Nav + Search -->
    <div class="bg-retro-paper border-b border-retro-paper-border">
        <div
            class="mx-auto max-w-7xl px-3 py-2 flex flex-wrap items-center gap-2"
        >
            <nav class="flex flex-wrap gap-1 text-sm">
                {#each nav as item}
                    <a class={["retro-link", "px-1", isActive(item.href) ? "text-retro-navy font-bold": ""]} href={item.href}>{item.label}</a>
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
