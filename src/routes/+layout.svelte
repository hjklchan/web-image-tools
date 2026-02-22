<script lang="ts">
    import "./layout.css";
    import { config } from "$lib/config";
    import Header from "$lib/components/layout/Header.svelte";
    import Footer from "$lib/components/layout/Footer.svelte";
    import { onMount } from "svelte";
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import { get } from "svelte/store";

    let { children } = $props();

    const meta = $derived($page.data?.meta ?? {});
    const title = $derived(() => meta.title ?? "Image Tools");
    const description = $derived(
        () => meta.description ?? "Fast, free, local image tools.",
    );
    const canonical = $derived(
        () => meta.canonical ?? config.siteUrl + $page.url.pathname,
    );
    const robots = $derived(() => meta.robots ?? "index,follow");

    function trackPageView(url: URL) {
        // gtag 只在浏览器端存在
        if (
            typeof window !== "undefined" &&
            typeof window.gtag === "function"
        ) {
            window.gtag("event", "page_view", {
                page_location: url.href,
                page_path: url.pathname + url.search,
                page_title: document.title,
            });
        }
    }

    onMount(() => {
        // 首次进入
        trackPageView(new URL(get(page).url));

        // 每次客户端路由跳转
        afterNavigate(({ to }) => {
            if (to?.url) trackPageView(to.url);
        });
    });
</script>

<svelte:head>
    <title>{title()}</title>
    <meta name="description" content={description()} />
    <link rel="canonical" href={canonical()} />
    <meta name="robots" content={robots()} />

    <meta property="og:title" content={title()} />
    <meta property="og:description" content={description()} />
    <meta property="og:url" content={canonical()} />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen retro-bg flex flex-col">
    <Header siteTitle={config.siteName} tagLine={config.tagLine} />
    <main class="mx-auto w-full max-w-7xl px-3 py-4 flex-1">
        {@render children()}
    </main>
    <Footer />
</div>
