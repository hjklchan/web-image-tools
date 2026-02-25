<script lang="ts">
    import PageHeader from "$lib/components/ui/PageHeader.svelte";

    type PresetKey =
        | "none"
        | "blur"
        | "brightness"
        | "contrast"
        | "grayscale"
        | "hue-rotate"
        | "invert"
        | "sepia";

    type CustomFilterState = {
        blur: number; // px
        brightness: number; // %
        contrast: number; // %
        grayscale: number; // %
        hueRotate: number; // deg
        invert: number; // %
        sepia: number; // %
    };

    type FilterMode = "preset" | "custom";

    const defaultImage =
        "data:image/svg+xml;utf8," +
        encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#cfe6ff"/>
            <stop offset="100%" stop-color="#fffbe3"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <circle cx="250" cy="200" r="90" fill="#7aa7d9" opacity="0.7"/>
        <circle cx="900" cy="260" r="120" fill="#caa96a" opacity="0.55"/>
        <rect x="180" y="420" width="840" height="180" rx="0" fill="#143a66" opacity="0.9"/>
        <text x="600" y="520" text-anchor="middle" font-size="56" fill="#fffbe3" font-family="Arial, sans-serif">Filter Demo Stage</text>
        <text x="600" y="580" text-anchor="middle" font-size="24" fill="#eef6ff" font-family="Arial, sans-serif">Upload your image and adjust filters</text>
      </svg>
    `);

    let imageUrl = $state<string>(defaultImage);
    let imageName = $state<string>("demo-image");
    let fileInputRef = $state<HTMLInputElement | null>(null);

    let mode = $state<FilterMode>("preset");
    let selectedPreset = $state<PresetKey>("none");
    let presetStrength = $state<number>(50);

    let custom = $state<CustomFilterState>({
        blur: 0,
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        hueRotate: 0,
        invert: 0,
        sepia: 0,
    });

    // 预设描述（用于 UI 文案）
    const presetMeta: Record<
        PresetKey,
        {
            label: string;
            min: number;
            max: number;
            step: number;
            unit: string;
            defaultValue: number;
        }
    > = {
        none: {
            label: "None",
            min: 0,
            max: 100,
            step: 1,
            unit: "",
            defaultValue: 0,
        },
        blur: {
            label: "Blur",
            min: 0,
            max: 20,
            step: 0.1,
            unit: "px",
            defaultValue: 3,
        },
        brightness: {
            label: "Brightness",
            min: 0,
            max: 300,
            step: 1,
            unit: "%",
            defaultValue: 120,
        },
        contrast: {
            label: "Contrast",
            min: 0,
            max: 300,
            step: 1,
            unit: "%",
            defaultValue: 140,
        },
        grayscale: {
            label: "Grayscale",
            min: 0,
            max: 100,
            step: 1,
            unit: "%",
            defaultValue: 100,
        },
        "hue-rotate": {
            label: "Hue Rotate",
            min: 0,
            max: 360,
            step: 1,
            unit: "deg",
            defaultValue: 120,
        },
        invert: {
            label: "Invert",
            min: 0,
            max: 100,
            step: 1,
            unit: "%",
            defaultValue: 100,
        },
        sepia: {
            label: "Sepia",
            min: 0,
            max: 100,
            step: 1,
            unit: "%",
            defaultValue: 100,
        },
    };

    // 将“通用强度(0-100)”映射到不同预设的实际值
    function mapPresetStrengthToActual(
        key: PresetKey,
        strength: number,
    ): number {
        if (key === "none") return 0;
        const conf = presetMeta[key];
        // 线性映射到配置范围
        return conf.min + ((conf.max - conf.min) * strength) / 100;
    }

    function presetFilterString(key: PresetKey, strength: number): string {
        if (key === "none") return "none";

        const v = mapPresetStrengthToActual(key, strength);

        switch (key) {
            case "blur":
                return `blur(${v.toFixed(1)}px)`;
            case "brightness":
                return `brightness(${Math.round(v)}%)`;
            case "contrast":
                return `contrast(${Math.round(v)}%)`;
            case "grayscale":
                return `grayscale(${Math.round(v)}%)`;
            case "hue-rotate":
                return `hue-rotate(${Math.round(v)}deg)`;
            case "invert":
                return `invert(${Math.round(v)}%)`;
            case "sepia":
                return `sepia(${Math.round(v)}%)`;
            default:
                return "none";
        }
    }

    function customFilterString(state: CustomFilterState): string {
        return [
            `blur(${state.blur}px)`,
            `brightness(${state.brightness}%)`,
            `contrast(${state.contrast}%)`,
            `grayscale(${state.grayscale}%)`,
            `hue-rotate(${state.hueRotate}deg)`,
            `invert(${state.invert}%)`,
            `sepia(${state.sepia}%)`,
        ].join(" ");
    }

    const currentFilterCss = $derived(
        mode === "preset"
            ? presetFilterString(selectedPreset, presetStrength)
            : customFilterString(custom),
    );

    const currentFilterLabel = $derived(
        mode === "preset"
            ? selectedPreset === "none"
                ? "none"
                : `${presetMeta[selectedPreset].label} (${presetStrength}%)`
            : "Custom (stacked filters)",
    );

    function onFileChange(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                imageUrl = reader.result;
                imageName = file.name;
            }
        };
        reader.readAsDataURL(file);
    }

    function resetPreset() {
        selectedPreset = "none";
        presetStrength = 50;
    }

    function resetCustom() {
        custom = {
            blur: 0,
            brightness: 100,
            contrast: 100,
            grayscale: 0,
            hueRotate: 0,
            invert: 0,
            sepia: 0,
        };
    }

    function switchToPreset(key: PresetKey) {
        mode = "preset";
        selectedPreset = key;
    }

    function switchToCustom() {
        mode = "custom";
    }

    function triggerUpload() {
        fileInputRef?.click();
    }

    async function downloadFilteredImage(
        format: "png" | "jpeg" | "webp" = "png",
    ) {
        const img = new Image();
        img.crossOrigin = "anonymous"; // 对本地上传/ dataURL 通常没问题
        img.src = imageUrl;

        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Failed to load image"));
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        // 应用当前滤镜（你页面里已经有 currentFilterCss）
        ctx.filter = currentFilterCss === "none" ? "none" : currentFilterCss;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const mime =
            format === "png"
                ? "image/png"
                : format === "jpeg"
                  ? "image/jpeg"
                  : "image/webp";

        const quality = format === "png" ? undefined : 0.92;

        canvas.toBlob(
            (blob) => {
                if (!blob) return;

                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                const baseName = (imageName || "filtered-image").replace(
                    /\.[^/.]+$/,
                    "",
                );
                a.href = url;
                a.download = `${baseName}-filtered.${format}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            },
            mime,
            quality,
        );
    }
