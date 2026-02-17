<script lang="ts">
	import { onDestroy } from "svelte";
	import imageCompression from "browser-image-compression";
	import RetroImagePreview from "$lib/components/ui/RetroImagePreview.svelte";

	type CompressResult = {
		original: File;
		compressed: File;
		originalSize: number;
		compressedSize: number;
		ratio: string;
		previewUrl: string;
	};

	let files: File[] = [];
	let results: CompressResult[] = [];
	let compressing = false;
	let progress = 0;
	let error = "";
	let showAdvanced = false;

	// Default: auto compress, max 1MB, max dimension 1920
	let maxSizeMB = 1;
	let maxWidthOrHeight = 1920;
	let initialQuality = 0.9;
	let useWebWorker = true;
	let preserveExif = false;

	function getOptions() {
		return {
			maxSizeMB,
			maxWidthOrHeight,
			initialQuality,
			useWebWorker,
			preserveExif,
			onProgress: (p: number) => (progress = p),
		};
	}

	async function onFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const selected = Array.from(input.files ?? []);
		if (selected.length === 0) return;

		const valid = selected.filter((f) =>
			["image/jpeg", "image/png", "image/webp", "image/bmp"].includes(f.type)
		);
		if (valid.length !== selected.length) {
			error = "Only JPG / PNG / WebP / BMP supported";
			return;
		}

		files = valid;
		error = "";
		results.forEach((r) => URL.revokeObjectURL(r.previewUrl));
		results = [];
		await compressAll();
		input.value = "";
	}

	async function compressAll() {
		if (files.length === 0) return;

		compressing = true;
		results = [];
		error = "";

		try {
			for (let i = 0; i < files.length; i++) {
				progress = 0;
				const compressed = await imageCompression(files[i], getOptions());
				results = [
					...results,
					{
						original: files[i],
						compressed,
						originalSize: files[i].size,
						compressedSize: compressed.size,
						ratio:
							files[i].size > 0
								? ((1 - compressed.size / files[i].size) * 100).toFixed(1) + "%"
								: "-",
						previewUrl: URL.createObjectURL(compressed),
					},
				];
			}
		} catch (err) {
			error = err instanceof Error ? err.message : "Compression failed";
		} finally {
			compressing = false;
			progress = 0;
		}
	}

	function formatSize(bytes: number) {
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
		return (bytes / (1024 * 1024)).toFixed(2) + " MB";
	}

	function download(file: File) {
		const a = document.createElement("a");
		a.href = URL.createObjectURL(file);
		a.download = file.name.replace(/(\.[^.]+)$/, "_compressed$1");
		a.click();
		URL.revokeObjectURL(a.href);
	}

	onDestroy(() => {
		results.forEach((r) => URL.revokeObjectURL(r.previewUrl));
	});
</script>

<div class="space-y-4">
	<a href="/tools" class="retro-link text-sm">← Back to tools</a>

	<section class="retro-paper retro-panel">
		<div class="retro-paper__head retro-panel__head">
			<h1 class="font-black tracking-wide">Image Compressor</h1>
			<span class="text-xs opacity-80">Local compression, auto-optimized by default</span>
		</div>

		<div class="retro-panel__body space-y-4">
			<!-- File selection -->
			<div>
				<label for="compress-file" class="retro-field__label">Select images</label>
				<input
					id="compress-file"
					type="file"
					accept="image/jpeg,image/png,image/webp,image/bmp"
					multiple
					class="retro-control mt-1"
					on:change={onFileChange}
					disabled={compressing}
				/>
				<div class="retro-field__hint mt-1">
					JPG, PNG, WebP, BMP supported. Multiple files allowed.
				</div>
			</div>

			<!-- Advanced options (collapsible) -->
			<div class="border border-[#caa96a] bg-[#fffbe3]">
				<button
					type="button"
					class="w-full px-3 py-2 text-left flex items-center justify-between border-b border-[#caa96a] bg-[#e8d7a3] hover:bg-[#e0cf93]"
					on:click={() => (showAdvanced = !showAdvanced)}
					aria-expanded={showAdvanced}
				>
					<span class="text-sm font-bold">Advanced options</span>
					<span class="text-xs">{showAdvanced ? "[Collapse]" : "[Expand]"}</span>
				</button>

				{#if showAdvanced}
					<div class="p-3 space-y-3">
						<div>
							<label for="max-size-mb" class="retro-field__label">Max size (MB)</label>
							<input
								id="max-size-mb"
								type="number"
								min="0.1"
								max="10"
								step="0.1"
								class="retro-control mt-1"
								bind:value={maxSizeMB}
							/>
						</div>
						<div>
							<label for="max-dim" class="retro-field__label">Max dimension (px)</label>
							<input
								id="max-dim"
								type="number"
								min="100"
								max="4096"
								step="100"
								class="retro-control mt-1"
								bind:value={maxWidthOrHeight}
							/>
							<div class="retro-field__hint mt-1">Images will scale down proportionally above this</div>
						</div>
						<div>
							<label for="initial-quality" class="retro-field__label">Initial quality (0–1)</label>
							<input
								id="initial-quality"
								type="number"
								min="0.1"
								max="1"
								step="0.1"
								class="retro-control mt-1"
								bind:value={initialQuality}
							/>
						</div>
						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								id="useWebWorker"
								class="retro-checkbox"
								bind:checked={useWebWorker}
							/>
							<label for="useWebWorker" class="text-sm">Use Web Worker (non-blocking)</label>
						</div>
						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								id="preserveExif"
								class="retro-checkbox"
								bind:checked={preserveExif}
							/>
							<label for="preserveExif" class="text-sm">Preserve EXIF metadata</label>
						</div>
						<button
							type="button"
							class="retro-btn retro-btn--secondary retro-btn--sm"
							on:click={compressAll}
							disabled={compressing || results.length === 0}
						>
							Re-compress
						</button>
					</div>
				{/if}
			</div>

			{#if error}
				<div class="retro-notice retro-notice--warn">
					<span class="font-bold">Error:</span> {error}
				</div>
			{/if}

			{#if compressing}
				<div class="retro-notice retro-notice--info">
					<span class="font-bold">Compressing…</span> {progress}%
				</div>
			{/if}
		</div>
	</section>

	<!-- Results -->
	{#if results.length > 0}
		<section class="retro-paper retro-panel">
			<div class="retro-paper__head retro-panel__head">
				<h2 class="font-black tracking-wide">Compression results</h2>
				<span class="text-xs opacity-80">{results.length} image{results.length === 1 ? "" : "s"}</span>
			</div>
			<div class="retro-panel__body">
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each results as r}
						<div
							class="border border-[#caa96a] bg-white p-3 rounded-none shadow-[2px_2px_0_#b08d4a]"
						>
							<RetroImagePreview
								src={r.previewUrl}
								alt="Compressed preview"
								caption={r.original.name}
								className="mb-2"
							/>
							<div class="text-xs space-y-1">
								<div>
									Original: {formatSize(r.originalSize)} → Compressed: {formatSize(r.compressedSize)}
								</div>
								<div class="font-bold text-[#064e3b]">Saved {r.ratio}</div>
							</div>
							<button
								type="button"
								class="retro-btn retro-btn--primary retro-btn--sm mt-2 w-full"
								on:click={() => download(r.compressed)}
							>
								Download
							</button>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</div>
