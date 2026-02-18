<script lang="ts">
  import { cx } from "./retro";
  export let tone: "info" | "warn" | "ok" = "info";
  export let title: string | null = null;
  export let className = "";

  const toneClass = {
    info: "bg-retro-sky border-retro-sky-border text-retro-sky-ink",
    warn: "bg-retro-paper-light border-retro-paper-border text-retro-warn-ink",
    ok: "bg-retro-ok border-retro-ok-border text-retro-ok-ink",
  }[tone];
</script>

<div class={cx("border rounded-none px-3 py-2 text-sm", toneClass, className)}>
  {#if title}<span class="font-bold">{title}</span>{/if}
  <slot />
</div>
