<script lang="ts">
    import { browser } from "$app/environment";
    import RetroImagePreview from "$lib/components/ui/RetroImagePreview.svelte";

    export type AspectOption = { label: string; value: string };

    export type CroppedResult = {
        blob: Blob;
        url: string; // object url
        mime: string;
        fileName: string; // original
        downloadName: string; // suggested download name
        width: number; // exported px
        height: number; // exported px
    };

    export type ImageCropperProps = {
        title?: string;
        subtitle?: string;

        accept?: string;
        allowedMimes?: string[];

        aspectOptions?: AspectOption[];
        defaultAspectValue?: string;

        previewHeight?: string; // e.g. "55vh" / "420px"
        previewMinHeight?: string; // e.g. "320px"

        showDownload?: boolean;
        preferOriginalMime?: boolean;

        outW?: number | null;
        outH?: number | null;

        onCropped?: (r: CroppedResult) => void;
        onError?: (message: string) => void;
    };

    // -------- $props() with defaults ----------
    const {
        title = "Image Crop",
        subtitle = "Crop with free or fixed aspect ratio",

        accept = "image/jpeg,image/png,image/webp,image/gif",
        allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"],

        aspectOptions = [
            { label: "Free", value: "" },
            { label: "1:1", value: "1" },
            { label: "16:9", value: "1.7777777778" },
            { label: "4:3", value: "1.3333333333" },
            { label: "3:2", value: "1.5" },
        ],
        defaultAspectValue = "",

        previewHeight = "55vh",
        previewMinHeight = "320px",

        showDownload = true,
        preferOriginalMime = true,

        outW = null,
        outH = null,

        onCropped = undefined,
        onError = undefined,
    }: ImageCropperProps = $props();

    // -------- state ----------
    let imgEl = $state<HTMLImageElement | null>(null);
    let imgSrc = $state("");
    let cropResultUrl = $state("");
    let error = $state("");
    let fileName = $state("");
    let originalMime = $state("image/png");
    let aspectValue = $derived(defaultAspectValue ?? "");

    // cropper runtime
    let cropper: any = null;
    let CropperClass: any = null;
    let cropperCssLoaded = false;

    function setErr(msg: string) {
        error = msg;
        onError?.(msg);
    }

    function parseAspect(v: string): number {
        if (!v) return NaN;
        const n = Number(v);
        return Number.isFinite(n) ? n : NaN;
    }

    function cleanupCropperOnly() {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }

    function cleanupUrls() {
        if (imgSrc) {
            URL.revokeObjectURL(imgSrc);
            imgSrc = "";
        }
        if (cropResultUrl) {
            URL.revokeObjectURL(cropResultUrl);
            cropResultUrl = "";
        }
    }

    function cleanupAll() {
        cleanupCropperOnly();
        cleanupUrls();
        fileName = "";
        originalMime = "image/png";
        error = "";
    }

    function extByMime(mime: string) {
        if (mime === "image/jpeg") return "jpg";
        if (mime === "image/webp") return "webp";
        return "png";
    }

    function exportMime() {
        if (
            preferOriginalMime &&
            ["image/jpeg", "image/png", "image/webp"].includes(originalMime)
        ) {
            return originalMime;
        }
        return "image/png";
    }

    function downloadNameFor(mime: string) {
        const base = (fileName || "image").replace(/\.[^.]+$/, "");
        return `${base}_cropped.${extByMime(mime)}`;
    }

    async function ensureCropperLoaded() {
        if (!browser) return;

        if (!CropperClass) {
            const mod = await import("cropperjs");
            CropperClass = mod.default;
        }

        // 推荐：全局在 src/app.css 里引一次：
        // @import "cropperjs/dist/cropper.css";
        // 如果不想全局引，就保留动态引入：
        if (!cropperCssLoaded) {
            await import("cropperjs/dist/cropper.css");
            cropperCssLoaded = true;
        }
    }

    function onFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const f = input.files?.[0];
        if (!f) return;

        if (!allowedMimes.includes(f.type)) {
            setErr("Only JPG, PNG, WebP, GIF supported");
            return;
        }

        cleanupAll();
        error = "";
        fileName = f.name;
        originalMime = f.type || "image/png";
        imgSrc = URL.createObjectURL(f);
        input.value = "";
    }

    function onAspectChange() {
        if (cropper) cropper.setAspectRatio(parseAspect(aspectValue));
    }

    function crop() {
        if (!cropper) return;

        const canvas: HTMLCanvasElement = cropper.getCroppedCanvas({
            width: outW ?? undefined,
            height: outH ?? undefined,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
        });

        if (!canvas) {
            setErr("Failed to crop: canvas not available");
            return;
        }

        const mime = exportMime();
        const quality = mime === "image/png" ? undefined : 0.95;

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    setErr("Failed to export: toBlob returned null");
                    return;
                }

                if (cropResultUrl) URL.revokeObjectURL(cropResultUrl);
                cropResultUrl = URL.createObjectURL(blob);

                const result: CroppedResult = {
                    blob,
                    url: cropResultUrl,
                    mime,
                    fileName,
                    downloadName: downloadNameFor(mime),
                    width: canvas.width,
                    height: canvas.height,
                };

                onCropped?.(result);
            },
            mime,
            quality,
        );
    }

    function download() {
        if (!cropResultUrl) return;
        const mime = exportMime();

        const a = document.createElement("a");
        a.href = cropResultUrl;
        a.download = downloadNameFor(mime);
        a.click();
    }

    // -------- effects ----------
    // Init/destroy cropper when image + element ready; reinit if aspect changes.
    $effect(() => {
        const src = imgSrc;
        const el = imgEl;
        const ar = aspectValue;

        if (!browser || !src || !el) return;

        let cancelled = false;

        (async () => {
            await ensureCropperLoaded();
            if (cancelled) return;

            cleanupCropperOnly();

            cropper = new CropperClass(el, {
                aspectRatio: parseAspect(ar),
                viewMode: 1,
                dragMode: "move",
                autoCrop: true,
                autoCropArea: 1,
                responsive: true,
                restore: false,
                background: false,
                modal: true,
                guides: false,
                center: true,
                highlight: false,
                toggleDragModeOnDblclick: false,
            });
        })();

        return () => {
            cancelled = true;
            cleanupCropperOnly();
        };
    });

    // Cleanup on unmount
    $effect(() => () => cleanupAll());
