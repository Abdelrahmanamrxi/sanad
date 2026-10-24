import type { ReactNode } from "react";

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return <div className="w-full h-full bg-transparent">{children}</div>;
}
