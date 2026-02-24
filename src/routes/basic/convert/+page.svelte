<script lang="ts">
	import { onDestroy } from "svelte";
	import RetroImagePreview from "$lib/components/ui/RetroImagePreview.svelte";

	type Format = "image/jpeg" | "image/png" | "image/webp";

	type ConvertResult = {
		original: File;
		converted: File;
		originalSize: number;
		convertedSize: number;
		previewUrl: string;
	};

	const FORMATS: { label: string; value: Format; ext: string }[] = [
		{ label: "JPEG", value: "image/jpeg", ext: ".jpg" },
		{ label: "PNG", value: "image/png", ext: ".png" },
		{ label: "WebP", value: "image/webp", ext: ".webp" },
	];

	const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/bmp";

	let files: File[] = [];
	let results: ConvertResult[] = [];
	let targetFormat: Format = "image/webp";
	let quality = 0.9;
	let converting = false;
	let error = "";

	async function convertOne(file: File): Promise<ConvertResult> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const url = URL.createObjectURL(file);

			img.onload = () => {
				URL.revokeObjectURL(url);

				const canvas = document.createElement("canvas");
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject(new Error("Canvas not supported"));
					return;
				}

				// Preserve transparency for PNG/WebP; use white background for JPEG
				if (targetFormat === "image/jpeg") {
					ctx.fillStyle = "#ffffff";
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}
				ctx.drawImage(img, 0, 0);

				const options = targetFormat === "image/png" ? undefined : { quality };

				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject(new Error("Conversion failed"));
							return;
						}
						const ext = FORMATS.find((f) => f.value === targetFormat)?.ext ?? ".webp";
						const name = file.name.replace(/\.[^.]+$/, "") + ext;
						const converted = new File([blob], name, { type: targetFormat });
						resolve({
							original: file,
							converted,
							originalSize: file.size,
							convertedSize: converted.size,
							previewUrl: URL.createObjectURL(blob),
						});
					},
					targetFormat,
					options?.quality ?? undefined,
				);
			};
			img.onerror = () => {
				URL.revokeObjectURL(url);
				reject(new Error("Failed to load image"));
			};
			img.src = url;
		});
	}

	async function convertAll() {
		if (files.length === 0) return;

		converting = true;
		results = [];
		error = "";

		try {
			for (const f of files) {
				const r = await convertOne(f);
				results = [...results, r];
			}
		} catch (err) {
			error = err instanceof Error ? err.message : "Conversion failed";
		} finally {
			converting = false;
		}
	}

	function onFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const selected = Array.from(input.files ?? []);
		if (selected.length === 0) return;

		const valid = selected.filter((f) =>
			["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"].includes(f.type),
		);
		if (valid.length !== selected.length) {
			error = "JPG, PNG, WebP, GIF, BMP supported";
			input.value = "";
			return;
		}

		files = valid;
		error = "";
		results.forEach((r) => URL.revokeObjectURL(r.previewUrl));
		results = [];
		convertAll();
		input.value = "";
	}

	function formatSize(bytes: number) {
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
		return (bytes / (1024 * 1024)).toFixed(2) + " MB";
	}

	function download(file: File) {
		const a = document.createElement("a");
		const url = URL.createObjectURL(file);
		a.href = url;
		a.download = file.name;
		a.click();
		URL.revokeObjectURL(url);
	}

	onDestroy(() => {
		results.forEach((r) => URL.revokeObjectURL(r.previewUrl));
	});
</script>

<div class="space-y-4">
	<a href="/basic" class="retro-link text-sm">← Back</a>

	<section class="retro-paper retro-panel">
		<div class="retro-paper__head retro-panel__head">
			<h1 class="font-black tracking-wide">Image Convert</h1>
			<span class="text-xs opacity-80">PNG ↔ JPG ↔ WebP · batch</span>
		</div>

		<div class="retro-panel__body space-y-4">
			<div>
				<label for="convert-file" class="retro-field__label">Select images</label>
				<input
					id="convert-file"
					type="file"
					accept={ACCEPT}
					multiple
					class="retro-control mt-1"
					onchange={onFileChange}
					disabled={converting}
					aria-label="Select images to convert"
				/>
				<div class="retro-field__hint mt-1">
					JPG, PNG, WebP, GIF, BMP supported. Multiple files allowed.
				</div>
			</div>

			<div class="flex flex-wrap items-end gap-4">
				<div>
					<label for="target-format" class="retro-field__label">Target format</label>
					<select
						id="target-format"
						class="retro-control mt-1"
						bind:value={targetFormat}
					>
						{#each FORMATS as f}
							<option value={f.value}>{f.label}</option>
						{/each}
					</select>
				</div>
				{#if targetFormat !== "image/png"}
					<div>
						<label for="quality" class="retro-field__label">Quality (0–1)</label>
						<input
							id="quality"
							type="number"
							min="0.1"
							max="1"
							step="0.1"
							class="retro-control mt-1 w-24"
							bind:value={quality}
						/>
					</div>
				{/if}
				{#if files.length > 0}
					<button
						type="button"
						class="retro-btn retro-btn--secondary retro-btn--sm"
						onclick={convertAll}
						disabled={converting}
					>
						Re-convert
					</button>
				{/if}
			</div>

			{#if error}
				<div class="retro-notice retro-notice--warn">
					<span class="font-bold">Error:</span> {error}
				</div>
			{/if}

			{#if converting}
				<div class="retro-notice retro-notice--info">
					<span class="font-bold">Converting…</span>
				</div>
			{/if}

			{#if results.length > 0}
				<button
					type="button"
					class="retro-btn retro-btn--secondary retro-btn--md"
					onclick={() => document.getElementById("tool-result")?.scrollIntoView({ behavior: "smooth" })}
				>
					View result
				</button>
			{/if}
		</div>
	</section>

	{#if results.length > 0}
		<section id="tool-result" class="retro-paper retro-panel">
			<div class="retro-paper__head retro-panel__head">
				<h2 class="font-black tracking-wide">Converted</h2>
				<span class="text-xs opacity-80">{results.length} image{results.length === 1 ? "" : "s"}</span>
			</div>
			<div class="retro-panel__body">
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each results as r}
						<div
							class="border border-retro-paper-border bg-white p-3 rounded-none shadow-[2px_2px_0_var(--color-retro-paper-shadow)]"
						>
							<RetroImagePreview
								src={r.previewUrl}
								alt="Converted preview"
								caption={r.converted.name}
								className="mb-2"
								compact={true}
							/>
							<div class="text-xs space-y-1">
								<div>
									{formatSize(r.originalSize)} → {formatSize(r.convertedSize)}
								</div>
							</div>
							<button
								type="button"
								class="retro-btn retro-btn--primary retro-btn--sm mt-2 w-full"
								onclick={() => download(r.converted)}
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
