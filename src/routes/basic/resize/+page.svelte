<script lang="ts">
    import { onDestroy } from "svelte";
    import RetroImagePreview from "$lib/components/ui/RetroImagePreview.svelte";

    let file: File | null = null;
    let previewUrl = "";
    let resultUrl = "";
    let error = "";
    let fileName = "";
    let originalMime = "image/png";

    let targetW = 800;
    let targetH = 600;
    let keepAspect = true;
    let originalW = 0;
    let originalH = 0;
    let resizing = false;

    function onFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const f = input.files?.[0];
        if (!f) return;

        if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type)) {
            error = "JPG, PNG, WebP, GIF supported";
            input.value = "";
            return;
        }

        cleanup();
        file = f;
        fileName = f.name;
        originalMime = f.type || "image/png";
        previewUrl = URL.createObjectURL(f);
        error = "";

        const img = new Image();
        img.onload = () => {
            originalW = img.naturalWidth;
            originalH = img.naturalHeight;
            if (keepAspect) {
                const ratio = Math.min(targetW / originalW, targetH / originalH);
                targetW = Math.round(originalW * ratio);
                targetH = Math.round(originalH * ratio);
            } else {
                targetW = originalW;
                targetH = originalH;
            }
        };
        img.src = previewUrl;
        input.value = "";
    }

    function cleanup() {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        previewUrl = "";
        resultUrl = "";
        file = null;
    }

    function resize() {
        if (!file || !previewUrl) return;

        resizing = true;
        error = "";

        const img = new Image();
        img.onload = () => {
            let outW = targetW;
            let outH = targetH;

            if (keepAspect) {
                const ratio = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
                outW = Math.round(img.naturalWidth * ratio);
                outH = Math.round(img.naturalHeight * ratio);
            }

            const canvas = document.createElement("canvas");
            canvas.width = outW;
            canvas.height = outH;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                error = "Canvas not supported";
                resizing = false;
                return;
            }
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, outW, outH);

            const mime = ["image/jpeg", "image/png", "image/webp"].includes(originalMime)
                ? originalMime
                : "image/png";
            const quality = mime === "image/png" ? undefined : 0.95;

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        error = "Failed to export";
                        return;
                    }
                    if (resultUrl) URL.revokeObjectURL(resultUrl);
                    resultUrl = URL.createObjectURL(blob);
                    resizing = false;
                },
                mime,
                quality,
            );
        };
        img.onerror = () => {
            error = "Failed to load image";
            resizing = false;
        };
        img.src = previewUrl;
    }

    function download() {
        if (!resultUrl || !file) return;
        const ext = originalMime === "image/jpeg" ? ".jpg" : originalMime === "image/webp" ? ".webp" : ".png";
        const a = document.createElement("a");
        a.href = resultUrl;
        a.download = file.name.replace(/\.[^.]+$/, "") + "_resized" + ext;
        a.click();
    }

    onDestroy(cleanup);
</script>

<div class="space-y-4">
    <a href="/basic" class="retro-link text-sm">← Back</a>

    <section class="retro-paper retro-panel">
        <div class="retro-paper__head retro-panel__head">
            <h1 class="font-black tracking-wide">Image Resize</h1>
            <span class="text-xs opacity-80">Scale images, optional keep aspect ratio</span>
        </div>

        <div class="retro-panel__body space-y-4">
            <div>
                <label for="resize-file" class="retro-field__label">Select image</label>
                <input
                    id="resize-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    class="retro-control mt-1"
                    onchange={onFileChange}
                    aria-label="Select image to resize"
                />
                <div class="retro-field__hint mt-1">
                    JPG, PNG, WebP, GIF supported
                </div>
            </div>

            {#if error}
                <div class="retro-notice retro-notice--warn">
                    <span class="font-bold">Error:</span> {error}
                </div>
            {/if}

            {#if file && previewUrl}
                {#if originalW > 0}
                    <div class="text-xs opacity-80">Original: {originalW} × {originalH}</div>
                {/if}

                <div class="flex flex-wrap items-end gap-4">
                    <div>
                        <label for="target-w" class="retro-field__label">Width (px)</label>
                        <input
                            id="target-w"
                            type="number"
                            min="1"
                            max="8192"
                            class="retro-control mt-1 w-24"
                            bind:value={targetW}
                        />
                    </div>
                    <div>
                        <label for="target-h" class="retro-field__label">Height (px)</label>
                        <input
                            id="target-h"
                            type="number"
                            min="1"
                            max="8192"
                            class="retro-control mt-1 w-24"
                            bind:value={targetH}
                        />
                    </div>
                    <div class="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="keep-aspect"
                            class="retro-checkbox"
                            bind:checked={keepAspect}
                        />
                        <label for="keep-aspect" class="text-sm">Keep aspect ratio (fit within)</label>
                    </div>
                </div>
                <div class="retro-field__hint">
                    {#if keepAspect}
                        Image will scale to fit within {targetW}×{targetH}, preserving aspect ratio.
                    {:else}
                        Image will be stretched to exact {targetW}×{targetH}.
                    {/if}
                </div>

                <div class="flex flex-wrap items-end gap-2">
                    <button
                        type="button"
                        class="retro-btn retro-btn--primary retro-btn--md"
                        onclick={resize}
                        disabled={resizing}
                    >
                        {resizing ? "Resizing…" : "Resize"}
                    </button>
                    {#if resultUrl}
                        <button
                            type="button"
                            class="retro-btn retro-btn--secondary retro-btn--md"
                            onclick={() => document.getElementById('tool-result')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            View result
                        </button>
                    {/if}
                </div>
            {/if}
        </div>
    </section>

    {#if resultUrl}
        <section id="tool-result" class="retro-paper retro-panel">
            <div class="retro-paper__head retro-panel__head">
                <h2 class="font-black tracking-wide">Resized result</h2>
                <span class="text-xs opacity-80">{targetW} × {targetH}</span>
            </div>
            <div class="retro-panel__body">
                <RetroImagePreview
                    src={resultUrl}
                    alt="Resized preview"
                    caption={fileName ? fileName.replace(/\.[^.]+$/, "") + "_resized" + (originalMime === "image/jpeg" ? ".jpg" : originalMime === "image/webp" ? ".webp" : ".png") : null}
                    className="mb-3"
                    compact={true}
                />
                <button
                    type="button"
                    class="retro-btn retro-btn--primary retro-btn--md"
                    onclick={download}
                >
                    Download
                </button>
            </div>
        </section>
    {/if}
</div>
