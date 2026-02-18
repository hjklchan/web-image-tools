export const retro = {
  bg: "bg-retro-bg",
  ink: "text-retro-ink",
  navy: "bg-retro-navy text-retro-cream border-retro-navy-border",
  paper: "bg-retro-paper border-retro-paper-border",
  paperHeader: "bg-retro-paper-header border-retro-paper-border",
  sky: "bg-retro-sky border-retro-sky-border",
  skyHeader: "bg-retro-sky-header border-retro-sky-border",
  shadowPaper: "shadow-[2px_2px_0_var(--color-retro-paper-shadow)]",
  shadowSky: "shadow-[2px_2px_0_var(--color-retro-sky-shadow)]",
};

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
