<script lang="ts">
    import "./layout.css";
    import { config } from "$lib/config";
    import Header from "$lib/components/layout/Header.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";

    let { children } = $props();
</script>

<div class="min-h-screen retro-bg flex flex-col">
    <Header siteTitle={config.siteName} tagLine={config.tagLine} />
    <main class="mx-auto w-full max-w-7xl px-3 py-4 flex-1">
        {@render children()}
    </main>
    <Footer />
</div>
