import type { Metadata } from "next";
import { siteName, toAbsoluteUrl } from "../../lib/seo/metadataHelpers";
import InstitutionalRouteClient from "../InstitutionalRouteClient";

export const metadata: Metadata = {
  title: "Vision",
  description: "Vision — News Kothari.",
  alternates: { canonical: toAbsoluteUrl("/vision") },
  openGraph: {
    title: `Vision | ${siteName}`,
    description: "Vision — News Kothari.",
    url: toAbsoluteUrl("/vision"),
  },
};

export default function VisionPage() {
  return <InstitutionalRouteClient kind="vision" />;
}
