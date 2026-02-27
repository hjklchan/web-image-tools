<script lang="ts">
	import { browser } from "$app/environment";
	import { onDestroy } from "svelte";
	import PageHeader from "$lib/components/ui/PageHeader.svelte";
	import RetroImagePreview from "$lib/components/ui/RetroImagePreview.svelte";
	import Cropper from "cropperjs";
	import "cropperjs/dist/cropper.css";
	import JSZip from "jszip";

	type AspectOption = { label: string; value: string; ratio: number };

	const ASPECT_OPTIONS: AspectOption[] = [
		{ label: "1:1", value: "1", ratio: 1 },
		{ label: "4:5", value: "0.8", ratio: 4 / 5 },
		{ label: "3:4", value: "0.75", ratio: 3 / 4 },
		{ label: "9:16", value: "0.5625", ratio: 9 / 16 },
	];

	let fileInput = $state<HTMLInputElement | null>(null);
	let imgEl = $state<HTMLImageElement | null>(null);
	let gridOverlayEl = $state<HTMLDivElement | null>(null);

	let imgSrc = $state("");
	let fileName = $state("");
	let originalMime = $state("image/png");
	let error = $state("");
	let processing = $state(false);

	let aspectValue = $state("1");
	let rows = $state(2);
	let cols = $state(2);

	let cropper: Cropper | null = null;
	let CropperClass: typeof Cropper | null = null;

	/** Split results: blob URLs for grid display (mobile long-press to save) */
	let splitResults = $state<{ url: string; name: string }[]>([]);

	const aspectRatio = $derived(Number(aspectValue) || 1);
	const totalCells = $derived(rows * cols);

	function clampRowsCols(v: number) {
		return Math.max(1, Math.min(5, Math.round(v)));
	}

	function onFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
			error = "Only JPG, PNG, WebP, GIF supported";
			input.value = "";
			return;
		}

		cleanup();
		error = "";
		fileName = file.name;
		originalMime = file.type || "image/png";
		imgSrc = URL.createObjectURL(file);
		input.value = "";
	}

	function revokeSplitResults() {
		for (const r of splitResults) URL.revokeObjectURL(r.url);
		splitResults = [];
	}

	function cleanup() {
		if (cropper) {
			cropper.destroy();
			cropper = null;
		}
		if (imgSrc) URL.revokeObjectURL(imgSrc);
		imgSrc = "";
		fileName = "";
		revokeSplitResults();
	}

	function updateGridOverlay() {
		if (!cropper || !gridOverlayEl) return;
		const box = cropper.getCropBoxData();
		if (!box) return;

		gridOverlayEl.style.cssText = `
			position: absolute; left: ${box.left}px; top: ${box.top}px;
			width: ${box.width}px; height: ${box.height}px;
			pointer-events: none; border: 1px dashed rgba(255,255,255,0.6);
		`;

		// Draw dashed grid: (cols-1) vertical + (rows-1) horizontal lines
		const lines: string[] = [];
		for (let i = 1; i < cols; i++) {
			const x = (box.width * i) / cols;
			lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${box.height}" stroke="#fff" stroke-width="1" stroke-dasharray="4 4" opacity="0.8"/>`);
		}
		for (let i = 1; i < rows; i++) {
			const y = (box.height * i) / rows;
			lines.push(`<line x1="0" y1="${y}" x2="${box.width}" y2="${y}" stroke="#fff" stroke-width="1" stroke-dasharray="4 4" opacity="0.8"/>`);
		}
		gridOverlayEl.innerHTML = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${lines.join("")}</svg>`;
	}

	async function initCropper() {
		if (!browser || !imgEl || !imgSrc) return;

		if (!CropperClass) {
			const mod = await import("cropperjs");
			CropperClass = mod.default;
		}

		if (cropper) cropper.destroy();

		cropper = new CropperClass(imgEl, {
			aspectRatio,
			viewMode: 1,
			dragMode: "move",
			autoCrop: true,
			responsive: true,
			restore: false,
			guides: false,
			center: true,
			highlight: false,
			cropBoxResizable: true,
			cropBoxMovable: true,
			crop: updateGridOverlay,
		});

		setTimeout(updateGridOverlay, 150);
	}

	function onAspectChange() {
		rows = clampRowsCols(rows);
		cols = clampRowsCols(cols);
		if (cropper) {
			cropper.setAspectRatio(aspectRatio);
			updateGridOverlay();
		}
	}

	function onRowsColsChange() {
		rows = clampRowsCols(rows);
		cols = clampRowsCols(cols);
		updateGridOverlay();
	}

	$effect(() => {
		aspectRatio;
		rows;
		cols;
		updateGridOverlay();
	});

	/** Generate split results and show in grid (no download) */
	async function runSplit() {
		if (!cropper || !imgEl || !imgSrc) return;

		processing = true;
		error = "";

		try {
			const data = cropper.getData();
			if (!data) throw new Error("Cannot get crop data");

			const cellW = data.width / cols;
			const cellH = data.height / rows;

			const mime = ["image/jpeg", "image/png", "image/webp"].includes(originalMime)
				? originalMime
				: "image/png";
			const quality = mime === "image/png" ? undefined : 0.92;
			const ext = mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png";

			const baseName = (fileName || "image").replace(/\.[^.]+$/, "");

			revokeSplitResults();

			const results: { url: string; name: string }[] = [];

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					const sx = data.x + col * cellW;
					const sy = data.y + row * cellH;

					const canvas = document.createElement("canvas");
					canvas.width = cellW;
					canvas.height = cellH;
					const ctx = canvas.getContext("2d");
					if (!ctx) continue;

					ctx.drawImage(
						imgEl,
						sx, sy, cellW, cellH,
						0, 0, cellW, cellH,
					);

					const blob = await new Promise<Blob | null>((resolve) => {
						canvas.toBlob(resolve, mime, quality);
					});
					if (!blob) continue;

					const name = `${baseName}_${row + 1}-${col + 1}.${ext}`;
					const blobUrl = URL.createObjectURL(blob);
					results.push({ url: blobUrl, name });
				}
			}

			splitResults = results;
		} catch (err) {
			console.error(err);
			error = err instanceof Error ? err.message : "Split failed";
		} finally {
			processing = false;
		}
	}

	/** Create ZIP from splitResults and trigger download */
	async function createAndDownloadZIP() {
		const zip = new JSZip();
		for (const r of splitResults) {
			const blob = await fetch(r.url).then((res) => res.blob());
			zip.file(r.name, blob);
		}
		const baseName = (fileName || "image").replace(/\.[^.]+$/, "");
		const zipBlob = await zip.generateAsync({ type: "blob" });
		const zipUrl = URL.createObjectURL(zipBlob);
		const a = document.createElement("a");
		a.href = zipUrl;
		a.download = `${baseName}_split_${rows}x${cols}.zip`;
		a.click();
		URL.revokeObjectURL(zipUrl);
	}

	/** Download ZIP from existing results; if none, run split first then download */
	async function downloadZIP() {
		if (splitResults.length === 0) await runSplit();
		if (splitResults.length === 0) return;
		processing = true;
		try {
			await createAndDownloadZIP();
		} catch (err) {
			console.error(err);
			error = err instanceof Error ? err.message : "Download failed";
		} finally {
			processing = false;
		}
	}

	function scrollToResults() {
		document.getElementById("splitter-results")?.scrollIntoView({ behavior: "smooth" });
	}

	onDestroy(cleanup);
</script>

<PageHeader title="Image Splitter (Beta)" subtitle="1:1 | 4:5 | 3:4 | 9:16 split, download as ZIP, mobile long-press to save" />

<div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
	<!-- Left: Controls -->
	<aside class="retro-paper retro-panel flex max-h-[70vh] flex-col overflow-hidden lg:max-h-[80vh]">
		<div class="retro-paper__head retro-panel__head shrink-0">
			<h2 class="font-bold tracking-wide">Controls</h2>
		</div>
		<div class="retro-panel__body min-h-0 flex-1 space-y-4 overflow-y-auto">
			<section class="space-y-2">
				<label for="splitter-file" class="retro-field__label block">Select image</label>
				<input
					id="splitter-file"
					type="file"
					accept="image/jpeg,image/png,image/webp,image/gif"
					class="retro-control mt-1"
					onchange={onFileChange}
					aria-label="Select image"
				/>
				<div class="retro-field__hint mt-1">JPG, PNG, WebP, GIF</div>
			</section>

			{#if error}
				<div class="retro-notice retro-notice--warn">{error}</div>
			{/if}

			{#if imgSrc}
				<section class="space-y-2">
					<label for="aspect" class="retro-field__label block">Aspect ratio</label>
					<select
						id="aspect"
						class="retro-control mt-1"
						bind:value={aspectValue}
						onchange={onAspectChange}
					>
						{#each ASPECT_OPTIONS as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</section>

				<section class="space-y-2">
					<label class="retro-field__label block">Split</label>
					<div class="flex gap-2">
						<div class="flex-1">
							<span class="retro-field__hint text-xs">Rows</span>
							<input
								type="number"
								class="retro-control mt-0.5"
								min="1"
								max="5"
								step="1"
								bind:value={rows}
								onchange={onRowsColsChange}
								oninput={() => (rows = clampRowsCols(rows))}
							/>
						</div>
						<div class="flex-1">
							<span class="retro-field__hint text-xs">Cols</span>
							<input
								type="number"
								class="retro-control mt-0.5"
								min="1"
								max="5"
								step="1"
								bind:value={cols}
								onchange={onRowsColsChange}
								oninput={() => (cols = clampRowsCols(cols))}
							/>
						</div>
					</div>
					<div class="retro-field__hint">Max 5×5, {totalCells} images</div>
				</section>

				<button
					type="button"
					class="retro-btn retro-btn--primary retro-btn--md w-full"
					onclick={runSplit}
					disabled={processing}
				>
					{processing ? "Processing..." : `Split (${totalCells} images)`}
				</button>
				{#if splitResults.length > 0}
					<button
						type="button"
						class="retro-btn retro-btn--secondary retro-btn--md w-full"
						onclick={scrollToResults}
					>
						View Results
					</button>
				{/if}
				<button
					type="button"
					class="retro-btn retro-btn--secondary retro-btn--md w-full"
					onclick={downloadZIP}
					disabled={processing}
				>
					Download ZIP
				</button>
                <div class="retro-field__hint text-xs">ZIP may not work on mobile—long-press result images to save</div>
			{/if}
		</div>
	</aside>

	<!-- Right: Stage -->
	<section class="retro-sky retro-panel">
		<div class="retro-sky__head retro-panel__head">
			<h2 class="font-bold tracking-wide">Stage</h2>
		</div>
		<div class="retro-panel__body">
			{#if imgSrc}
				<div class="relative overflow-hidden bg-retro-canvas" style="min-height: 560px; height: clamp(560px, 85vh, 820px);">
					<img
						bind:this={imgEl}
						src={imgSrc}
						alt="Crop area"
						class="block max-h-full max-w-full"
						style="display: block; max-width: 100%;"
						onload={initCropper}
					/>
					<div bind:this={gridOverlayEl} class="z-10 box-border" style=""></div>
				</div>
			{:else}
				<div class="flex min-h-[520px] lg:min-h-[640px] items-center justify-center border border-dashed border-retro-sky-border bg-white">
					<span class="retro-field__hint">Select an image to crop here</span>
				</div>
			{/if}
		</div>
	</section>
</div>

{#if splitResults.length > 0}
	<section id="splitter-results" class="retro-paper retro-panel mt-6 scroll-mt-4">
		<div class="retro-paper__head retro-panel__head">
			<h2 class="font-bold tracking-wide">Results</h2>
			<span class="retro-field__hint text-xs sm:text-sm">Long-press any image to save (mobile)</span>
		</div>
		<div class="retro-panel__body p-3 sm:p-4">
			<div
				class="grid gap-2 sm:gap-3"
				style="grid-template-columns: repeat({cols}, minmax(0, 1fr));"
			>
				{#each splitResults as result (result.name)}
					<RetroImagePreview
						src={result.url}
						alt={result.name}
						caption={result.name}
						compact={true}
						className="!max-w-none"
					/>
				{/each}
			</div>
		</div>
	</section>
{/if}
