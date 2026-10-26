"use client";

import { useEffect } from "react";

/**
 * Ensures the embed widget iframe is 100% transparent.
 * Strips theme background colors and suppresses development dev-tools portals.
 */
export function EmbedTransparencyHandler() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.style.setProperty("background", "transparent", "important");
    root.style.setProperty("background-color", "transparent", "important");
    root.style.setProperty("color-scheme", "normal", "important");
    root.setAttribute("data-sanad-embed", "true");

    body.style.setProperty("background", "transparent", "important");
    body.style.setProperty("background-color", "transparent", "important");
    body.style.setProperty("color-scheme", "normal", "important");
    body.classList.remove("bg-background");
    body.setAttribute("data-sanad-embed", "true");
  }, []);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          :root, html, html.dark, html[class*="dark"],
          body, body.dark, body[class*="dark"],
          #__next, main, [data-sanad-embed] {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            color-scheme: normal !important;
          }
          nextjs-portal, [data-nextjs-toast], [data-nextjs-dev-tools] {
            display: none !important;
          }
        `,
      }}
    />
  );
}
