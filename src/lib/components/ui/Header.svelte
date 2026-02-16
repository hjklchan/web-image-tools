<script lang="ts">
    export let visitors = "000042";
    export let siteTitle = "IMAZING";
    export let tagline = ":: 56k-friendly :: no cookies :: human-made ::";
    export let nav: Array<{ label: string; href: string }> = [
        { label: "/home", href: "/" },
        // { label: "/about.txt", href: "/about" },
        // { label: "/links", href: "/links" },
        // { label: "/archives", href: "/archives" },
        // { label: "/guestbook", href: "/guestbook" },
    ];

    let q = "";
</script>

<header class="sticky top-0 z-30">
    <div class="retro-topbar">
        <div
            class="mx-auto max-w-6xl px-3 py-2 flex flex-wrap items-center gap-2"
        >
            <a href="/" class="retro-link font-black tracking-wide"
                >{siteTitle}</a
            >
            <span class="text-xs opacity-90">{tagline}</span>

            <div class="ml-auto flex flex-wrap items-center gap-2 text-xs">
                <span
                    class="px-2 py-0.5 bg-[#0e2746] border border-[#0b1f38] rounded-none"
                >
                    VISITORS: {visitors}
                </span>
                <a class="retro-link" href="/guestbook">Sign Guestbook</a>
            </div>
        </div>
    </div>

    <div class="border-b border-[#caa96a] bg-[#fff6c9]">
        <div class="mx-auto max-w-6xl px-3 py-1.5 text-sm">
            <marquee behavior="scroll" direction="left" scrollamount="5">
                ★ Welcome ★ Links updated ★ New tools & textfiles ★ Keep the web
                small, keep it human ★
            </marquee>
        </div>
    </div>

    <div class="bg-[#fffbe3] border-b border-[#caa96a]">
        <div
            class="mx-auto max-w-6xl px-3 py-2 flex flex-wrap items-center gap-2"
        >
            <nav class="flex flex-wrap gap-3 text-sm">
                {#each nav as item}
                    <a class="retro-link" href={item.href}>{item.label}</a>
                {/each}
            </nav>

            <form
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
            </form>
        </div>
    </div>
</header>
