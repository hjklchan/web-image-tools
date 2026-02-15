<script lang="ts">
  import { cx } from "./retro";
  export let checked = false;
  export let label = "";
  export let name: string | undefined;
  export let className = "";
</script>

<label class={cx("inline-flex items-center gap-2 text-sm", className)}>
  <input type="checkbox" bind:checked {name} class="h-4 w-4 rounded-none border border-[#caa96a] accent-[#143a66]" />
  <span class="select-none">{label}</span>
</label>
