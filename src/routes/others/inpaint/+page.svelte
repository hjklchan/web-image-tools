<script lang="ts">
    import Editor from "$lib/components/inpainting/Editor.svelte";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import { downloadModel } from "$lib/features/inpaint/adapter/cache";
    import { loadingOnnxruntime } from "$lib/features/inpaint/adapter/util";

    let file = $state<File | null>(null);
    let downloadProgress = $state(100);
    let error = $state("");

    $effect(() => {
        loadingOnnxruntime();
        downloadModel("inpaint", (p) => {
            downloadProgress = p;
        });
    });

    function onFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const selected = input.files?.[0];
        if (!selected) return;

        const valid = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/bmp",
        ].includes(selected.type);
        if (!valid) {
            error = "Only JPG / PNG / WebP / BMP supported";
            return;
        }

        file = selected;
        error = "";
        input.value = "";
    }
</script>

<PageHeader
    title="Image Inpaint"
    subtitle="AI-powered inpainting. Brush to mark area, model fills in locally."
/>

<div
    class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]"
>
    <!-- Left: Controls -->
    <aside
        class="retro-paper retro-panel flex max-h-[70vh] flex-col overflow-hidden lg:max-h-[80vh]"
    >
        <div class="retro-paper__head retro-panel__head shrink-0">
            <h2 class="font-bold tracking-wide">Controls</h2>
        </div>
        <div class="retro-panel__body min-h-0 flex-1 space-y-4 overflow-y-auto">
            <!-- Model status -->
            <section class="space-y-2">
                <span class="retro-field__label block">Model</span>
                {#if downloadProgress !== 100}
                    <div class="retro-field__hint text-red-700">
                        Downloading… {Math.round(downloadProgress)}%
                    </div>
                    <div class="retro-field__hint">
                        First-time setup. Model runs locally in your browser.
                    </div>
                {:else}
                    <div class="retro-field__hint text-green-700">
                        Model cached. Ready to use.
                    </div>
                {/if}
            </section>

            <!-- Upload -->
            <section class="space-y-2">
                <label for="inpaint-file" class="retro-field__label block"
                    >Select image</label
                >
                <input
                    id="inpaint-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/bmp"
                    class="retro-control mt-1"
                    onchange={onFileChange}
                    disabled={downloadProgress !== 100}
                    aria-label="Select image"
                />
                <div class="retro-field__hint">JPG, PNG, WebP, BMP</div>
            </section>

            {#if error}
                <div class="retro-notice retro-notice--warn">{error}</div>
            {/if}

            <div class="retro-field__hint text-xs">
                Tips: Brush areas to remove. Release to inpaint. Undo to revert.
            </div>

            <!-- Q&A -->
            <section class="space-y-2 border-t border-retro-paper-border pt-3 mt-2">
                <span class="retro-field__label block">Q&A</span>
                <details class="retro-field__hint text-xs">
                    <summary class="cursor-pointer font-medium">How much data does the model download use?</summary>
                    <p class="mt-1 pl-2 border-l-2 border-retro-sky-border">
                        About 30 MB. Downloaded once on first use and then cached locally in your browser.
                    </p>
                </details>
                <details class="retro-field__hint text-xs">
                    <summary class="cursor-pointer font-medium">Do I need to re-download the model every time?</summary>
                    <p class="mt-1 pl-2 border-l-2 border-retro-sky-border">
                        No. The model is stored in your browser (IndexedDB) and reused on future visits to this site.
                    </p>
                </details>
                <details class="retro-field__hint text-xs">
                    <summary class="cursor-pointer font-medium">Are my images uploaded to a server?</summary>
                    <p class="mt-1 pl-2 border-l-2 border-retro-sky-border">
                        No. The model and inference run entirely in your browser. Your images and masks never leave your device.
                    </p>
                </details>
                <details class="retro-field__hint text-xs">
                    <summary class="cursor-pointer font-medium">What happens if I clear browser data?</summary>
                    <p class="mt-1 pl-2 border-l-2 border-retro-sky-border">
                        Clearing site data or local storage removes the cached model. You will need to download it again next time.
                    </p>
                </details>
                <details class="retro-field__hint text-xs">
                    <summary class="cursor-pointer font-medium">Why is the first load slow?</summary>
                    <p class="mt-1 pl-2 border-l-2 border-retro-sky-border">
                        The first load downloads the ONNX Runtime and model. Duration depends on your connection. Use Wi‑Fi when possible.
                    </p>
                </details>
                <details class="retro-field__hint text-xs">
                    <summary class="cursor-pointer font-medium">What browsers or devices can use this?</summary>
                    <p class="mt-1 pl-2 border-l-2 border-retro-sky-border">
                        Modern desktop browsers (Chrome, Edge, Firefox, Safari) with JavaScript and WebAssembly enabled. Best experience on a PC or laptop with sufficient memory.
                    </p>
                </details>
                <details class="retro-field__hint text-xs">
                    <summary class="cursor-pointer font-medium">Does it work on mobile phones or tablets?</summary>
                    <p class="mt-1 pl-2 border-l-2 border-retro-sky-border">
                        Touch is supported, but inference is resource-heavy. It may run slowly or fail on low-memory devices. A desktop browser is recommended for reliable use.
                    </p>
                </details>
                <details class="retro-field__hint text-xs">
                    <summary class="cursor-pointer font-medium">What if my browser is not supported?</summary>
                    <p class="mt-1 pl-2 border-l-2 border-retro-sky-border">
                        You may see errors or slow or failed loads. Try a recent Chrome or Edge. Ensure JavaScript is enabled and you are not blocking WebAssembly or IndexedDB.
                    </p>
                </details>
                <details class="retro-field__hint text-xs">
                    <summary class="cursor-pointer font-medium">What features does my browser need?</summary>
                    <p class="mt-1 pl-2 border-l-2 border-retro-sky-border">
                        WebAssembly, IndexedDB (for model cache), and sufficient RAM. WebGPU is optional for faster inference; the tool falls back to WebAssembly if unavailable.
                    </p>
                </details>
            </section>
        </div>
    </aside>

    <!-- Right: History + Stage (when file) or placeholder -->
    {#if file}
        <div class="flex flex-col gap-4 min-w-0">
            <Editor {file} />
        </div>
    {:else}
        <section class="retro-sky retro-panel">
            <div class="retro-sky__head retro-panel__head">
                <h2 class="font-bold tracking-wide">Stage</h2>
            </div>
            <div class="retro-panel__body">
                <div
                    class="relative flex min-h-[320px] max-h-[70vh] w-full shrink-0 items-center justify-center overflow-hidden border border-dashed border-retro-sky-border bg-white p-4"
                >
                    <span class="retro-field__hint"
                        >Select an image to inpaint</span
                    >
                </div>
            </div>
        </section>
    {/if}
</div>
