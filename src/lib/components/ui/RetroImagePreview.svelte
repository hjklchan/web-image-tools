<script lang="ts">
  import { cx } from "./retro";
  export let src: string;
  export let alt: string = "";
  export let caption: string | null = null;
  export let className = "";
  export let compact: boolean = false;

  let open = false;
</script>

<div class={cx("space-y-2", className, compact && "max-w-[280px]")}>
  <button
    type="button"
    class={cx(
      "w-full text-left border border-retro-paper-border bg-white p-2 rounded-none",
      "shadow-[2px_2px_0_var(--color-retro-paper-shadow)] focus:outline-none overflow-hidden",
      compact && "max-h-[200px] flex items-center justify-center"
    )}
    on:click={() => (open = true)}
  >
    <img src={src} alt={alt} class={cx("block", compact ? "max-w-full max-h-[180px] w-auto h-auto object-contain" : "w-full h-auto")} />
  </button>

  {#if caption}
    <div class="text-xs opacity-80">{caption}</div>
  {/if}

  {#if open}
    <div class="fixed inset-0 z-50 bg-black/60 p-3 flex items-center justify-center" on:click={() => (open = false)}>
      <div
        class="max-w-5xl w-full border border-retro-paper-border bg-retro-paper shadow-[2px_2px_0_var(--color-retro-paper-shadow)]"
        on:click|stopPropagation
      >
        <div class="px-3 py-2 bg-retro-paper-header border-b border-retro-paper-border flex items-center gap-2">
          <div class="font-bold">Image Viewer</div>
          <div class="ml-auto">
            <button class="underline hover:no-underline text-sm" type="button" on:click={() => (open = false)}>
              [close]
            </button>
          </div>
        </div>
        <div class="p-3 bg-white">
          <img src={src} alt={alt} class="w-full h-auto block" />
        </div>
        {#if caption}
          <div class="px-3 py-2 text-xs">{caption}</div>
        {/if}
      </div>
    </div>
  {/if}
</div>
