<script lang="ts">
    type Point = { x: number; y: number };
    type Line = {
      size?: number;
      pts: Point[];
      src: string;
    };
  
    type RenderItem = {
      id: string;
      src: string;
      width: number;
      height: number;
    };
  
    let { file }: { file: File } = $props();
  
    const BRUSH_HIDE_ON_SLIDER_CHANGE_TIMEOUT = 2000;
  
    let brushSize = $state(40);
    let renders = $state<RenderItem[]>([]);
    let lines = $state<Line[]>([{ pts: [], src: '' }]);
    let showBrush = $state(false);
    let hideBrushTimeout = $state<number | null>(null);
    let showOriginal = $state(false);
    let isProcessingLoading = $state(false);
    let generateProgress = $state(0);
    let downloaded = $state(true);
    let downloadProgress = $state(0);
    let separatorLeft = $state(0);
    let useSeparator = $state(false);
    let isPainting = $state(false);
    let isBrushSizeChange = $state(false);
  
    let canvasEl: HTMLCanvasElement | null = $state(null);
    let canvasWrapEl: HTMLDivElement | null = $state(null);
    let historyListEl: HTMLElement | null = null;
    let brushEl: HTMLDivElement | null = $state(null);
    let brushTransform = $state('translate(-100px, -100px)');
    let separatorHandleEl: HTMLDivElement | null = $state(null);
  
    let originalImage = $state<HTMLImageElement | null>(null);
    let originalSrc = $state('');
    let originalLoaded = $state(false);
    let maskCanvas = $state<HTMLCanvasElement | null>(null);
  
    let scaledBrushSize = $derived(brushSize);
    let currentRender = $derived(renders.at(-1) ?? null);
    let activeImage = $derived(currentRender ?? (originalImage ? {
      id: 'original',
      src: originalSrc,
      width: originalImage.width,
      height: originalImage.height,
    } : null));
  
    function drawLines(
      ctx: CanvasRenderingContext2D,
      sourceLines: Line[],
      color = 'rgba(255, 0, 0, 0.5)'
    ) {
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
  
      sourceLines.forEach((line) => {
        if (!line?.pts.length || !line.size) return;
        ctx.lineWidth = line.size;
        ctx.beginPath();
        ctx.moveTo(line.pts[0].x, line.pts[0].y);
        line.pts.forEach((pt) => ctx.lineTo(pt.x, pt.y));
        ctx.stroke();
      });
    }
  
    async function fileToDataUrl(source: File) {
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(reader.error ?? new Error('Could not read file'));
        reader.readAsDataURL(source);
      });
    }
  
    async function loadImageElement(src: string) {
      return await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = src;
      });
    }
  
    function downloadImage(src: string, name = 'IMG') {
      const a = document.createElement('a');
      a.href = src;
      a.download = `${name}-${Date.now()}.png`;
      a.click();
    }
  
    async function runInpaint(): Promise<string> {
      if (!activeImage || !maskCanvas) throw new Error('Canvas or mask not ready');
      const sourceImg = await loadImageElement(activeImage.src);
      const maskDataUrl = maskCanvas.toDataURL('image/png');
      try {
        const inpaintFn = (await import('$lib/features/inpaint/adapter/inpainting')).default;
        return await inpaintFn(sourceImg, maskDataUrl);
      } catch (err) {
        console.warn('Inpaint adapter failed, using fallback:', err);
        if (!canvasEl) throw new Error('Canvas is not ready');
        return canvasEl.toDataURL('image/png');
      }
    }
  
    async function simulateSuperResolution() {
      // Placeholder for ./adapters/superResolution + model cache
      // Returns the latest image without external model dependencies.
      await new Promise((resolve) => setTimeout(resolve, 400));
      return currentRender?.src ?? originalSrc;
    }
  
    function setBrushPreviewPosition(clientX: number, clientY: number) {
      if (!canvasEl) return;
      /* Position brush relative to canvas using same coord system as paintAt */
      const rect = canvasEl.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      const x = px - scaledBrushSize / 2;
      const y = py - scaledBrushSize / 2;
      brushTransform = `translate(${x}px, ${y}px)`;
    }
  
    function resizeCanvasToImage(target: RenderItem | { width: number; height: number; src: string } | null) {
      if (!canvasEl || !canvasWrapEl || !target) return;
  
      const divWidth = canvasWrapEl.offsetWidth;
      const divHeight = canvasWrapEl.offsetHeight || Math.max(320, Math.floor(divWidth * 0.7));
  
      const imgAspectRatio = target.width / target.height;
      const divAspectRatio = divWidth / divHeight;
  
      let canvasWidth = divWidth;
      let canvasHeight = divHeight;
  
      if (divAspectRatio > imgAspectRatio) {
        canvasHeight = divHeight;
        canvasWidth = target.width * (divHeight / target.height);
      } else {
        canvasWidth = divWidth;
        canvasHeight = target.height * (divWidth / target.width);
      }
  
      canvasEl.width = Math.max(1, Math.round(canvasWidth));
      canvasEl.height = Math.max(1, Math.round(canvasHeight));
    }
  
    function draw(index = -1) {
      if (!canvasEl || !originalImage) return;
  
      const ctx = canvasEl.getContext('2d');
      if (!ctx) return;
  
      const target = index === -1
        ? (activeImage ?? { width: originalImage.width, height: originalImage.height, src: originalSrc })
        : (renders[index] ?? activeImage);
  
      if (!target) return;
  
      resizeCanvasToImage(target);
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  
      const img = new Image();
      img.src = target.src;
      if (img.complete) {
        ctx.drawImage(img, 0, 0, canvasEl.width, canvasEl.height);
        const currentLine = lines.at(-1);
        if (currentLine) drawLines(ctx, [currentLine]);
        return;
      }
  
      img.onload = () => {
        const latest = canvasEl?.getContext('2d');
        if (!latest || !canvasEl) return;
        latest.clearRect(0, 0, canvasEl.width, canvasEl.height);
        latest.drawImage(img, 0, 0, canvasEl.width, canvasEl.height);
        const currentLine = lines.at(-1);
        if (currentLine) drawLines(latest, [currentLine]);
      };
    }
  
    function refreshCanvasMask() {
      if (!canvasEl) throw new Error('Canvas has invalid size');
      if (!maskCanvas) maskCanvas = document.createElement('canvas');
      maskCanvas.width = canvasEl.width;
      maskCanvas.height = canvasEl.height;
      const ctx = maskCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not retrieve mask canvas');
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
      const line = lines.at(-1);
      if (line) drawLines(ctx, [line], 'white');
    }
  
    function onloading() {
      isProcessingLoading = true;
      generateProgress = 0;
      const timer = window.setInterval(() => {
        if (generateProgress < 90) generateProgress += 10 * Math.random();
        else if (generateProgress < 99) generateProgress += 1 * Math.random();
      }, 1000);
  
      return {
        close: () => {
          window.clearInterval(timer);
          generateProgress = 100;
          isProcessingLoading = false;
        }
      };
    }
  
    function startPaint() {
      if (!originalSrc || showOriginal) return;
      const current = lines.at(-1);
      if (!current) return;
      current.size = brushSize;
      isPainting = true;
    }
  
    function paintAt(clientX: number, clientY: number) {
      if (!canvasEl || !isPainting) return;
      const rect = canvasEl.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      /* Scale from displayed coords to canvas internal coords (handles CSS scaling) */
      const scaleX = rect.width > 0 ? canvasEl.width / rect.width : 1;
      const scaleY = rect.height > 0 ? canvasEl.height / rect.height : 1;
      const current = lines.at(-1);
      if (!current) return;
      current.pts.push({ x: px * scaleX, y: py * scaleY });
      draw();
    }
  
    async function finishPaint() {
      if (!isPainting) return;
      isPainting = false;
  
      if (!originalSrc || showOriginal) return;
      const current = lines.at(-1);
      if (!current?.pts.length) return;
  
      const loading = onloading();
      refreshCanvasMask();
  
      try {
        const res = await runInpaint();
        const newImg = await loadImageElement(res);
        renders.push({
          id: `${Date.now()}`,
          src: res,
          width: newImg.width,
          height: newImg.height,
        });
        lines.push({ pts: [], src: '' });
        if (historyListEl) {
          const { scrollWidth, clientWidth } = historyListEl;
          if (scrollWidth > clientWidth) historyListEl.scrollTo(scrollWidth, 0);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        alert(message);
      } finally {
        loading.close();
        draw();
      }
    }
  
    function handleCanvasMouseMove(event: MouseEvent) {
      setBrushPreviewPosition(event.clientX, event.clientY);
      if (isPainting) paintAt(event.clientX, event.clientY);
    }
  
    function handleCanvasTouchMove(event: TouchEvent) {
      event.preventDefault();
      const touch = event.touches[0];
      if (!touch) return;
      setBrushPreviewPosition(touch.clientX, touch.clientY);
      if (isPainting) paintAt(touch.clientX, touch.clientY);
    }
  
    function handleCanvasEnter() {
      if (hideBrushTimeout) window.clearTimeout(hideBrushTimeout);
      showBrush = !showOriginal;
    }
  
    function handleCanvasLeave() {
      showBrush = false;
      void finishPaint();
    }
  
    function handleSliderStart() {
      showBrush = true;
    }
  
    function handleSliderChange(value: number) {
      if (!isBrushSizeChange) isBrushSizeChange = true;
  
      if (canvasEl) {
        const rect = canvasEl.getBoundingClientRect();
        const x = rect.width / 2 - scaledBrushSize / 2;
        const y = rect.height / 2 - scaledBrushSize / 2;
        brushTransform = `translate(${x}px, ${y}px)`;
      }
  
      brushSize = value;
  
      if (hideBrushTimeout) window.clearTimeout(hideBrushTimeout);
      hideBrushTimeout = window.setTimeout(() => {
        showBrush = false;
      }, BRUSH_HIDE_ON_SLIDER_CHANGE_TIMEOUT);
    }
  
    function download() {
      const src = currentRender?.src ?? originalSrc;
      if (!src) return;
      downloadImage(src, 'IMG');
    }
  
    function undo() {
      if (!renders.length) return;
      lines.pop();
      lines.pop();
      lines.push({ pts: [], src: '' });
      renders.pop();
      draw();
    }
  
    function backTo(index: number) {
      lines.splice(index + 1);
      lines.push({ pts: [], src: '' });
      renders.splice(index + 1);
      draw();
    }
  
    function toggleOriginal() {
      showOriginal = !showOriginal;
      if (!showOriginal) separatorLeft = 0;
    }
  
    async function onSuperResolution() {
      isProcessingLoading = true;
      generateProgress = 0;
  
      if (!downloaded) {
        downloadProgress = 0;
        const timer = window.setInterval(() => {
          downloadProgress = Math.min(downloadProgress + 10, 100);
          if (downloadProgress >= 100) {
            downloaded = true;
            window.clearInterval(timer);
          }
        }, 120);
      }
  
      try {
        const res = await simulateSuperResolution();
        const newImg = await loadImageElement(res);
        renders.push({
          id: `${Date.now()}`,
          src: res,
          width: newImg.width,
          height: newImg.height,
        });
        lines.push({ pts: [], src: '' });
        generateProgress = 100;
      } catch (error) {
        console.error('superResolution', error);
      } finally {
        isProcessingLoading = false;
        draw();
      }
    }
  
    function handleKeydown(event: KeyboardEvent) {
      if (!renders.length) return;
      const isCmdZ = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z';
      if (isCmdZ) {
        event.preventDefault();
        undo();
      }
    }
  
    function updateSeparatorFromPointer(clientX: number) {
      if (!canvasEl) return;
      const rect = canvasEl.getBoundingClientRect();
      const next = clientX - rect.left;
      separatorLeft = Math.max(0, Math.min(next, canvasEl.width));
    }
  
    $effect(() => {
      let cancelled = false;
  
      (async () => {
        if (!file) return;
        originalLoaded = false;
        renders = [];
        lines = [{ pts: [], src: '' }];
        separatorLeft = 0;
  
        const src = await fileToDataUrl(file);
        if (cancelled) return;
        const img = await loadImageElement(src);
        if (cancelled) return;
  
        originalSrc = src;
        originalImage = img;
        originalLoaded = true;
        draw();
      })().catch((error) => {
        console.error(error);
      });
  
      return () => {
        cancelled = true;
      };
    });
  
    $effect(() => {
      if (!originalLoaded) return;
      draw();
    });
  
    $effect(() => {
      window.addEventListener('keydown', handleKeydown);
      const handleResize = () => draw();
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('keydown', handleKeydown);
        window.removeEventListener('resize', handleResize);
      };
    });
  
    $effect(() => {
      if (!separatorHandleEl || !showOriginal) return;
  
      const onMove = (event: MouseEvent) => {
        if (!useSeparator) return;
        event.preventDefault();
        updateSeparatorFromPointer(event.clientX);
      };
  
      const onUp = () => {
        useSeparator = false;
        window.removeEventListener('mousemove', onMove);
      };
  
      const onDown = (event: MouseEvent) => {
        event.preventDefault();
        useSeparator = true;
        updateSeparatorFromPointer(event.clientX);
        window.addEventListener('mousemove', onMove);
      };
  
      separatorHandleEl.addEventListener('mousedown', onDown);
      window.addEventListener('mouseup', onUp);
  
      return () => {
        separatorHandleEl?.removeEventListener('mousedown', onDown);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('mousemove', onMove);
      };
    });
  </script>
  
  <div class="editor-root retro-bg flex flex-col gap-4" class:is-busy={isProcessingLoading}>
    <!-- History panel (standalone) -->
    <section bind:this={historyListEl} class="retro-paper retro-panel w-full shrink-0">
      <div class="retro-panel__head retro-paper__head shrink-0">
        <h2 class="font-bold tracking-wide">History</h2>
      </div>
      <div class="retro-panel__body flex gap-4 overflow-x-auto min-h-[5rem]">
        {#if renders.length === 0}
          <span class="retro-field__hint flex items-center">No history yet</span>
        {:else}
          {#each renders as render, index (render.id)}
            <div class="history-item relative shrink-0">
              <img src={render.src} alt="render" class="block h-[70px] rounded-none" />
              <button
                type="button"
                class="retro-btn retro-btn--secondary retro-btn--sm absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 text-retro-cream rounded-none"
                onclick={() => backTo(index)}
                onmouseenter={() => draw(index)}
                onmouseleave={() => draw()}
              >
                Back here
              </button>
            </div>
          {/each}
        {/if}
      </div>
    </section>

    <!-- Stage panel (standalone) -->
    <section class="retro-sky retro-panel w-full shrink-0">
      <div class="retro-sky__head retro-panel__head">
        <h2 class="font-bold tracking-wide">Stage</h2>
        <span class="retro-field__hint ml-auto text-retro-sky-ink truncate max-w-[180px]" title={file.name}>
          {file.name}
        </span>
      </div>
      <div class="retro-panel__body">
        <div class="relative flex justify-center w-full min-h-[48vh] my-2" bind:this={canvasWrapEl}>
      <div class="canvas-stack">
        <canvas
          bind:this={canvasEl}
          class="canvas"
          class:hide-cursor={showBrush}
          onmousemove={handleCanvasMouseMove}
          onmousedown={startPaint}
          onmouseup={finishPaint}
          onmouseenter={handleCanvasEnter}
          onmouseleave={handleCanvasLeave}
          ontouchstart={startPaint}
          ontouchmove={handleCanvasTouchMove}
          ontouchend={finishPaint}
        ></canvas>
  
        {#if showOriginal && originalSrc && canvasEl}
          <div class="absolute top-0 right-0 overflow-hidden pointer-events-none" style:width={`${canvasEl.width}px`} style:height={`${canvasEl.height}px`}>
            <div class="absolute top-0 z-10 bg-retro-navy pointer-events-none" style:left={`${separatorLeft}px`} style:height={`${canvasEl.height}px`} style:width="2px">
              <span class="absolute left-2 bottom-2 px-2 py-1 rounded bg-black/45 text-retro-cream text-xs whitespace-nowrap">original</span>
              <div bind:this={separatorHandleEl} class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-1.5 rounded bg-retro-navy text-retro-cream cursor-ew-resize pointer-events-auto select-none leading-none" title="Drag to compare">
                ||
              </div>
            </div>
            <img
              class="absolute right-0 max-w-none pointer-events-none"
              src={originalSrc}
              alt="original"
              style:width={`${canvasEl.width}px`}
              style:height={`${canvasEl.height}px`}
              style:clip-path={`inset(0 0 0 ${separatorLeft}px)`}
            />
          </div>
        {/if}
  
        {#if isProcessingLoading}
          <div class="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
            <div class="retro-paper p-4 w-[min(80%,420px)]">
              <p class="text-sm">正在处理中，请耐心等待…</p>
              <p class="text-sm opacity-80">It is being processed, please be patient…</p>
              <div class="mt-3 h-3 rounded-full overflow-hidden bg-retro-paper-border">
                <div class="h-full bg-retro-navy transition-all" style:width={`${Math.min(generateProgress, 100)}%`}></div>
              </div>
              <div class="retro-field__hint mt-2">{Math.round(Math.min(generateProgress, 100))}%</div>
            </div>
          </div>
        {/if}

        {#if showBrush}
          <div
            bind:this={brushEl}
            class="brush-preview absolute left-0 top-0 rounded-full bg-red-500/50 pointer-events-none z-10"
            style:width={`${scaledBrushSize}px`}
            style:height={`${scaledBrushSize}px`}
            style:transform={brushTransform}
          ></div>
        {/if}
      </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4 mt-3">
          {#if renders.length > 0}
            <button type="button" class="retro-btn retro-btn--secondary retro-btn--md" onclick={undo}>Undo</button>
          {/if}

          <label class="flex flex-col gap-1 min-w-[180px]">
            <span class="retro-field__label">Brush size</span>
            <input
              type="range"
              class="retro-range"
              min="10"
              max="200"
              value={brushSize}
              onmousedown={handleSliderStart}
              ontouchstart={handleSliderStart}
              oninput={(event) => handleSliderChange(Number((event.currentTarget as HTMLInputElement).value))}
              aria-label="Brush size"
            />
          </label>

          <button
            type="button"
            class="retro-btn retro-btn--md"
            class:retro-btn--primary={showOriginal}
            class:retro-btn--secondary={!showOriginal}
            onclick={toggleOriginal}
          >
            Original
          </button>

          {#if !showOriginal}
            <button type="button" class="retro-btn retro-btn--secondary retro-btn--md" onclick={onSuperResolution}>Upscale</button>
          {/if}

          <button type="button" class="retro-btn retro-btn--primary retro-btn--md" onclick={download}>Download</button>
        </div>
      </div>
    </section>

    {#if !downloaded}
      <div class="fixed inset-0 z-30 flex items-center justify-center bg-white/80">
        <div class="retro-paper p-4 w-[min(80%,420px)]">
          <p class="text-sm">Model download in progress…</p>
          <div class="mt-3 h-3 rounded-full overflow-hidden bg-retro-paper-border">
            <div class="h-full bg-retro-navy transition-all" style:width={`${Math.min(downloadProgress, 100)}%`}></div>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
<style>
  .editor-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    height: 100%;
    min-height: 100%;
  }

  .editor-root.is-busy {
    pointer-events: none;
  }

  .canvas-stack {
    position: relative;
  }

  .canvas {
    display: block;
    max-width: 100%;
    border-radius: 0;
  }

  .canvas.hide-cursor {
    cursor: none;
  }

  .history-item:hover button {
    opacity: 1;
  }
</style>
  