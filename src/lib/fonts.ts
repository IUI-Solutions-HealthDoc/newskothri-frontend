import { Mukta } from "next/font/google";

/** Hindi UI and body copy — Devanagari + Latin. */
export const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-mukta",
  display: "swap",
});
