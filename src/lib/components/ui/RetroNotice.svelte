<script lang="ts">
  import { cx } from "./retro";
  export let tone: "info" | "warn" | "ok" = "info";
  export let title: string | null = null;
  export let className = "";

  const toneClass = {
    info: "bg-[#eef6ff] border-[#7aa7d9] text-[#0b2a4a]",
    warn: "bg-[#fff6c9] border-[#caa96a] text-[#3a2a0b]",
    ok: "bg-[#ecfdf5] border-[#86efac] text-[#064e3b]",
  }[tone];
</script>

<div class={cx("border rounded-none px-3 py-2 text-sm", toneClass, className)}>
  {#if title}<span class="font-bold">{title}</span>{/if}
  <slot />
</div>
