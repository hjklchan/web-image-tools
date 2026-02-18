<script lang="ts">
  import { cx, retro } from "./retro";

  export let variant: "paper" | "sky" | "navy" = "paper";
  export let title: string | null = null;
  export let subtitle: string | null = null;
  export let actions: Array<{ label: string; href?: string }> = [];
  export let className = "";

  const base = "border rounded-none overflow-hidden";
  const byVariant = {
    paper: cx(retro.paper, retro.shadowPaper, "border"),
    sky: cx(retro.sky, retro.shadowSky, "border"),
    navy: cx("bg-retro-navy text-retro-cream border border-retro-navy-border shadow-[2px_2px_0_var(--color-retro-navy-dark)]"),
  }[variant];

  const headerByVariant = {
    paper: cx(retro.paperHeader, "border-b"),
    sky: cx(retro.skyHeader, "border-b"),
    navy: cx("bg-retro-navy-border border-b border-retro-navy-dark"),
  }[variant];
</script>

<section class={cx(base, byVariant, className)}>
  {#if title}
    <div class={cx("px-3 py-2 flex flex-wrap items-center gap-2", headerByVariant)}>
      <h2 class="font-bold tracking-wide">{title}</h2>
      {#if subtitle}<span class="text-xs opacity-80">{subtitle}</span>{/if}
      {#if actions?.length}
        <div class="ml-auto flex gap-2 text-xs">
          {#each actions as a}
            {#if a.href}
              <a class="underline hover:no-underline" href={a.href}>{a.label}</a>
            {:else}
              <span class="underline">{a.label}</span>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <div class="p-3">
    <slot />
  </div>
</section>
