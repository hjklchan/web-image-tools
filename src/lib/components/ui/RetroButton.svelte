<script lang="ts">
  import { cx } from "./retro";

  export let variant: "primary" | "secondary" | "ghost" = "primary";
  export let size: "sm" | "md" = "md";
  export let type: "button" | "submit" | "reset" = "button";
  export let disabled = false;
  export let className = "";

  const base =
    "inline-flex items-center justify-center select-none whitespace-nowrap rounded-none border px-3 font-bold " +
    "focus:outline-none focus:ring-0";

  const sizes = { sm: "text-xs py-1 px-2", md: "text-sm py-1.5 px-3" }[size];

  const variants = {
    primary:
      "bg-retro-navy text-retro-cream border-retro-navy-border shadow-[inset_1px_1px_0_var(--color-retro-navy-light),inset_-1px_-1px_0_var(--color-retro-navy-dark)]",
    secondary:
      "bg-retro-paper text-retro-ink border-retro-paper-border shadow-[inset_1px_1px_0_white,inset_-1px_-1px_0_var(--color-retro-paper-shadow)]",
    ghost:
      "bg-white text-retro-ink border-retro-paper-border shadow-[inset_1px_1px_0_white,inset_-1px_-1px_0_var(--color-retro-paper-shadow)]",
  }[variant];

  const disabledStyle = disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer";
</script>

<button type={type} disabled={disabled} class={cx(base, sizes, variants, disabledStyle, className)}>
  <slot />
</button>
