import type { CSSProperties, ReactNode } from "react";
import { Send } from "lucide-react";
import { SITE_SOCIAL } from "../../config/siteSocial";
import type { UiLang } from "../../i18n/siteCopy";

export function YtIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

export function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.4a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TwIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M18.3 1.5h3.5l-7.7 8.8 9 11.9H16l-5.5-7.2-6.3 7.2H.6l8.2-9.4L.1 1.5h7.2l5 6.6 5.9-6.6zm-1.2 18.6h1.9L6.8 3.4H4.7l12.4 16.7z" />
    </svg>
  );
}

export function FbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 1-2 2v2.3h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
    </svg>
  );
}

export type SiteSocialLink = {
  key: string;
  name: string;
  nameHi: string;
  url: string;
  icon: ReactNode;
  color: string;
};

export const SITE_SOCIAL_LINKS: SiteSocialLink[] = [
  { key: "yt", name: "YouTube", nameHi: "यूट्यूब", url: SITE_SOCIAL.youtube, icon: <YtIcon />, color: "#FF0000" },
  { key: "ig", name: "Instagram", nameHi: "इंस्टाग्राम", url: SITE_SOCIAL.instagram, icon: <IgIcon />, color: "#E1306C" },
  { key: "tw", name: "X", nameHi: "एक्स", url: SITE_SOCIAL.x, icon: <TwIcon />, color: "#1DA1F2" },
  { key: "fb", name: "Facebook", nameHi: "फेसबुक", url: SITE_SOCIAL.facebook, icon: <FbIcon />, color: "#1877F2" },
  {
    key: "tg",
    name: "Telegram",
    nameHi: "टेलीग्राम",
    url: "https://t.me/kothrinews",
    icon: <Send size={16} strokeWidth={2} aria-hidden />,
    color: "#2AABEE",
  },
];

export function socialLabel(link: SiteSocialLink, lang: UiLang): string {
  return lang === "hi" ? link.nameHi : link.name;
}

type SiteSocialIconButtonProps = {
  link: SiteSocialLink;
  lang: UiLang;
  className?: string;
};

export function SiteSocialIconButton({ link, lang, className = "nav-social-btn" }: SiteSocialIconButtonProps) {
  const label = socialLabel(link, lang);
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={label}
      aria-label={label}
      style={{ "--social-color": link.color } as CSSProperties}
    >
      {link.icon}
    </a>
  );
}
