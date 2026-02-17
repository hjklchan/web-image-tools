<script lang="ts">
    import { onDestroy } from "svelte";
    import exifr from "exifr";
    import RetroImagePreview from "$lib/components/ui/RetroImagePreview.svelte";

    let file: File | null = null;
    let previewUrl = "";
    let exifData: Record<string, unknown> | null = null;
    let loading = false;
    let error = "";
    let strippedUrl = "";
    let stripping = false;

    const EXIF_ORDER = [
        "Make",
        "Model",
        "Software",
        "DateTimeOriginal",
        "CreateDate",
        "ModifyDate",
        "ExposureTime",
        "FNumber",
        "ISO",
        "FocalLength",
        "ExposureCompensation",
        "Flash",
        "WhiteBalance",
        "ImageWidth",
        "ImageHeight",
        "Orientation",
        "latitude",
        "longitude",
        "GPSLatitude",
        "GPSLongitude",
    ];

    function formatValue(v: unknown): string {
        if (v === null || v === undefined) return "-";
        if (v instanceof Date) return v.toISOString();
        if (Array.isArray(v)) return v.join(", ");
        if (typeof v === "object") return JSON.stringify(v);
        return String(v);
    }

    async function onFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const f = input.files?.[0];
        if (!f) return;

        reset();
        file = f;

        if (
            ![
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/heic",
                "image/avif",
                "image/tiff",
            ].includes(f.type)
        ) {
            error = "JPG, PNG, WebP, HEIC, AVIF, TIFF supported";
            input.value = "";
            return;
        }

        loading = true;
        error = "";
        previewUrl = URL.createObjectURL(f);

        try {
            const data = await exifr.parse(f, true);
            exifData = data ? (data as Record<string, unknown>) : null;
        } catch (err) {
            exifData = null;
            error = err instanceof Error ? err.message : "Failed to parse EXIF";
        } finally {
            loading = false;
        }
        input.value = "";
    }

    function reset() {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (strippedUrl) URL.revokeObjectURL(strippedUrl);
        previewUrl = "";
        strippedUrl = "";
        exifData = null;
        file = null;
        error = "";
    }

    async function removeExif() {
        if (!file) return;
        stripping = true;
        try {
            await doStrip();
        } finally {
            stripping = false;
        }
    }

    async function doStrip() {
        if (!file) return;

        const img = new Image();
        const url = URL.createObjectURL(file);
        img.src = url;

        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Failed to load image"));
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            URL.revokeObjectURL(url);
            return;
        }
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        const mime =
            file.type === "image/png"
                ? "image/png"
                : file.type === "image/webp"
                  ? "image/webp"
                  : "image/jpeg";
        return new Promise<void>((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve();
                        return;
                    }
                    if (strippedUrl) URL.revokeObjectURL(strippedUrl);
                    strippedUrl = URL.createObjectURL(blob);
                    resolve();
                },
                mime,
                0.95,
            );
        });
    }

    function downloadStripped() {
        if (!strippedUrl || !file) return;
        const a = document.createElement("a");
        a.href = strippedUrl;
        a.download = file.name.replace(/(\.[^.]+)$/, "_no-exif$1");
        a.click();
    }

    onDestroy(reset);
</script>

