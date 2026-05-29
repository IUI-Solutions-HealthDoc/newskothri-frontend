"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

type TFn = (hi: string, en: string) => string;

export default function ProfileSignInSection({
  googleSignInEnabled,
  signingIn,
  onGoogleSuccess,
  onGoogleError,
  t,
}: {
  googleSignInEnabled: boolean;
  signingIn: boolean;
  onGoogleSuccess: (cred: { credential?: string }) => void | Promise<void>;
  onGoogleError: () => void;
  t: TFn;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [btnWidth, setBtnWidth] = useState(320);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let lastWidth = 0;
    let stableFrames = 0;
    let debounceId: ReturnType<typeof setTimeout> | undefined;

    const applyWidth = (w: number) => {
      if (w <= 200) return;
      if (lastWidth > 0 && Math.abs(w - lastWidth) < 12) return;
      lastWidth = w;
      setBtnWidth(w);
    };

    const sync = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      if (lastWidth > 0 && Math.abs(w - lastWidth) < 12) {
        stableFrames += 1;
        if (stableFrames >= 2) ro.disconnect();
        return;
      }
      stableFrames = 0;
      clearTimeout(debounceId);
      debounceId = setTimeout(() => applyWidth(w), 80);
    };

    applyWidth(Math.floor(el.getBoundingClientRect().width));
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      clearTimeout(debounceId);
      ro.disconnect();
    };
  }, []);

  const googleBtnWidth = Math.min(Math.max(btnWidth, 280), 400);

  return (
    <div className="profile-signin">
      <div className="profile-signin-copy">
        <p className="profile-signin-kicker">{t("खाता", "Account")}</p>
        <h2 className="profile-signin-title">
          {t("अपना पर्सनल न्यूज़ डैशबोर्ड अनलॉक करें", "Unlock your personal news dashboard")}
        </h2>
        <p className="profile-sub profile-signin-lead">
          {t(
            "बुकमार्क, सेटिंग्स और लेखों पर अपवोट के लिए साइन-इन करें। गोपनीयता नीति प्रोफ़ाइल में उपलब्ध है।",
            "Sign in to save bookmarks, change basic settings, and upvote articles. Our privacy policy is linked from your profile."
          )}
        </p>
        <ul className="profile-signin-list">
          <li>{t("बुकमार्क", "Bookmarks")}</li>
          <li>{t("भाषा जैसी बुनियादी सेटिंग्स", "Basic settings such as language")}</li>
          <li>{t("लेखों पर अपवोट (साइन-इन के बाद)", "Upvote articles after you sign in")}</li>
        </ul>
      </div>

      <div className={`profile-card profile-signin-card${signingIn ? " is-busy" : ""}`} aria-busy={signingIn}>
        <h3 className="profile-signin-card-title">{t("Google से सुरक्षित साइन-इन", "Secure sign-in with Google")}</h3>
        <div ref={wrapRef} className="profile-google-wrap">
          {googleSignInEnabled ? (
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              size="large"
              width={googleBtnWidth}
              text="continue_with"
              theme="outline"
              useOneTap={false}
            />
          ) : (
            <div className="profile-alert" role="status">
              {t(
                "Google sign-in कॉन्फ़िगर नहीं है। web-next/.env.local में NEXT_PUBLIC_GOOGLE_CLIENT_ID सेट करें (backend GOOGLE_CLIENT_ID जैसा), फिर dev सर्वर रीस्टार्ट करें।",
                "Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in web-next/.env.local (same as backend GOOGLE_CLIENT_ID), then restart the dev server."
              )}
            </div>
          )}
        </div>
        {signingIn && <p className="profile-signin-progress">{t("साइन-इन हो रहा है…", "Signing in...")}</p>}
        <p className="profile-trust-line">
          {t(
            "हम आपकी अनुमति के बिना आपके खातों पर कुछ भी पोस्ट नहीं करते।",
            "We never post to your social accounts without your permission."
          )}
        </p>
      </div>
    </div>
  );
}
