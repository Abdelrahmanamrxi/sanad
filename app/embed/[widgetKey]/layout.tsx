import type { ReactNode } from "react";
import type { Metadata } from "next";
import { EmbedTransparencyHandler } from "@/features/embed/components/embed-transparency-handler";

export const metadata: Metadata = {
  title: "Sanad Assistant",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-sanad-embed="true"
      className="w-full h-full min-h-screen bg-transparent overflow-hidden antialiased"
    >
      <EmbedTransparencyHandler />
      {children}
    </div>
  );
}
