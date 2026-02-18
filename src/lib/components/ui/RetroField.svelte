<script lang="ts">
  import { cx } from "./retro";
  export let label: string;
  export let hint: string | null = null;
  export let error: string | null = null;
  export let className = "";
</script>

<div class={cx("space-y-1", className)}>
  <div class="flex items-baseline gap-2">
    <label class="text-xs font-bold">{label}</label>
    {#if hint}<span class="text-[11px] opacity-70">{hint}</span>{/if}
  </div>
  <slot />
  {#if error}
    <div class="text-[11px] text-retro-error-ink bg-retro-error-bg border border-retro-error-border px-2 py-1 rounded-none">
      {error}
    </div>
  {/if}
</div>
