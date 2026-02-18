<script lang="ts">
  import { cx } from "./retro";
  export let value: string = "";
  export let name: string | undefined;
  export let options: Array<{ value: string; label: string }> = [];
  export let className = "";
</script>

<select
  bind:value
  {name}
  class={cx(
    "w-full bg-white border border-retro-paper-border px-2 py-1.5 text-sm rounded-none outline-none",
    "shadow-[inset_1px_1px_0_white,inset_-1px_-1px_0_var(--color-retro-paper-shadow)]",
    className
  )}
>
  {#each options as o}
    <option value={o.value}>{o.label}</option>
  {/each}
</select>
