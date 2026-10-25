import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanad Assistant",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full min-h-screen bg-transparent overflow-hidden antialiased">
      <style>{`
        html, body {
          background: transparent !important;
          background-color: transparent !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
      {children}
    </div>
  );
}
