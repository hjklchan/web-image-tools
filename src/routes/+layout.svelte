<script lang="ts">
    import "./layout.css";
    import Header from "$lib/components/ui/Header.svelte";
    import Footer from "$lib/components/ui/Footer.svelte";

    let { children } = $props();
</script>

<div class="min-h-screen retro-bg flex flex-col">
    <Header />
    <main class="mx-auto w-full max-w-6xl px-3 py-4 flex-1">
        {@render children()}
    </main>
    <Footer />
</div>
