<script lang="ts">
	import { onDestroy } from "svelte";
	import watermark from "watermarkjs";
	import RetroImagePreview from "$lib/components/ui/RetroImagePreview.svelte";

	type WatermarkMode = "text" | "textRepeat" | "image";
	type Position = "lowerRight" | "lowerLeft" | "upperRight" | "upperLeft" | "center";

	const POSITIONS: { label: string; value: Position }[] = [
		{ label: "Lower right", value: "lowerRight" },
		{ label: "Lower left", value: "lowerLeft" },
		{ label: "Upper right", value: "upperRight" },
		{ label: "Upper left", value: "upperLeft" },
		{ label: "Center", value: "center" },
	];

	let baseFile: File | null = null;
	let watermarkFile: File | null = null;
	let previewUrl = "";
	let resultUrl = "";
	let mode: WatermarkMode = "text";
	let error = "";
	let applying = false;

	// Text options
	let textContent = "Watermark";
	let fontSize = 24;
	let textColor = "#ffffff";
	let textAlpha = 0.7;
	let textPosition: Position = "lowerRight";

	// Repeat text options
	let repeatAngle = -30;
	let repeatSpacingX = 200;
	let repeatSpacingY = 120;
	let repeatMargin = 20;

	// Image options
	let imageAlpha = 0.5;
	let imagePosition: Position = "lowerRight";

	function reset() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		if (resultUrl) URL.revokeObjectURL(resultUrl);
		previewUrl = "";
		resultUrl = "";
		baseFile = null;
		watermarkFile = null;
		error = "";
	}

	function onBaseChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type)) {
			error = "JPG, PNG, WebP, GIF supported for base image";
			return;
		}
		reset();
		baseFile = f;
		previewUrl = URL.createObjectURL(f);
		input.value = "";
	}

	function onWatermarkImageChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type)) {
			error = "JPG, PNG, WebP, GIF supported for watermark image";
			return;
		}
		watermarkFile = f;
		input.value = "";
	}

	function getTextDraw() {
		const font = `${fontSize}px sans-serif`;
		const wmText = (watermark as { text: Record<string, CallableFunction> }).text;
		return wmText[textPosition](textContent, font, textColor, textAlpha);
	}

	function getRepeatTextDraw() {
		const font = `${fontSize}px sans-serif`;
		const angleRad = (repeatAngle * Math.PI) / 180;
		return (target: HTMLCanvasElement) => {
			const ctx = target.getContext("2d");
			if (!ctx) return target;
			ctx.save();
			ctx.globalAlpha = textAlpha;
			ctx.fillStyle = textColor;
			ctx.font = font;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			const w = target.width;
			const h = target.height;
			for (let y = repeatMargin; y < h + repeatSpacingY; y += repeatSpacingY) {
				for (let x = repeatMargin; x < w + repeatSpacingX; x += repeatSpacingX) {
					ctx.save();
					ctx.translate(x, y);
					ctx.rotate(angleRad);
					ctx.fillText(textContent, 0, 0);
					ctx.restore();
				}
			}
			ctx.restore();
			return target;
		};
	}

	function getImageDraw() {
		const wmImage = (watermark as { image: Record<string, CallableFunction> }).image;
		return wmImage[imagePosition](imageAlpha);
	}

	async function apply() {
		if (!baseFile) {
			error = "Select a base image first";
			return;
		}
		if ((mode === "text" || mode === "textRepeat") && !textContent.trim()) {
			error = "Enter watermark text";
			return;
		}
		if (mode === "image" && !watermarkFile) {
			error = "Select a watermark image";
			return;
		}

		applying = true;
		error = "";

		try {
			let chain;
			if (mode === "text") {
				chain = watermark([baseFile]).image(getTextDraw());
			} else if (mode === "textRepeat") {
				chain = watermark([baseFile]).image(getRepeatTextDraw());
			} else {
				chain = watermark([baseFile, watermarkFile!]).image(getImageDraw());
			}

			const img = await chain;
			if (resultUrl) URL.revokeObjectURL(resultUrl);
			resultUrl = img.src;
		} catch (err) {
			error = err instanceof Error ? err.message : "Watermark failed";
		} finally {
			applying = false;
		}
	}

	function download() {
		if (!resultUrl || !baseFile) return;
		const a = document.createElement("a");
		a.href = resultUrl;
		a.download = baseFile.name.replace(/(\.[^.]+)$/, "_watermarked$1");
		a.click();
	}

	onDestroy(reset);