<div class="space-y-4">
    <a href="/tools" class="retro-link text-sm">← Back to tools</a>

    <section class="retro-paper retro-panel">
        <div class="retro-paper__head retro-panel__head">
            <h1 class="font-black tracking-wide">EXIF</h1>
            <span class="text-xs opacity-80"
                >View / remove metadata (privacy)</span
            >
        </div>

        <div class="retro-panel__body space-y-4">
            <div>
                <label for="exif-file" class="retro-field__label"
                    >Select image</label
                >
                <input
                    id="exif-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/avif,image/tiff"
                    class="retro-control mt-1"
                    onchange={onFileChange}
                    aria-label="Select image to view EXIF"
                />
                <div class="retro-field__hint mt-1">
                    JPG, PNG, WebP, HEIC, AVIF, TIFF supported
                </div>
            </div>

            {#if error}
                <div class="retro-notice retro-notice--warn">
                    <span class="font-bold">Error:</span>
                    {error}
                </div>
            {/if}

            {#if loading}
                <div class="retro-notice retro-notice--info">
                    <span class="font-bold">Parsing…</span>
                </div>
            {/if}

            {#if file}
                <button
                    type="button"
                    class="retro-btn retro-btn--secondary retro-btn--md"
                    onclick={() => document.getElementById('tool-result')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    View result
                </button>
            {/if}
        </div>
    </section>

    {#if exifData && Object.keys(exifData).length > 0}
        <section id="tool-result" class="retro-paper retro-panel">
            <div class="retro-paper__head retro-panel__head">
                <h2 class="font-black tracking-wide">EXIF Data</h2>
                <span class="text-xs opacity-80"
                    >{Object.keys(exifData).length} tags</span
                >
            </div>
            <div class="retro-panel__body">
                <div class="space-y-1 text-sm font-mono">
                    {#each EXIF_ORDER as key}
                        {#if key in exifData}
                            <div
                                class="flex flex-wrap gap-2 border-b border-[#caa96a]/40 py-1"
                            >
                                <span
                                    class="font-bold text-[#143a66] min-w-[140px]"
                                    >{key}</span
                                >
                                <span class="break-all"
                                    >{formatValue(exifData[key])}</span
                                >
                            </div>
                        {/if}
                    {/each}
                    {#each Object.keys(exifData).filter((k) => !EXIF_ORDER.includes(k)) as key}
                        <div
                            class="flex flex-wrap gap-2 border-b border-[#caa96a]/40 py-1"
                        >
                            <span class="font-bold text-[#143a66] min-w-[140px]"
                                >{key}</span
                            >
                            <span class="break-all"
                                >{formatValue(exifData[key])}</span
                            >
                        </div>
                    {/each}
                </div>
            </div>
        </section>
    {:else if exifData !== null}
        <div id="tool-result" class="retro-notice retro-notice--info">
            <span class="font-bold">No EXIF data</span> found in this image.
        </div>
    {/if}

    {#if file && previewUrl}
        <section class="retro-paper retro-panel">
            <div class="retro-paper__head retro-panel__head">
                <h2 class="font-black tracking-wide">Preview</h2>
            </div>
            <div class="retro-panel__body">
                <RetroImagePreview
                    src={previewUrl}
                    alt="Image preview"
                    caption={file.name}
                    className="mb-3"
                    compact={true}
                />
            </div>
        </section>

        <section class="retro-paper retro-panel">
            <div class="retro-paper__head retro-panel__head">
                <h2 class="font-black tracking-wide">Remove EXIF</h2>
            </div>
            <div class="retro-panel__body space-y-3">
                <p class="text-sm opacity-90">
                    Strip all metadata (EXIF, XMP, etc.) for privacy. Output is
                    a clean image.
                </p>
                <button
                    type="button"
                    class="retro-btn retro-btn--primary retro-btn--md"
                    onclick={removeExif}
                    disabled={stripping}
                >
                    {stripping ? "Stripping…" : "Strip metadata"}
                </button>
                {#if strippedUrl}
                    <div class="space-y-2">
                        <RetroImagePreview
                            src={strippedUrl}
                            alt="Stripped preview"
                            caption={file
                                ? file.name.replace(/(\.[^.]+)$/, "_no-exif$1")
                                : null}
                            className="mb-2"
                            compact={true}
                        />
                        <button
                            type="button"
                            class="retro-btn retro-btn--primary retro-btn--md"
                            onclick={downloadStripped}
                        >
                            Download
                        </button>
                    </div>
                {/if}
            </div>
        </section>
    {/if}
</div>
