<script lang="ts">
	import RetroImagePreview from "$lib/components/ui/RetroImagePreview.svelte";

	type RotateAction = "90cw" | "90ccw" | "180" | "flipH" | "flipV";

	const ACTIONS: { label: string; value: RotateAction }[] = [
		{ label: "90° clockwise", value: "90cw" },
		{ label: "90° counter-clockwise", value: "90ccw" },
		{ label: "180°", value: "180" },
		{ label: "Flip horizontal", value: "flipH" },
		{ label: "Flip vertical", value: "flipV" },
	];

	const ACCEPT_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
	const ACCEPT = ACCEPT_MIMES.join(",");
	const EXPORT_MIMES = ["image/jpeg", "image/png", "image/webp"] as const;

	let file = $state<File | null>(null);
	let originalUrl = $state("");
	let previewUrl = $state("");
	let resultUrl = $state("");
	let error = $state("");
	let fileName = $state("");
	let originalMime = $state("image/png");
	let processing = $state(false);
	let appliedActions = $state<RotateAction[]>([]);

	const ext = $derived(
		originalMime === "image/jpeg" ? ".jpg" : originalMime === "image/webp" ? ".webp" : originalMime === "image/gif" ? ".gif" : ".png",
	);
	const exportMime = $derived((EXPORT_MIMES as readonly string[]).includes(originalMime) ? originalMime : "image/png");

	function cleanup() {
		if (originalUrl) URL.revokeObjectURL(originalUrl);
		if (previewUrl && previewUrl !== originalUrl) URL.revokeObjectURL(previewUrl);
		if (resultUrl) URL.revokeObjectURL(resultUrl);
		originalUrl = "";
		previewUrl = "";
		resultUrl = "";
		file = null;
		appliedActions = [];
	}

	function onFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;

		if (!(ACCEPT_MIMES as readonly string[]).includes(f.type)) {
			error = "JPG, PNG, WebP, GIF supported";
			input.value = "";
			return;
		}

		cleanup();
		file = f;
		fileName = f.name;
		originalMime = f.type || "image/png";
		originalUrl = URL.createObjectURL(f);
		previewUrl = originalUrl;
		error = "";
		input.value = "";
	}

	function applyTransform(img: HTMLImageElement, actions: RotateAction[]): HTMLCanvasElement | null {
		let source: HTMLImageElement | HTMLCanvasElement = img;
		let sw = img.naturalWidth;
		let sh = img.naturalHeight;

		for (const a of actions) {
			let dw = sw;
			let dh = sh;
			if (a === "90cw" || a === "90ccw") {
				[dw, dh] = [sh, sw];
			}

			const canvas = document.createElement("canvas");
			canvas.width = dw;
			canvas.height = dh;
			const ctx = canvas.getContext("2d");
			if (!ctx) return null;

			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";

			ctx.translate(dw / 2, dh / 2);
			switch (a) {
				case "90cw":
					ctx.rotate(Math.PI / 2);
					break;
				case "90ccw":
					ctx.rotate(-Math.PI / 2);
					break;
				case "180":
					ctx.rotate(Math.PI);
					break;
				case "flipH":
					ctx.scale(-1, 1);
					break;
				case "flipV":
					ctx.scale(1, -1);
					break;
			}
			ctx.translate(-sw / 2, -sh / 2);
			ctx.drawImage(source, 0, 0);

			source = canvas;
			sw = dw;
			sh = dh;
		}

		return source instanceof HTMLCanvasElement ? source : null;
	}

	function apply(action: RotateAction) {
		if (!file || !originalUrl) return;

		processing = true;
		error = "";
		appliedActions = [...appliedActions, action];

		const img = new Image();
		img.onload = () => {
			const canvas = applyTransform(img, appliedActions);
			if (!canvas) {
				error = "Canvas not supported";
				processing = false;
				return;
			}

			canvas.toBlob(
				(blob) => {
					if (!blob) {
						error = "Failed to export";
						processing = false;
						return;
					}
					if (previewUrl && previewUrl !== originalUrl) URL.revokeObjectURL(previewUrl);
					previewUrl = URL.createObjectURL(blob);
					processing = false;
				},
				exportMime,
				exportMime === "image/png" ? undefined : 0.95,
			);
		};
		img.onerror = () => {
			error = "Failed to load image";
			processing = false;
			appliedActions = appliedActions.slice(0, -1);
		};
		img.src = originalUrl; // 始终从原图应用全部操作，避免重复变换
	}

	function reset() {
		if (!file) return;
		appliedActions = [];
		if (previewUrl && previewUrl !== originalUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = originalUrl;
		if (resultUrl) URL.revokeObjectURL(resultUrl);
		resultUrl = "";
	}

	function exportResult() {
		if (!originalUrl || !file) return;

		processing = true;
		const img = new Image();
		img.onload = () => {
			const canvas = applyTransform(img, appliedActions);
			if (!canvas) {
				error = "Canvas not supported";
				processing = false;
				return;
			}

			canvas.toBlob(
				(blob) => {
					if (!blob) return;
					if (resultUrl) URL.revokeObjectURL(resultUrl);
					resultUrl = URL.createObjectURL(blob);
					processing = false;
				},
				exportMime,
				exportMime === "image/png" ? undefined : 0.95,
			);
		};
		img.src = originalUrl;
	}

	function download() {
		if (!resultUrl || !file) return;
		const a = document.createElement("a");
		a.href = resultUrl;
		a.download = file.name.replace(/\.[^.]+$/, "") + "_rotated" + ext;
		a.click();
	}

	$effect(() => () => cleanup());
</script>

<div class="space-y-4">
	<a href="/basic" class="retro-link text-sm">← Back</a>

	<section class="retro-paper retro-panel">
		<div class="retro-paper__head retro-panel__head">
			<h1 class="font-black tracking-wide">Rotate & Flip</h1>
			<span class="text-xs opacity-80">Rotate / flip / fix orientation</span>
		</div>

		<div class="retro-panel__body space-y-4">
			<div>
				<label for="rotate-file" class="retro-field__label">Select image</label>
				<input
					id="rotate-file"
					type="file"
					accept={ACCEPT}
					class="retro-control mt-1"
					onchange={onFileChange}
					disabled={processing}
					aria-label="Select image"
				/>
				<div class="retro-field__hint mt-1">JPG, PNG, WebP, GIF supported</div>
			</div>

			{#if error}
				<div class="retro-notice retro-notice--warn">
					<span class="font-bold">Error:</span> {error}
				</div>
			{/if}

			{#if file && previewUrl}
				<div class="space-y-3">
					<div class="border border-retro-paper-border overflow-hidden bg-retro-canvas flex items-center justify-center" style="min-height: 240px; max-height: 50vh;">
						<img
							src={previewUrl}
							alt="Preview"
							class="max-w-full max-h-[50vh] object-contain"
						/>
					</div>

					<div class="flex flex-wrap gap-2">
						{#each ACTIONS as a}
							<button
								type="button"
								class="retro-btn retro-btn--secondary retro-btn--sm"
								onclick={() => apply(a.value)}
								disabled={processing}
							>
								{a.label}
							</button>
						{/each}
						<button
							type="button"
							class="retro-btn retro-btn--ghost retro-btn--sm"
							onclick={reset}
							disabled={processing || appliedActions.length === 0}
						>
							Reset
						</button>
					</div>

					<div class="flex flex-wrap items-end gap-2">
						<button
							type="button"
							class="retro-btn retro-btn--primary retro-btn--md"
							onclick={exportResult}
							disabled={processing || appliedActions.length === 0}
						>
							Apply & Export
						</button>
						{#if resultUrl}
							<button
								type="button"
								class="retro-btn retro-btn--secondary retro-btn--md"
								onclick={() => document.getElementById("tool-result")?.scrollIntoView({ behavior: "smooth" })}
							>
								View result
							</button>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</section>

	{#if resultUrl}
		<section id="tool-result" class="retro-paper retro-panel">
			<div class="retro-paper__head retro-panel__head">
				<h2 class="font-black tracking-wide">Result</h2>
			</div>
			<div class="retro-panel__body">
				<RetroImagePreview
					src={resultUrl}
					alt="Rotated preview"
					caption={fileName ? fileName.replace(/\.[^.]+$/, "") + "_rotated" + ext : null}
					className="mb-3"
					compact={true}
				/>
				<button type="button" class="retro-btn retro-btn--primary retro-btn--md" onclick={download}>
					Download
				</button>
			</div>
		</section>
	{/if}
</div>
