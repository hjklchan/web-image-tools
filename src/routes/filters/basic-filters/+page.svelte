<script lang="ts">
	import { config } from "$lib/config";
	import PageHeader from "$lib/components/ui/PageHeader.svelte";

	type FilterMode = "preset" | "custom";
	type ExportFormat = "png" | "jpeg" | "webp";

	type CssAdjustments = {
		blur: number;
		brightness: number;
		contrast: number;
		saturate: number;
		grayscale: number;
		hueRotate: number;
		invert: number;
		sepia: number;
	};

	type PresetId =
		| "none"
		| "sepia"
		| "grayscale"
		| "blackwhite"
		| "invert"
		| "negative"
		| "blur"
		| "vivid"
		| "ccd"
		| "polaroid";

	type PresetDefinition = {
		id: PresetId;
		label: string;
		category: "style" | "artistic";
		apply: (strength: number) => Partial<CssAdjustments>;
	};

	const DEFAULT_CSS: CssAdjustments = {
		blur: 0,
		brightness: 100,
		contrast: 100,
		saturate: 100,
		grayscale: 0,
		hueRotate: 0,
		invert: 0,
		sepia: 0,
	};

	const PRESETS: PresetDefinition[] = [
		{
			id: "none",
			label: "None",
			category: "style",
			apply: () => ({ ...DEFAULT_CSS }),
		},
		// CCD：冷调、轻微高对比、高饱和、一点点数码锐感氛围
		{
			id: "ccd",
			label: "CCD",
			category: "style",
			apply: (strength) => {
				const t = Math.max(0, Math.min(100, strength)) / 100;

				return {
					blur: 0,
					brightness: 100 + 4 * t, // 稍微提亮
					contrast: 100 + 18 * t, // 增加对比
					saturate: 100 + 22 * t, // 增加饱和
					grayscale: 0,
					hueRotate: -6 * t, // 轻微偏冷（往青蓝方向）
					invert: 0,
					sepia: 2 * t, // 极轻微暖底，避免太“死冷”
				};
			},
		},
		// Polaroid：暖调、复古、轻微泛黄、稍柔和
		{
			id: "polaroid",
			label: "Polaroid",
			category: "artistic",
			apply: (strength) => {
				const t = Math.max(0, Math.min(100, strength)) / 100;

				return {
					blur: 0,
					brightness: 100 + 8 * t, // 略微提亮
					contrast: 100 - 8 * t, // 稍降对比，更柔和
					saturate: 100 - 6 * t, // 略微褪色
					grayscale: 3 * t, // 很轻的旧照片感
					hueRotate: 8 * t, // 往暖色偏一点
					invert: 0,
					sepia: 16 * t, // 主要的复古暖黄来源
				};
			},
		},
		{
			id: "sepia",
			label: "Sepia",
			category: "style",
			apply: (s) => ({
				sepia: s,
				contrast: 100 + Math.round(s * 0.15),
				brightness: 100 + Math.round(s * 0.05),
			}),
		},
		{
			id: "grayscale",
			label: "Grayscale",
			category: "style",
			apply: (s) => ({ grayscale: s }),
		},
		{
			id: "blackwhite",
			label: "Black & White",
			category: "style",
			apply: (s) => ({
				grayscale: 100,
				contrast: 100 + Math.round(s * 0.8),
				brightness: 95 + Math.round(s * 0.1),
			}),
		},
		{
			id: "invert",
			label: "Invert",
			category: "style",
			apply: (s) => ({ invert: s }),
		},
		{
			id: "negative",
			label: "Negative",
			category: "style",
			apply: (s) => ({
				invert: Math.min(100, s),
				contrast: 100 + Math.round(s * 0.2),
			}),
		},
		{
			id: "blur",
			label: "Blur",
			category: "artistic",
			apply: (s) => ({ blur: Number(((s / 100) * 12).toFixed(1)) }),
		},
		{
			id: "vivid",
			label: "Vivid",
			category: "style",
			apply: (s) => ({
				saturate: 100 + Math.round(s * 0.8),
				contrast: 100 + Math.round(s * 0.25),
				brightness: 100 + Math.round(s * 0.08),
			}),
		},
	];

	const demoImage =
		"data:image/svg+xml;utf8," +
		encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
        <defs>
          <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#cfe6ff"/>
            <stop offset="100%" stop-color="#fffbe3"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#bg)"/>
        <circle cx="240" cy="180" r="110" fill="#7aa7d9" opacity=".65"/>
        <circle cx="940" cy="250" r="130" fill="#caa96a" opacity=".45"/>
        <rect x="160" y="380" width="880" height="200" fill="#143a66" opacity=".92"/>
        <text x="600" y="500" text-anchor="middle" fill="#fffbe3" font-size="60" font-family="Arial">Image Filter Tool</text>
      </svg>
    `);

	let fileInput = $state<HTMLInputElement | null>(null);

	let imageUrl = $state<string>(demoImage);
	let imageName = $state<string>("demo-image");
	let imageType = $state<string>("image/svg+xml");
	let imageSizeText = $state<string>("Demo");
	let originalWidth = $state<number>(1200);
	let originalHeight = $state<number>(800);

	let mode = $state<FilterMode>("preset");
	let presetId = $state<PresetId>("none");
	let presetStrength = $state<number>(60);

	let custom = $state<CssAdjustments>({ ...DEFAULT_CSS });

	let previewLoading = $state<boolean>(false);
	let exporting = $state<boolean>(false);
	let exportFormat = $state<ExportFormat>("png");
	let exportQuality = $state<number>(92);
	let errorMessage = $state<string>("");

	function fmtBytes(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	}

	function getPresetById(id: PresetId): PresetDefinition {
		return PRESETS.find((p) => p.id === id) ?? PRESETS[0];
	}

	function mergeCss(
		base: CssAdjustments,
		patch: Partial<CssAdjustments>,
	): CssAdjustments {
		return { ...base, ...patch };
	}

	const activePresetAdjustments = $derived.by(() => {
		const preset = getPresetById(presetId);
		return mergeCss(DEFAULT_CSS, preset.apply(presetStrength));
	});

	const effectiveAdjustments = $derived.by(() =>
		mode === "preset" ? activePresetAdjustments : custom,
	);

	function toCssFilterString(a: CssAdjustments): string {
		return [
			`blur(${a.blur}px)`,
			`brightness(${a.brightness}%)`,
			`contrast(${a.contrast}%)`,
			`saturate(${a.saturate}%)`,
			`grayscale(${a.grayscale}%)`,
			`hue-rotate(${a.hueRotate}deg)`,
			`invert(${a.invert}%)`,
			`sepia(${a.sepia}%)`,
		].join(" ");
	}

	const currentFilterCss = $derived.by(() =>
		toCssFilterString(effectiveAdjustments),
	);
	const currentPresetLabel = $derived.by(() => getPresetById(presetId).label);

	function triggerUpload() {
		errorMessage = "";
		fileInput?.click();
	}

	async function handleFileChange(event: Event) {
		errorMessage = "";
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
		if (!allowed.includes(file.type)) {
			errorMessage =
				"Unsupported format. Please upload JPG / PNG / WEBP / GIF.";
			return;
		}

		try {
			previewLoading = true;
			const objectUrl = URL.createObjectURL(file);
			const meta = await loadImageMeta(objectUrl);

			imageUrl = objectUrl;
			imageName = file.name;
			imageType = file.type || "unknown";
			imageSizeText = fmtBytes(file.size);
			originalWidth = meta.width;
			originalHeight = meta.height;
		} catch (err) {
			console.error(err);
			errorMessage = "Failed to load image preview.";
		} finally {
			previewLoading = false;
			input.value = "";
		}
	}

	function loadImageMeta(
		src: string,
	): Promise<{ width: number; height: number }> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () =>
				resolve({
					width: img.naturalWidth || img.width,
					height: img.naturalHeight || img.height,
				});
			img.onerror = reject;
			img.src = src;
		});
	}

	function resetCustom() {
		mode = "custom";
		custom = { ...DEFAULT_CSS };
	}

	function resetAll() {
		mode = "preset";
		presetId = "none";
		presetStrength = 60;
		custom = { ...DEFAULT_CSS };
		errorMessage = "";
	}

	function onCustomChange() {
		mode = "custom";
	}

	async function exportImage(format: ExportFormat) {
		if (!imageUrl) return;
		errorMessage = "";
		exporting = true;
		exportFormat = format;

		try {
			const img = await loadHtmlImage(imageUrl);

			const canvas = document.createElement("canvas");
			canvas.width = img.naturalWidth || img.width;
			canvas.height = img.naturalHeight || img.height;

			const ctx = canvas.getContext("2d");
			if (!ctx) throw new Error("Canvas not supported");

			ctx.filter = toCssFilterString(
				mode === "preset" ? activePresetAdjustments : custom,
			);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			const mime =
				format === "png"
					? "image/png"
					: format === "jpeg"
						? "image/jpeg"
						: "image/webp";
			const quality =
				format === "png"
					? undefined
					: Math.max(0.1, Math.min(1, exportQuality / 100));

			const blob = await canvasToBlob(canvas, mime, quality);
			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			const base = imageName.replace(/\.[^/.]+$/, "") || "image";
			const ext = format === "jpeg" ? "jpg" : format;
			a.href = url;
			a.download = `${base}-filtered.${ext}`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error(err);
			errorMessage = "Export failed. Please try another format or image.";
		} finally {
			exporting = false;
		}
	}

	function loadHtmlImage(src: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = src;
		});
	}

	function canvasToBlob(
		canvas: HTMLCanvasElement,
		mime: string,
		quality?: number,
	): Promise<Blob> {
		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) =>
					blob
						? resolve(blob)
						: reject(new Error("Failed to export blob")),
				mime,
				quality,
			);
		});
	}
</script>

<svelte:head>
	<title>Basic Image Filter Tool - {config.siteName}</title>
	<meta
		name="description"
		content="Image filter tool with instant preview, presets, custom CSS filters, and PNG/JPG/WEBP export."
	/>
	<meta
		name="keywords"
		content="Basic image filter tool, css filter, jpg png webp converter, sveltekit"
	/>
</svelte:head>

<PageHeader title="Basic Image Filter (BETA)" />

<div
	class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]"
>
	<!-- Left Panel: Controls -->
	<aside
		class="retro-paper retro-panel flex max-h-[70vh] flex-col overflow-hidden lg:max-h-[80vh]"
	>
		<div class="retro-paper__head retro-panel__head shrink-0">
			<h2 class="font-bold tracking-wide">Controls</h2>
		</div>
		<div class="retro-panel__body min-h-0 flex-1 space-y-4 overflow-y-auto">
			<!-- Upload -->
			<section class="space-y-2">
				<div>
					<label for="compress-file" class="retro-field__label"
						>Select images</label
					>
					<input
						id="compress-file"
						type="file"
						accept="image/jpeg,image/png,image/webp,image/bmp"
						multiple
						class="retro-control mt-1"
						onchange={handleFileChange}
					/>
					<div class="retro-field__hint mt-1">
						JPG, PNG, WebP, BMP supported.
					</div>
				</div>
			</section>

			<!-- Mode -->
			<section class="space-y-2">
				<label class="retro-field__label block">Mode</label>
				<div class="flex flex-wrap gap-2">
					<button
						class="retro-btn retro-btn--sm"
						class:retro-btn--primary={mode === "preset"}
						class:retro-btn--secondary={mode !== "preset"}
						type="button"
						onclick={() => (mode = "preset")}
					>
						Preset
					</button>
					<button
						class="retro-btn retro-btn--sm"
						class:retro-btn--primary={mode === "custom"}
						class:retro-btn--secondary={mode !== "custom"}
						type="button"
						onclick={() => (mode = "custom")}
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
								presetId = "none";
								presetStrength = 60;
							}}
						>
							Reset
						</button>
					</div>
					<div class="grid grid-cols-2 gap-2">
						{#each PRESETS as p}
							<button
								type="button"
								class="retro-btn retro-btn--sm w-full justify-start text-xs"
								class:retro-btn--primary={mode === "preset" &&
									presetId === p.id}
								class:retro-btn--secondary={!(
									mode === "preset" && presetId === p.id
								)}
								onclick={() => {
									mode = "preset";
									presetId = p.id;
								}}
							>
								{p.label}
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
							class="retro-range"
							type="range"
							min="0"
							max="100"
							step="1"
							bind:value={presetStrength}
							aria-label="Preset strength"
							disabled={presetId === "none" || mode !== "preset"}
						/>
					</div>
				</section>
			{/if}

			{#if mode === "custom"}
				<!-- Custom Adjustments -->
				<section class="space-y-3">
					<div class="flex items-center justify-between">
						<label class="retro-field__label block"
							>Custom Adjustments</label
						>
						<button
							type="button"
							class="retro-link text-xs"
							onclick={resetCustom}>Reset</button
						>
					</div>

					{#snippet row(
						label: string,
						valueText: string,
						min: number,
						max: number,
						step: number,
						get: () => number,
						set: (v: number) => void,
					)}
						<div>
							<div
								class="retro-field__hint mb-1 flex items-center justify-between"
							>
								<span>{label}</span>
								<span>{valueText}</span>
							</div>
							<input
								class="retro-range"
								type="range"
								{min}
								{max}
								{step}
								value={get()}
								aria-label={label}
								oninput={(e) => {
									const v = Number(
										(e.currentTarget as HTMLInputElement)
											.value,
									);
									set(v);
									onCustomChange();
								}}
							/>
						</div>
					{/snippet}

					<div class="space-y-2">
						{@render row(
							"Blur",
							`${custom.blur}px`,
							0,
							20,
							0.1,
							() => custom.blur,
							(v) => (custom.blur = v),
						)}
						{@render row(
							"Brightness",
							`${custom.brightness}%`,
							0,
							200,
							1,
							() => custom.brightness,
							(v) => (custom.brightness = v),
						)}
						{@render row(
							"Contrast",
							`${custom.contrast}%`,
							0,
							200,
							1,
							() => custom.contrast,
							(v) => (custom.contrast = v),
						)}
						{@render row(
							"Saturation",
							`${custom.saturate}%`,
							0,
							200,
							1,
							() => custom.saturate,
							(v) => (custom.saturate = v),
						)}
						{@render row(
							"Grayscale",
							`${custom.grayscale}%`,
							0,
							100,
							1,
							() => custom.grayscale,
							(v) => (custom.grayscale = v),
						)}
						{@render row(
							"Hue",
							`${custom.hueRotate}deg`,
							0,
							360,
							1,
							() => custom.hueRotate,
							(v) => (custom.hueRotate = v),
						)}
						{@render row(
							"Invert",
							`${custom.invert}%`,
							0,
							100,
							1,
							() => custom.invert,
							(v) => (custom.invert = v),
						)}
						{@render row(
							"Sepia",
							`${custom.sepia}%`,
							0,
							100,
							1,
							() => custom.sepia,
							(v) => (custom.sepia = v),
						)}
					</div>
				</section>
			{/if}

			<!-- Export -->
			<section class="space-y-2">
				<label class="retro-field__label block">Export</label>
				<div class="flex flex-wrap gap-2 text-xs">
					<label class="inline-flex items-center gap-1">
						<input
							type="radio"
							bind:group={exportFormat}
							value="png"
							class="retro-checkbox"
						/> PNG
					</label>
					<label class="inline-flex items-center gap-1">
						<input
							type="radio"
							bind:group={exportFormat}
							value="jpeg"
							class="retro-checkbox"
						/> JPG
					</label>
					<label class="inline-flex items-center gap-1">
						<input
							type="radio"
							bind:group={exportFormat}
							value="webp"
							class="retro-checkbox"
						/> WEBP
					</label>
				</div>
				{#if exportFormat !== "png"}
					<div class="space-y-1">
						<div
							class="retro-field__hint flex items-center justify-between"
						>
							<span>Quality</span>
							<span>{exportQuality}%</span>
						</div>
						<input
							class="retro-range"
							type="range"
							min="10"
							max="100"
							step="1"
							bind:value={exportQuality}
							aria-label="Export quality"
						/>
					</div>
				{/if}
				<button
					type="button"
					class="retro-btn retro-btn--ghost retro-btn--sm w-full"
					onclick={resetAll}>Reset All</button
				>

				<button
					type="button"
					class="retro-btn retro-btn--primary retro-btn--md w-full"
					onclick={() => exportImage(exportFormat)}
					disabled={exporting || previewLoading}
				>
					{exporting
						? "Exporting..."
						: `Download ${exportFormat.toUpperCase()}`}
				</button>
				<div class="retro-field__hint">
					Preview uses CSS filters (fast). Export is rendered via
					Canvas (real output file).
				</div>
			</section>

			{#if errorMessage}
				<div class="retro-notice retro-notice--warn">
					{errorMessage}
				</div>
			{/if}
		</div>
	</aside>

	<!-- Right Panel: Stage -->
	<section class="retro-sky retro-panel">
		<div class="retro-sky__head retro-panel__head">
			<h2 class="font-bold tracking-wide">Stage</h2>
			<span class="retro-field__hint ml-auto text-retro-sky-ink">
				Mode: <strong>{mode}</strong>
				{#if mode === "preset"}
					· Preset: <strong>{currentPresetLabel}</strong>
				{/if}
			</span>
		</div>
		<div class="retro-panel__body">
			<div
				class="retro-field__hint mb-2 flex flex-wrap items-center gap-2 sm:text-sm"
			>
				{#if previewLoading}
					<span class="retro-notice retro-notice--warn px-2 py-1"
						>Loading...</span
					>
				{/if}
				{#if exporting}
					<span class="retro-notice retro-notice--info px-2 py-1"
						>Exporting...</span
					>
				{/if}
			</div>

			<div
				class="relative flex min-h-[320px] max-h-[70vh] w-full shrink-0 items-center justify-center overflow-hidden border border-dashed border-retro-sky-border bg-white p-4"
			>
				{#if previewLoading}
					<div
						class="absolute inset-0 z-10 flex items-center justify-center bg-white/80"
					>
						<span class="retro-notice retro-notice--info"
							>Loading preview...</span
						>
					</div>
				{/if}
				<img
					src={imageUrl}
					alt="Filtered preview"
					class="max-h-full max-w-full object-contain"
					style="filter: {currentFilterCss}"
					draggable="false"
				/>
			</div>

			<div class="mt-3">
				<div class="retro-field__hint">
					GIF upload is supported for preview. Export outputs a static
					image (not animated GIF).
				</div>
			</div>
		</div>
	</section>
</div>