</script>

<svelte:head>
    <title>Image Filter Demo | SvelteKit + Svelte 5 + Tailwind</title>
    <meta
        name="description"
        content="A local image filter demo with presets and custom controls built with SvelteKit, Svelte 5 Runes API, and TailwindCSS."
    />
</svelte:head>

<PageHeader title="Image Filter (BETA)" />

<div class="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
    <!-- Left Panel: Controls -->
    <aside class="retro-paper retro-panel">
        <div class="retro-paper__head retro-panel__head">
            <h2 class="font-bold tracking-wide">Controls</h2>
        </div>
        <div class="retro-panel__body space-y-4">
            <!-- Upload -->
            <div>
                <label for="file" class="retro-field__label">Select images</label>
                <input
                    id="file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/bmp"
                    multiple
                    class="retro-control mt-1"
                    onchange={onFileChange}
                />
                <div class="retro-field__hint mt-1">
                    JPG, PNG, WebP, BMP supported. Multiple files allowed.
                </div>
            </div>

            <!-- Mode -->
            <section class="space-y-1">
                <label class="retro-field__label block">Mode</label>
                <div class="flex flex-wrap gap-2">
                    <button
                        type="button"
                        class="retro-btn retro-btn--sm"
                        class:retro-btn--primary={mode === "preset"}
                        class:retro-btn--secondary={mode !== "preset"}
                        onclick={() => (mode = "preset")}
                    >
                        Preset
                    </button>
                    <button
                        type="button"
                        class="retro-btn retro-btn--sm"
                        class:retro-btn--primary={mode === "custom"}
                        class:retro-btn--secondary={mode !== "custom"}
                        onclick={switchToCustom}
                    >
                        Custom
                    </button>
                </div>
            </section>

            {#if mode === "preset"}
            <!-- Presets -->
            <section class="space-y-2">
                <div class="flex items-center justify-between">
                    <label class="retro-field__label block">Presets</label>
                    <button
                        type="button"
                        class="retro-link text-xs"
                        onclick={() => {
                            mode = "preset";
                            resetPreset();
                        }}
                    >
                        Reset
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    {#each Object.keys(presetMeta) as PresetKey[] as key}
                        <button
                            type="button"
                            class="retro-btn retro-btn--sm w-full justify-start text-xs"
                            class:retro-btn--primary={mode === "preset" &&
                                selectedPreset === key}
                            class:retro-btn--secondary={!(
                                mode === "preset" && selectedPreset === key
                            )}
                            onclick={() => switchToPreset(key)}
                        >
                            {presetMeta[key].label}
                        </button>
                    {/each}
                </div>

                <div class="space-y-1 pt-1">
                    <div
                        class="retro-field__hint flex items-center justify-between"
                    >
                        <span>Strength</span>
                        <span>{presetStrength}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        bind:value={presetStrength}
                        class="w-full accent-retro-navy"
                        disabled={mode !== "preset" ||
                            selectedPreset === "none"}
                        aria-label="Preset strength"
                    />
                </div>
            </section>
            {/if}

            {#if mode === "custom"}
            <!-- Custom Filters -->
            <section class="space-y-3">
                <div class="flex items-center justify-between">
                    <label class="retro-field__label block"
                        >Custom Filters</label
                    >
                    <button
                        type="button"
                        class="retro-link text-xs"
                        onclick={() => {
                            mode = "custom";
                            resetCustom();
                        }}
                    >
                        Reset
                    </button>
                </div>

                <div class="space-y-2">
                    <!-- blur -->
                    <div>
                        <div
                            class="retro-field__hint mb-1 flex items-center justify-between"
                        >
                            <span>Blur</span><span>{custom.blur}px</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            step="0.1"
                            bind:value={custom.blur}
                            class="w-full accent-retro-navy"
                            aria-label="Blur"
                            oninput={switchToCustom}
                        />
                    </div>

                    <!-- brightness -->
                    <div>
                        <div
                            class="retro-field__hint mb-1 flex items-center justify-between"
                        >
                            <span>Brightness</span><span
                                >{custom.brightness}%</span
                            >
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="300"
                            step="1"
                            bind:value={custom.brightness}
                            class="w-full accent-retro-navy"
                            aria-label="Brightness"
                            oninput={switchToCustom}
                        />
                    </div>

                    <!-- contrast -->
                    <div>
                        <div
                            class="retro-field__hint mb-1 flex items-center justify-between"
                        >
                            <span>Contrast</span><span>{custom.contrast}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="300"
                            step="1"
                            bind:value={custom.contrast}
                            class="w-full accent-retro-navy"
                            aria-label="Contrast"
                            oninput={switchToCustom}
                        />
                    </div>

                    <!-- grayscale -->
                    <div>
                        <div
                            class="retro-field__hint mb-1 flex items-center justify-between"
                        >
                            <span>Grayscale</span><span
                                >{custom.grayscale}%</span
                            >
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            bind:value={custom.grayscale}
                            class="w-full accent-retro-navy"
                            aria-label="Grayscale"
                            oninput={switchToCustom}
                        />
                    </div>

                    <!-- hue rotate -->
                    <div>
                        <div
                            class="retro-field__hint mb-1 flex items-center justify-between"
                        >
                            <span>Hue Rotate</span><span
                                >{custom.hueRotate}deg</span
                            >
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                            bind:value={custom.hueRotate}
                            class="w-full accent-retro-navy"
                            aria-label="Hue Rotate"
                            oninput={switchToCustom}
                        />
                    </div>

                    <!-- invert -->
                    <div>
                        <div
                            class="retro-field__hint mb-1 flex items-center justify-between"
                        >
                            <span>Invert</span><span>{custom.invert}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            bind:value={custom.invert}
                            class="w-full accent-retro-navy"
                            aria-label="Invert"
                            oninput={switchToCustom}
                        />
                    </div>

                    <!-- sepia -->
                    <div>
                        <div
                            class="retro-field__hint mb-1 flex items-center justify-between"
                        >
                            <span>Sepia</span><span>{custom.sepia}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            bind:value={custom.sepia}
                            class="w-full accent-retro-navy"
                            aria-label="Sepia"
                            oninput={switchToCustom}
                        />
                    </div>
                </div>
            </section>
            {/if}
                </div>
            </aside>

    <!-- Right Panel: Stage -->
    <section class="retro-sky retro-panel">
    
        <div class="retro-sky__head retro-panel__head">
            <h2 class="font-bold tracking-wide">Stage</h2>
        </div>
        <div class="retro-panel__body">
            <div
                class="retro-field__hint mb-2 flex flex-wrap items-center gap-2 sm:text-sm"
            >
                Mode: <strong>{mode}</strong>
                Filter: <strong>{currentFilterLabel}</strong>
            </div>

            <!-- Content center stage -->
            <div
                class="flex min-h-[320px] w-full items-center justify-center border border-dashed border-retro-sky-border bg-white p-3 sm:min-h-[420px] lg:min-h-[560px]"
            >
                <div class="flex h-full w-full items-center justify-center">
                    <img
                        src={imageUrl}
                        alt="Preview"
                        class="block max-h-[70vh] max-w-full object-contain"
                        style={`filter: ${currentFilterCss};`}
                        draggable="false"
                    />
                </div>
            </div>

            <div class="mt-2 flex flex-wrap gap-2">
                <button
                    type="button"
                    class="retro-btn retro-btn--primary retro-btn--md"
                    onclick={() => downloadFilteredImage("png")}
                >
                    Download PNG
                </button>
                <button
                    type="button"
                    class="retro-btn retro-btn--primary retro-btn--md"
                    onclick={() => downloadFilteredImage("jpeg")}
                >
                    Download JPEG
                </button>
                <button
                    type="button"
                    class="retro-btn retro-btn--primary retro-btn--md"
                    onclick={() => downloadFilteredImage("webp")}
                >
                    Download WebP
                </button>
            </div>
        </div>
    </section>
</div>
