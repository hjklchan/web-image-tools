<script lang="ts">
    export let copyright = "© 1998–2026 imazing.work";
    export let links: Array<{ label: string; href: string }> = [
        // { label: "contact", href: "/contact" },
        // { label: "privacy", href: "/privacy" },
        // { label: "mirror", href: "/mirror" },
    ];
    export let note: string | null = "made by ★hjkl1★";
</script>

<footer class="mt-auto border-t border-retro-navy-border bg-retro-navy text-retro-cream">
    <div
        class="mx-auto max-w-7xl px-3 py-3 text-xs flex flex-wrap items-center gap-2"
    >
        <span>{copyright}</span>
        <span class="opacity-80">|</span>
        {#each links as l}
            <a class="retro-link" href={l.href}>{l.label}</a>
        {/each}
        {#if note}
            <span class="ml-auto opacity-90">{note}</span>
        {/if}
    </div>
</footer>