</script>

<section class="retro-paper retro-panel">
    <div class="retro-paper__head retro-panel__head">
        <h1 class="font-black tracking-wide">{title}</h1>
        <span class="text-xs opacity-80">{subtitle}</span>
    </div>

    <div class="retro-panel__body space-y-4">
        <div>
            <label for="crop-file" class="retro-field__label"
                >Select image</label
            >
            <input
                id="crop-file"
                type="file"
                {accept}
                class="retro-control mt-1"
                onchange={onFileChange}
                aria-label="Select image to crop"
            />
            <div class="retro-field__hint mt-1">
                JPG, PNG, WebP, GIF supported
            </div>
        </div>

        {#if error}
            <div class="retro-notice retro-notice--warn">
                <span class="font-bold">Error:</span>
                {error}
            </div>
        {/if}

        {#if imgSrc}
            <div class="flex flex-wrap items-end gap-4">
                <div class="shrink-0">
                    <label for="aspect-ratio" class="retro-field__label"
                        >Aspect ratio</label
                    >
                    <select
                        id="aspect-ratio"
                        class="retro-control mt-1"
                        bind:value={aspectValue}
                        onchange={onAspectChange}
                    >
                        {#each aspectOptions as opt}
                            <option value={opt.value}>{opt.label}</option>
                        {/each}
                    </select>
                </div>
                <div class="flex shrink-0 items-end gap-2">
                    <button
                        type="button"
                        class="retro-btn retro-btn--primary retro-btn--md"
                        onclick={crop}
                    >
                        Crop
                    </button>
                    {#if showDownload && cropResultUrl}
                        <button
                            type="button"
                            class="retro-btn retro-btn--secondary retro-btn--md"
                            onclick={download}
                        >
                            Download
                        </button>
                        <button
                            type="button"
                            class="retro-btn retro-btn--secondary retro-btn--md"
                            onclick={() => document.getElementById('tool-result')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            View result
                        </button>
                    {/if}
                </div>
                <span class="retro-field__hint mt-1">
                    {#if outW && outH}
                        Export size: <span class="font-bold">{outW}×{outH}</span
                        >
                    {:else}
                        Export size: <span class="font-bold"
                            >crop selection size</span
                        >
                    {/if}
                </span>
            </div>

            <!-- Fixed-height preview -->
            <div
                class="border border-retro-paper-border overflow-hidden bg-retro-canvas"
                style={`height:${previewHeight};min-height:${previewMinHeight};`}
            >
                <img
                    bind:this={imgEl}
                    src={imgSrc}
                    alt="Crop area"
                    class="block w-full h-full select-none"
                    style="object-fit: contain;"
                />
            </div>
        {/if}
    </div>
</section>

{#if cropResultUrl}
    <section id="tool-result" class="retro-paper retro-panel mt-4">
        <div class="retro-paper__head retro-panel__head">
            <h2 class="font-black tracking-wide">Cropped result</h2>
            <span class="text-xs opacity-80">
                {#if outW && outH}{outW}×{outH}{:else}
                    <!-- custom -->
                {/if}
            </span>
        </div>

        <div class="retro-panel__body">
            <RetroImagePreview
                src={cropResultUrl}
                alt="Cropped preview"
                caption={downloadNameFor(exportMime())}
                className="mb-3"
                compact={true}
            />
        </div>
    </section>
{/if}
