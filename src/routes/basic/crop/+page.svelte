<script lang="ts">
    import { onDestroy } from "svelte";
    import Cropper from "cropperjs";
    import "cropperjs/dist/cropper.css";
    import RetroImagePreview from "$lib/components/ui/RetroImagePreview.svelte";

    type AspectOption = { label: string; value: string };

    const ASPECT_OPTIONS: AspectOption[] = [
        { label: "Free", value: "" },
        { label: "1:1", value: "1" },
        { label: "16:9", value: "1.778" },
        { label: "4:3", value: "1.333" },
        { label: "3:2", value: "1.5" },
    ];

    let imgEl: HTMLImageElement;
    let imgSrc = "";
    let cropper: Cropper | null = null;
    let aspectValue = "";
    let cropResultUrl = "";
    let error = "";
    let fileName = "";
    let originalMime = "image/png";

    function parseAspect(v: string): number {
        if (!v) return NaN;
        const n = Number(v);
        return Number.isFinite(n) ? n : NaN;
    }

    function onFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        if (
            !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
                file.type,
            )
        ) {
            error = "Only JPG, PNG, WebP, GIF supported";
            return;
        }

        cleanup();
        error = "";
        fileName = file.name;
        originalMime = file.type || "image/png";
        imgSrc = URL.createObjectURL(file);
        cropResultUrl = "";
        input.value = "";
    }

    function cleanup() {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        if (imgSrc) {
            URL.revokeObjectURL(imgSrc);
            imgSrc = "";
        }
        if (cropResultUrl) {
            URL.revokeObjectURL(cropResultUrl);
            cropResultUrl = "";
        }
        fileName = "";
    }

    function onImageLoad() {
        if (!imgEl) return;
        if (cropper) cropper.destroy();
        cropper = new Cropper(imgEl, {
            aspectRatio: parseAspect(aspectValue),
            viewMode: 1,
            dragMode: "move",
            autoCrop: true,
            responsive: true,
            restore: false,
        });
    }

    function onAspectChange() {
        if (cropper) cropper.setAspectRatio(parseAspect(aspectValue));
    }

    function crop() {
        if (!cropper) return;

        const canvas = cropper.getCroppedCanvas({
            imageSmoothingQuality: "high",
        });
        if (!canvas) return;

        const mime = ["image/jpeg", "image/png", "image/webp"].includes(
            originalMime,
        )
            ? originalMime
            : "image/png";
        const quality = mime === "image/png" ? undefined : 0.95;

        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                if (cropResultUrl) URL.revokeObjectURL(cropResultUrl);
                cropResultUrl = URL.createObjectURL(blob);
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

    onDestroy(cleanup);
</script>

<div class="space-y-4">
    <a href="/tools" class="retro-link text-sm">← Back to tools</a>

    <section class="retro-paper retro-panel">
        <div class="retro-paper__head retro-panel__head">
            <h1 class="font-black tracking-wide">Image Crop</h1>
            <span class="text-xs opacity-80"
                >Crop with free or fixed aspect ratio</span
            >
        </div>

        <div class="retro-panel__body space-y-4">
            <!-- File selection -->
            <div>
                <label for="crop-file" class="retro-field__label"
                    >Select image</label
                >
                <input
                    id="crop-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
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
                <!-- Aspect ratio -->
                <div>
                    <label for="aspect-ratio" class="retro-field__label"
                        >Aspect ratio</label
                    >
                    <select
                        id="aspect-ratio"
                        class="retro-control mt-1"
                        bind:value={aspectValue}
                        onchange={onAspectChange}
                    >
                        {#each ASPECT_OPTIONS as opt}
                            <option value={opt.value}>{opt.label}</option>
                        {/each}
                    </select>
                </div>

                <!-- Cropper container: Cropper.js needs a visible block wrapper -->
                <div
                    class="border border-[#caa96a] overflow-hidden bg-[#1b1b1b]"
                    style="height: 400px;"
                >
                    <img
                        bind:this={imgEl}
                        src={imgSrc}
                        alt="Crop area"
                        class="block max-w-full"
                        style="max-height: 400px;"
                        onload={onImageLoad}
                    />
                </div>

                <div class="flex flex-wrap items-end gap-2">
                    <button
                        type="button"
                        class="retro-btn retro-btn--primary retro-btn--md"
                        onclick={crop}
                    >
                        Crop
                    </button>
                    {#if cropResultUrl}
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

    <!-- Result -->
    {#if cropResultUrl}
        <section id="tool-result" class="retro-paper retro-panel">
            <div class="retro-paper__head retro-panel__head">
                <h2 class="font-black tracking-wide">Cropped result</h2>
            </div>
            <div class="retro-panel__body">
                <RetroImagePreview
                    src={cropResultUrl}
                    alt="Cropped preview"
                    caption={fileName
                        ? fileName.replace(/\.[^.]+$/, "") +
                          "_cropped" +
                          (originalMime === "image/jpeg"
                              ? ".jpg"
                              : originalMime === "image/webp"
                                ? ".webp"
                                : ".png")
                        : null}
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
