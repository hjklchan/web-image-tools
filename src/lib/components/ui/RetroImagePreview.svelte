<script lang="ts">
  import { cx } from "./retro";
  export let src: string;
  export let alt: string = "";
  export let caption: string | null = null;
  export let className = "";

  let open = false;
</script>

<div class={cx("space-y-2", className)}>
  <button
    type="button"
    class="w-full text-left border border-[#caa96a] bg-white p-2 rounded-none
           shadow-[2px_2px_0_#b08d4a] focus:outline-none"
    on:click={() => (open = true)}
  >
    <img src={src} alt={alt} class="w-full h-auto block" />
  </button>

  {#if caption}
    <div class="text-xs opacity-80">{caption}</div>
  {/if}

  {#if open}
    <div class="fixed inset-0 z-50 bg-black/60 p-3 flex items-center justify-center" on:click={() => (open = false)}>
      <div
        class="max-w-5xl w-full border border-[#caa96a] bg-[#fffbe3] shadow-[2px_2px_0_#b08d4a]"
        on:click|stopPropagation
      >
        <div class="px-3 py-2 bg-[#e8d7a3] border-b border-[#caa96a] flex items-center gap-2">
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
