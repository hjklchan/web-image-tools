<script lang="ts">
  import { cx } from "./retro";
  export let value: string = "";
  export let placeholder = "";
  export let name: string | undefined;
  export let type: string = "text";
  export let className = "";
  export let disabled = false;
</script>

<input
  bind:value
  {name}
  {type}
  {placeholder}
  {disabled}
  class={cx(
    "w-full bg-white border border-[#caa96a] px-2 py-1.5 text-sm rounded-none outline-none",
    "shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#b08d4a]",
    disabled && "opacity-60 cursor-not-allowed",
    className
  )}
/>
