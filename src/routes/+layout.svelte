<script lang="ts">
    import "./layout.css";
    import type { Snippet } from "svelte";

    type Props = { children: Snippet };
    let { children }: Props = $props();

    // 常见侧栏广告位宽度：160/300/320
    const sideAd = 300; // px
</script>

<div class="min-h-screen flex flex-col bg-zinc-100 text-zinc-900 font-mono">
    <!-- Header: full width + sticky -->
    <header class="sticky top-0 z-50 border-b border-zinc-300 bg-zinc-50">
        <div class="mx-auto max-w-400 px-3 sm:px-4">
            <div class="h-12 flex items-center justify-between gap-3">
                <a class="text-xl font-semibold" href="/">RetroSite</a>
            </div>
        </div>
    </header>

    <main class="flex-1">
        <div class="mx-auto max-w-400 px-3 sm:px-4 py-4">{@render children()}</div>
    </main>

    <!-- Footer: sticks to bottom via flex column -->
    <footer class="border-t border-zinc-300 bg-zinc-50">
        <div class="mx-auto max-w-400 px-3 sm:px-4">
            <div
                class="h-12 flex items-center justify-between text-xs text-zinc-700"
            >
                <div>© {new Date().getFullYear()} RetroSite</div>
                <div class="flex items-center gap-2">
                    <a
                        class="underline decoration-zinc-400 hover:decoration-zinc-900"
                        href="/privacy">Privacy</a
                    >
                    <span>·</span>
                    <a
                        class="underline decoration-zinc-400 hover:decoration-zinc-900"
                        href="/terms">Terms</a
                    >
                </div>
            </div>
        </div>
    </footer>
</div>
