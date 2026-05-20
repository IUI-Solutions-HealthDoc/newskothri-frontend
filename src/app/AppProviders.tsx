"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { LangProvider } from "../context/LangContext";
import { ReaderAuthProvider } from "../context/ReaderAuthContext";
import { getGoogleWebClientId } from "../lib/googleClientId";

const googleClientId = getGoogleWebClientId();

export default function AppProviders({
  children,
  initialLang = "hi",
}: {
  children: React.ReactNode;
  initialLang?: "hi" | "en";
}) {
  return (
    <LangProvider initialLang={initialLang}>
      <ReaderAuthProvider>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>
        ) : (
          children
        )}
      </ReaderAuthProvider>
    </LangProvider>
  );
}
