<script lang="ts">
    import { onMount, onDestroy } from "svelte";
  
    let hostEl: HTMLDivElement | null = null;
    let stageEl: HTMLDivElement | null = null;
  
    // glfx runtime objects
    let fx: any = null;
    let fxCanvas: HTMLCanvasElement & {
      texture: (img: HTMLImageElement) => any;
      draw: (tex: any) => any;
    } | null = null;
    let texture = $state<any>(null);
    let imgEl: HTMLImageElement | null = null;
  
    let errMsg = $state<string | null>(null);
  
    // realtime + preview scaling
    let realtime = $state(true);
    let previewScale = $state(1); // continuous 0.1..2, wheel-adjustable
  
    // filters
    let brightness = $state(0);    // -1..1
    let contrast = $state(0);      // -1..1
    let saturation = $state(0);    // -1..1
    let hue = $state(0);           // -1..1
    let vignette = $state(0);      // 0..1
    let vignetteSize = $state(0.5);// 0..1
  
    function clamp(n: number, a: number, b: number) {
      return Math.max(a, Math.min(b, n));
    }
  
    async function ensureFX() {
      if (fx) return fx;
      // @ts-ignore
      const mod: any = await import("glfx");
      fx = mod?.default ?? mod;
      return fx;
    }
  
    async function initCanvas() {
      try {
        const FX = await ensureFX();
        const c = FX.canvas(); // HTMLCanvasElement with fx methods
        c.className = "fx-canvas";
        fxCanvas = c;
  
        if (hostEl) {
          hostEl.innerHTML = "";
          hostEl.appendChild(c);
        }
      } catch (e) {
        console.error(e);
        errMsg = "WebGL filters not available on this device/browser.";
      }
    }
  
    function setCanvasSizeForPreview() {
      if (!fxCanvas || !imgEl) return;
      const w = Math.max(1, Math.round(imgEl.naturalWidth * previewScale));
      const h = Math.max(1, Math.round(imgEl.naturalHeight * previewScale));
      fxCanvas.width = w;
      fxCanvas.height = h;
    }
  
    function render() {
      if (!fxCanvas || !texture) return;
  
      const b = clamp(brightness, -1, 1);
      const c = clamp(contrast, -1, 1);
      const s = clamp(saturation, -1, 1);
      const h = clamp(hue, -1, 1);
      const v = clamp(vignette, 0, 1);
      const vs = clamp(vignetteSize, 0, 1);
  
      // Note: some forks swap vignette params; if it looks wrong, swap them.
      let chain = (fxCanvas as any).draw(texture)
        .brightnessContrast(b, c)
        .hueSaturation(h, s);
  
      if (v > 0) chain = chain.vignette(vs, v);
  
      chain.update();
    }
  
    // RAF coalescing for smooth realtime sliders
    let raf = 0;
    function scheduleRender() {
      if (!realtime) return;
      if (!fxCanvas || !texture) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        render();
      });
    }
  
    function rebuildTextureFromImage() {
      if (!fxCanvas || !imgEl) return;
      // IMPORTANT: when canvas size changes (preview scale), re-create texture
      texture = (fxCanvas as any).texture(imgEl);
    }
  
    async function loadFile(file: File) {
      errMsg = null;
      const url = URL.createObjectURL(file);
      await ensureFX();
      await initCanvas();

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imgEl = img;

        if (!fxCanvas) {
          URL.revokeObjectURL(url);
          return;
        }
        setCanvasSizeForPreview();
        rebuildTextureFromImage();
        render();

        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        errMsg = "Failed to load image.";
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  
    function onPickFile(e: Event) {
      const input = e.currentTarget as HTMLInputElement;
      const file = input.files?.[0];
      if (file) loadFile(file);
    }

    const SCALE_STEP = 0.1;
    const SCALE_MIN = 0.1;
    const SCALE_MAX = 2;

    function resetFilters() {
      brightness = 0;
      contrast = 0;
      saturation = 0;
      hue = 0;
      vignette = 0;
      vignetteSize = 0.5;
    }
  
    function exportPNG() {
      if (!fxCanvas) return;
      const a = document.createElement("a");
      a.download = "imazing-filters.png";
      a.href = fxCanvas.toDataURL("image/png");
      a.click();
    }
  
    // React to filter changes (realtime default ON)
    $effect(() => {
      brightness; contrast; saturation; hue; vignette; vignetteSize; realtime;
      scheduleRender();
    });
  
    // React to preview scale changes (resize canvas + rebuild texture + render)
    $effect(() => {
      previewScale;
      if (!imgEl || !fxCanvas) return;
      setCanvasSizeForPreview();
      rebuildTextureFromImage();
      render();
    });
  
    onMount(() => {
      initCanvas();
      const el = stageEl;
      if (!el) return;
      const handler = (e: WheelEvent) => {
        if (!texture) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
        previewScale = clamp(previewScale + delta, SCALE_MIN, SCALE_MAX);
      };
      el.addEventListener("wheel", handler, { passive: false });
      return () => el.removeEventListener("wheel", handler);
    });
  
    onDestroy(() => {
      if (raf) cancelAnimationFrame(raf);
    });
  </script>
  
  <div class="retro-paper retro-panel">
    <div class="retro-paper__head retro-panel__head">
      <div class="font-black tracking-wide">Filters (glfx)</div>
      <div class="ml-auto text-xs opacity-80">client-only · WebGL</div>
    </div>
  
    <div class="retro-panel__body space-y-3">
      {#if errMsg}
        <div class="msg">
          <div class="font-bold">Error</div>
          <div class="opacity-80">{errMsg}</div>
        </div>
      {/if}
  
      <div class="toolbar">
        <input class="retro-control" type="file" accept="image/*" on:input={onPickFile} />
  
        <label class="mini">
          <input type="checkbox" bind:checked={realtime} />
          Realtime
        </label>
  
        <label class="mini">
          Preview
          <input
            type="range"
            min={SCALE_MIN}
            max={SCALE_MAX}
            step={0.05}
            bind:value={previewScale}
            class="retro-control w-24"
          />
          <span class="text-[11px] opacity-70">{Math.round(previewScale * 100)}% · scroll to zoom</span>
        </label>
  
        <button class="retro-btn retro-btn--secondary retro-btn--md" type="button" on:click={resetFilters} disabled={!texture}>
          Reset
        </button>
  
        <button class="retro-btn retro-btn--primary retro-btn--md" type="button" on:click={exportPNG} disabled={!texture}>
          Export PNG
        </button>
      </div>
  
      <div bind:this={stageEl} class="stage" role="img" tabindex="0">
        <div bind:this={hostEl} class="stage-host" />
        {#if !texture}
          <div class="stage-empty">
            <div class="font-bold">Pick an image to start</div>
            <div class="opacity-70 text-sm">Realtime WebGL preview · Export as PNG</div>
          </div>
        {/if}
      </div>
  
      <div class="grid gap-2 lg:grid-cols-2">
        <label class="ctrl">
          <span>Brightness</span>
          <input type="range" min="-1" max="1" step="0.01" bind:value={brightness} />
          <span class="v">{brightness.toFixed(2)}</span>
        </label>
  
        <label class="ctrl">
          <span>Contrast</span>
          <input type="range" min="-1" max="1" step="0.01" bind:value={contrast} />
          <span class="v">{contrast.toFixed(2)}</span>
        </label>
  
        <label class="ctrl">
          <span>Saturation</span>
          <input type="range" min="-1" max="1" step="0.01" bind:value={saturation} />
          <span class="v">{saturation.toFixed(2)}</span>
        </label>
  
        <label class="ctrl">
          <span>Hue</span>
          <input type="range" min="-1" max="1" step="0.01" bind:value={hue} />
          <span class="v">{hue.toFixed(2)}</span>
        </label>
  
        <label class="ctrl lg:col-span-2">
          <span>Vignette</span>
          <input type="range" min="0" max="1" step="0.01" bind:value={vignette} />
          <span class="v">{vignette.toFixed(2)}</span>
        </label>
  
        <label class="ctrl lg:col-span-2">
          <span>Vignette Size</span>
          <input type="range" min="0" max="1" step="0.01" bind:value={vignetteSize} />
          <span class="v">{vignetteSize.toFixed(2)}</span>
        </label>
      </div>
  
      {#if imgEl && fxCanvas}
        <div class="text-[11px] opacity-70">
          Source: {imgEl.naturalWidth}×{imgEl.naturalHeight}
          · Preview: {fxCanvas.width}×{fxCanvas.height} ({Math.round(previewScale * 100)}%)
        </div>
      {/if}
    </div>
  </div>
  
  <style>
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .mini {
      display: inline-flex;
      gap: 6px;
      align-items: center;
      font-size: 12px;
      opacity: 0.9;
    }
  
    .stage {
      position: relative;
      border: 1px solid var(--color-retro-paper-border, #caa96a);
      background: var(--color-retro-paper, #fffbe3);
      height: 50vh;
      min-height: 300px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
    }
    .stage-host {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .stage-host :global(canvas.fx-canvas) {
      display: block;
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
    }
    .stage-empty {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      text-align: center;
      pointer-events: none;
    }
  
    .ctrl {
      display: grid;
      grid-template-columns: 120px 1fr 64px;
      gap: 8px;
      align-items: center;
      border: 1px solid var(--color-retro-paper-border, #caa96a);
      background: white;
      padding: 8px;
    }
    .ctrl .v {
      text-align: right;
      font-variant-numeric: tabular-nums;
      opacity: 0.8;
    }
  
    .msg {
      border: 1px solid var(--color-retro-paper-border, #caa96a);
      background: white;
      padding: 10px;
    }
  </style>
  