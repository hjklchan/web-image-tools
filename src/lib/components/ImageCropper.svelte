<script module>
    export type AspectOption = { label: string; value: string };

    export type CropperResult = {
        blob: Blob;
        url: string;
        mime: string;
        fileName: string;
    };
</script>

<script lang="ts">
    import { onDestroy, createEventDispatcher } from "svelte";
    import { browser } from "$app/environment";
    import RetroImagePreview from "$lib/components/ui/RetroImagePreview.svelte";

    // ===== Props =====
    export let title = "Image Crop";
    export let subtitle = "Crop with free or fixed aspect ratio";

    export let accept = "image/jpeg,image/png,image/webp,image/gif";
    export let allowedMimes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    ];

    export let aspectOptions: AspectOption[] = [
        { label: "Free", value: "" },
        { label: "1:1", value: "1" },
        { label: "16:9", value: "1.778" },
        { label: "4:3", value: "1.333" },
        { label: "3:2", value: "1.5" },
    ];

    export let defaultAspectValue = ""; // e.g. "1.778"
    export let previewHeight: string = "55vh"; // e.g. "400px" or "55vh"
    export let previewMinHeight: string = "320px";

    export let showDownload = true;
    export let autoDestroyObjectUrls = true;

    // 你现有逻辑：导出 mime 默认跟原图一致（只允许 jpg/png/webp）
    export let preferOriginalMime = true;

    // ===== State =====
    let imgEl: HTMLImageElement;
    let imgSrc = "";
    let cropResultUrl = "";
    let error = "";
    let fileName = "";
    let originalMime = "image/png";
    let aspectValue = defaultAspectValue;

    // Cropper.js SSR 安全加载
    let CropperClass: any = null;
    let cropper: any = null;

    const dispatch = createEventDispatcher<{ cropped: CropperResult }>();

    function parseAspect(v: string): number {
        if (!v) return NaN;
        const n = Number(v);
        return Number.isFinite(n) ? n : NaN;
    }

    async function ensureCropper() {
        if (!browser) return;
        if (CropperClass) return;
        const mod = await import("cropperjs");
        CropperClass = mod.default;
        // 建议把 cropper.css 放到全局 app.css（见下方说明），
        // 但这里也可动态加载（仅浏览器）
        await import("cropperjs/dist/cropper.css");
    }

    function cleanupCropperOnly() {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }

    function cleanupAll() {
        cleanupCropperOnly();
        if (autoDestroyObjectUrls) {
            if (imgSrc) URL.revokeObjectURL(imgSrc);
            if (cropResultUrl) URL.revokeObjectURL(cropResultUrl);
        }
        imgSrc = "";
        cropResultUrl = "";
        fileName = "";
        error = "";
    }

    function onFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        if (!allowedMimes.includes(file.type)) {
            error = "Only JPG, PNG, WebP, GIF supported";
            return;
        }

        cleanupAll();
        error = "";
        fileName = file.name;
        originalMime = file.type || "image/png";
        imgSrc = URL.createObjectURL(file);
        input.value = "";
    }

    async function onImageLoad() {
        if (!imgEl) return;
        await ensureCropper();

        cleanupCropperOnly();

        cropper = new CropperClass(imgEl, {
            aspectRatio: parseAspect(aspectValue),
            viewMode: 1,
            dragMode: "move",
            autoCrop: true,
            responsive: true,
            restore: false,
            background: false,
            modal: true,
            guides: false,
            center: true,
            highlight: false,
            toggleDragModeOnDblclick: false,
        });
    }

    function onAspectChange() {
        if (cropper) cropper.setAspectRatio(parseAspect(aspectValue));
    }

    function crop() {
        if (!cropper) return;

        const canvas: HTMLCanvasElement = cropper.getCroppedCanvas({
            imageSmoothingQuality: "high",
        });
        if (!canvas) return;

        const mime =
            preferOriginalMime &&
            ["image/jpeg", "image/png", "image/webp"].includes(originalMime)
                ? originalMime
                : "image/png";

        const quality = mime === "image/png" ? undefined : 0.95;

        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                if (autoDestroyObjectUrls && cropResultUrl)
                    URL.revokeObjectURL(cropResultUrl);
                cropResultUrl = URL.createObjectURL(blob);

                dispatch("cropped", {
                    blob,
                    url: cropResultUrl,
                    mime,
                    fileName,
                });
            },
            mime,
            quality,
        );
    }

    function download() {
        if (!cropResultUrl) return;

        const ext =
            originalMime === "image/jpeg"
                ? ".jpg"
                : originalMime === "image/webp"
                  ? ".webp"
                  : ".png";

        const a = document.createElement("a");
        a.href = cropResultUrl;
        a.download = fileName.replace(/\.[^.]+$/, "") + "_cropped" + ext;
        a.click();
    }

    onDestroy(cleanupAll);
</script>

<section class="retro-paper retro-panel">
    <div class="retro-paper__head retro-panel__head">
        <h1 class="font-black tracking-wide">{title}</h1>
        <span class="text-xs opacity-80">{subtitle}</span>
    </div>

    <div class="retro-panel__body space-y-4">
        <!-- File selection -->
        <div>
            <label class="retro-field__label">Select image</label>
            <input
                type="file"
                {accept}
                class="retro-control mt-1"
                on:change={onFileChange}
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
            <!-- Aspect ratio -->
            <div>
                <label class="retro-field__label">Aspect ratio</label>
                <select
                    class="retro-control mt-1"
                    bind:value={aspectValue}
                    on:change={onAspectChange}
                >
                    {#each aspectOptions as opt}
                        <option value={opt.value}>{opt.label}</option>
                    {/each}
                </select>
            </div>

            <!-- Preview: fixed vh/px height -->
            <div
                class="border border-[#caa96a] overflow-hidden bg-[#1b1b1b]"
                style={`height:${previewHeight};min-height:${previewMinHeight};`}
            >
                <img
                    bind:this={imgEl}
                    src={imgSrc}
                    alt="Crop area"
                    class="block w-full h-full"
                    style="object-fit: contain;"
                    on:load={onImageLoad}
                />
            </div>

            <div class="flex flex-wrap gap-2">
                <button
                    type="button"
                    class="retro-btn retro-btn--primary retro-btn--md"
                    on:click={crop}
                >
                    Crop
                </button>
            </div>
        {/if}
    </div>
</section>

{#if cropResultUrl}
    <section class="retro-paper retro-panel mt-4">
        <div class="retro-paper__head retro-panel__head">
            <h2 class="font-black tracking-wide">Cropped result</h2>
        </div>
        <div class="retro-panel__body">
            <RetroImagePreview
                src={cropResultUrl}
                alt="Cropped preview"
                caption={fileName
                    ? fileName.replace(/\.[^.]+$/, "") + "_cropped"
                    : null}
                className="mb-3"
            />
            {#if showDownload}
                <button
                    type="button"
                    class="retro-btn retro-btn--primary retro-btn--md"
                    on:click={download}
                >
                    Download
                </button>
            {/if}
        </div>
    </section>
{/if}
