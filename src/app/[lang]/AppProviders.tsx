"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { LazyMotion } from "framer-motion";
import { LangProvider } from "../../context/LangContext";
import { ReaderAuthProvider } from "../../context/ReaderAuthContext";
import { getGoogleWebClientId } from "../../lib/googleClientId";

const googleClientId = getGoogleWebClientId();
const loadMotionFeatures = () => import("../../lib/motionFeatures").then((mod) => mod.default);

export default function AppProviders({
  children,
  initialLang = "hi",
}: {
  children: React.ReactNode;
  initialLang?: "hi" | "en";
}) {
  return (
    <LazyMotion features={loadMotionFeatures}>
    <LangProvider initialLang={initialLang}>
      <ReaderAuthProvider>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>
        ) : (
          children
        )}
      </ReaderAuthProvider>
    </LangProvider>
    </LazyMotion>
  );
}
