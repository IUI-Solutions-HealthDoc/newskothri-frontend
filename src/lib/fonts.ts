import { Mukta } from "next/font/google";

/** Hindi UI and body copy — Devanagari + Latin. */
export const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mukta",
  display: "swap",
});
