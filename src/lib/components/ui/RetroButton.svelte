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
      "bg-[#143a66] text-[#fef7d6] border-[#0e2746] shadow-[inset_1px_1px_0_#2c5a95,inset_-1px_-1px_0_#0b1f38]",
    secondary:
      "bg-[#fffbe3] text-[#1b1b1b] border-[#caa96a] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#b08d4a]",
    ghost:
      "bg-white text-[#1b1b1b] border-[#caa96a] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#b08d4a]",
  }[variant];

  const disabledStyle = disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer";
</script>

<button type={type} disabled={disabled} class={cx(base, sizes, variants, disabledStyle, className)}>
  <slot />
</button>
