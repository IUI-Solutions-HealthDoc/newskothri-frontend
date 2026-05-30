import type { Metadata } from "next";
import { siteName, toAbsoluteUrl } from "../../lib/seo/metadataHelpers";
import InstitutionalRouteClient from "../InstitutionalRouteClient";

export const metadata: Metadata = {
  title: "About us",
  description:
    "न्यूज़ कोठरी — आपके मोहल्ले की नुक्कड़ वाली चौपाल, जहाँ खबर, नज़रिया और भौकाल एक साथ मिलते हैं।",
  alternates: { canonical: toAbsoluteUrl("/about") },
  openGraph: {
    title: `About us | ${siteName}`,
    description:
      "न्यूज़ कोठरी — खबरों का असली स्वाद, बिना फिल्टर के।",
    url: toAbsoluteUrl("/about"),
  },
};

export default function AboutPage() {
  return <InstitutionalRouteClient kind="about" />;
}
