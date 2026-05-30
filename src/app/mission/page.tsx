import type { Metadata } from "next";
import { siteName, toAbsoluteUrl } from "../../lib/seo/metadataHelpers";
import InstitutionalRouteClient from "../InstitutionalRouteClient";

export const metadata: Metadata = {
  title: "Mission",
  description: "Mission — News Kothari.",
  alternates: { canonical: toAbsoluteUrl("/mission") },
  openGraph: {
    title: `Mission | ${siteName}`,
    description: "Mission — News Kothari.",
    url: toAbsoluteUrl("/mission"),
  },
};

export default function MissionPage() {
  return <InstitutionalRouteClient kind="mission" />;
}