</script>

<div class="space-y-4">
	<a href="/basic" class="retro-link text-sm">← Back</a>

	<section class="retro-paper retro-panel">
		<div class="retro-paper__head retro-panel__head">
			<h1 class="font-black tracking-wide">Watermark</h1>
			<span class="text-xs opacity-80">Text / image watermark (client-side)</span>
		</div>

		<div class="retro-panel__body space-y-4">
			<!-- Base image -->
			<div>
				<label for="base-file" class="retro-field__label">Base image</label>
				<input
					id="base-file"
					type="file"
					accept="image/jpeg,image/png,image/webp,image/gif"
					class="retro-control mt-1"
					onchange={onBaseChange}
					aria-label="Select base image"
				/>
			</div>

			<!-- Mode -->
			<fieldset class="border-0 p-0">
				<legend class="retro-field__label">Watermark type</legend>
				<div class="flex flex-wrap gap-4 mt-1">
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="radio"
							name="mode"
							checked={mode === "text"}
							onchange={() => (mode = "text")}
						/>
						<span>Text</span>
					</label>
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="radio"
							name="mode"
							checked={mode === "textRepeat"}
							onchange={() => (mode = "textRepeat")}
						/>
						<span>Text (repeat)</span>
					</label>
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="radio"
							name="mode"
							checked={mode === "image"}
							onchange={() => (mode = "image")}
						/>
						<span>Image</span>
					</label>
				</div>
			</fieldset>

			{#if mode === "text"}
				<div class="space-y-3 border border-retro-paper-border bg-retro-paper p-3">
					<div>
						<label for="wm-text" class="retro-field__label">Text</label>
						<input
							id="wm-text"
							type="text"
							class="retro-control mt-1"
							bind:value={textContent}
							placeholder="Watermark"
						/>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="wm-font-size" class="retro-field__label">Font size (px)</label>
							<input
								id="wm-font-size"
								type="number"
								min="8"
								max="120"
								class="retro-control mt-1"
								bind:value={fontSize}
							/>
						</div>
						<div>
							<label for="wm-color" class="retro-field__label">Color</label>
							<input
								id="wm-color"
								type="color"
								class="retro-control mt-1 h-9"
								bind:value={textColor}
							/>
						</div>
					</div>
					<div>
						<label for="wm-text-alpha" class="retro-field__label">Opacity (0–1)</label>
						<input
							id="wm-text-alpha"
							type="number"
							min="0"
							max="1"
							step="0.1"
							class="retro-control mt-1"
							bind:value={textAlpha}
						/>
					</div>
					<div>
						<label for="wm-text-pos" class="retro-field__label">Position</label>
						<select
							id="wm-text-pos"
							class="retro-control mt-1"
							bind:value={textPosition}
						>
							{#each POSITIONS as p}
								<option value={p.value}>{p.label}</option>
							{/each}
						</select>
					</div>
				</div>
			{:else if mode === "textRepeat"}
				<div class="space-y-3 border border-retro-paper-border bg-retro-paper p-3">
					<div>
						<label for="wm-repeat-text" class="retro-field__label">Text</label>
						<input
							id="wm-repeat-text"
							type="text"
							class="retro-control mt-1"
							bind:value={textContent}
							placeholder="Watermark"
						/>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="wm-repeat-font" class="retro-field__label">Font size (px)</label>
							<input
								id="wm-repeat-font"
								type="number"
								min="8"
								max="120"
								class="retro-control mt-1"
								bind:value={fontSize}
							/>
						</div>
						<div>
							<label for="wm-repeat-color" class="retro-field__label">Color</label>
							<input
								id="wm-repeat-color"
								type="color"
								class="retro-control mt-1 h-9"
								bind:value={textColor}
							/>
						</div>
					</div>
					<div>
						<label for="wm-repeat-alpha" class="retro-field__label">Opacity (0–1)</label>
						<input
							id="wm-repeat-alpha"
							type="number"
							min="0"
							max="1"
							step="0.1"
							class="retro-control mt-1"
							bind:value={textAlpha}
						/>
					</div>
					<div>
						<label for="wm-repeat-angle" class="retro-field__label">Angle (°)</label>
						<input
							id="wm-repeat-angle"
							type="number"
							min="-90"
							max="90"
							class="retro-control mt-1"
							bind:value={repeatAngle}
						/>
						<div class="retro-field__hint mt-1">-90 to 90, e.g. -30 for diagonal</div>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="wm-repeat-spacing-x" class="retro-field__label">Spacing X (px)</label>
							<input
								id="wm-repeat-spacing-x"
								type="number"
								min="50"
								max="800"
								class="retro-control mt-1"
								bind:value={repeatSpacingX}
							/>
						</div>
						<div>
							<label for="wm-repeat-spacing-y" class="retro-field__label">Spacing Y (px)</label>
							<input
								id="wm-repeat-spacing-y"
								type="number"
								min="30"
								max="500"
								class="retro-control mt-1"
								bind:value={repeatSpacingY}
							/>
						</div>
					</div>
					<div>
						<label for="wm-repeat-margin" class="retro-field__label">Margin (px)</label>
						<input
							id="wm-repeat-margin"
							type="number"
							min="0"
							max="200"
							class="retro-control mt-1"
							bind:value={repeatMargin}
						/>
					</div>
				</div>
			{:else}
				<div class="space-y-3 border border-retro-paper-border bg-retro-paper p-3">
					<div>
						<label for="wm-image" class="retro-field__label">Watermark image</label>
						<input
							id="wm-image"
							type="file"
							accept="image/jpeg,image/png,image/webp,image/gif"
							class="retro-control mt-1"
							onchange={onWatermarkImageChange}
						/>
						{#if watermarkFile}
							<div class="text-xs mt-1 opacity-80">{watermarkFile.name}</div>
						{/if}
					</div>
					<div>
						<label for="wm-image-alpha" class="retro-field__label">Opacity (0–1)</label>
						<input
							id="wm-image-alpha"
							type="number"
							min="0"
							max="1"
							step="0.1"
							class="retro-control mt-1"
							bind:value={imageAlpha}
						/>
					</div>
					<div>
						<label for="wm-image-pos" class="retro-field__label">Position</label>
						<select
							id="wm-image-pos"
							class="retro-control mt-1"
							bind:value={imagePosition}
						>
							{#each POSITIONS as p}
								<option value={p.value}>{p.label}</option>
							{/each}
						</select>
					</div>
				</div>
			{/if}

			{#if error}
				<div class="retro-notice retro-notice--warn">
					<span class="font-bold">Error:</span> {error}
				</div>
			{/if}

			<button
				type="button"
				class="retro-btn retro-btn--primary retro-btn--md"
				onclick={apply}
				disabled={applying || !baseFile}
			>
				{applying ? "Applying…" : "Apply watermark"}
			</button>

			{#if resultUrl}
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

	{#if baseFile && previewUrl}
		<section class="retro-paper retro-panel">
			<div class="retro-paper__head retro-panel__head">
				<h2 class="font-black tracking-wide">Preview</h2>
			</div>
			<div class="retro-panel__body">
				<RetroImagePreview
					src={previewUrl}
					alt="Base image"
					caption={baseFile.name}
					className="mb-3"
					compact={true}
				/>
			</div>
		</section>
	{/if}

	{#if resultUrl}
		<section id="tool-result" class="retro-paper retro-panel">
			<div class="retro-paper__head retro-panel__head">
				<h2 class="font-black tracking-wide">Result</h2>
			</div>
			<div class="retro-panel__body">
				<RetroImagePreview
					src={resultUrl}
					alt="Watermarked result"
					caption={baseFile ? baseFile.name.replace(/(\.[^.]+)$/, "_watermarked$1") : null}
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
