export const retro = {
  bg: "bg-[#f5f1d6]",
  ink: "text-[#1b1b1b]",
  navy: "bg-[#143a66] text-[#fef7d6] border-[#0e2746]",
  paper: "bg-[#fffbe3] border-[#caa96a]",
  paperHeader: "bg-[#e8d7a3] border-[#caa96a]",
  sky: "bg-[#eef6ff] border-[#7aa7d9]",
  skyHeader: "bg-[#cfe6ff] border-[#7aa7d9]",
  shadowPaper: "shadow-[2px_2px_0_#b08d4a]",
  shadowSky: "shadow-[2px_2px_0_#5d87b8]",
};

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
